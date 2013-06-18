"use strict"

var bits = require("bit-twiddle")
var pool = require("typedarray-pool")
var ndarray = require("ndarray")
var ops = require("ndarray-ops")
var fft = require("ndarray-fft")

function zero(arr, lo, hi) {
  for(var i=lo; i<hi; ++i) {
    arr[i] = 0.0
  }
}

function square(x, y) {
  var n = x.length, n2 = Math.ceil(0.5*n)|0
  x[0] = y[0] = 0.0
  for(var i=1; i<n2; ++i) {
    var a = x[i], b = y[i]
    x[n-i] = x[i] = a*a + b*b
    y[n-i] = y[i] = 0.0
  }
}

function findPeriod(x, lo, hi, scale_f) {
  //1st pass compute best val
  var loc_m = 0.0
  for(var i=lo; i<hi; ++i) {
    loc_m = Math.max(loc_m, x[i])
  }
  //2nd pass compute max
  var threshold = loc_m * scale_f
  for(var i=lo; i<hi; ++i) {
    if(x[i] > threshold) {
      var best = x[i]
      var r = i
      for(var j=i; j < hi && x[j] > threshold; ++j) {
        if(x[j] > best) {
          best = x[j]
          r = j
        }
      }
      var y0 = x[r-1], y1 = x[r], y2 = x[r+1]
      var denom = y2 - y1 + y0
      if(Math.abs(denom) < 1e-6) {
        return r
      }
      var numer = y0 - y2
      return r + 0.5 * numer / denom
    }
  }
  return 0
}

function detectPitch(signal, options) {
  options = options || {}
  var xs
  if(signal.shape) {
    xs = signal.shape[0]
  } else {
    xs = signal.length
  }
  
  var i, j, k
  var n = bits.nextPow2(2*xs)
  var re_arr = pool.mallocFloat(n)
  var im_arr = pool.mallocFloat(n)
  var X = ndarray.ctor(re_arr, [n], [1], 0)
  var Y = ndarray.ctor(im_arr, [n], [1], 0)
  
  //Initialize array depending on if it is a typed array
  if(signal.shape) {
    X.shape[0] = xs
    ops.assign(X, signal)
    X.shape[0] = n
  } else {
    re_arr.set(signal)
  }
  zero(re_arr, xs, n)
  zero(im_arr, 0, n)
  
  //Autocorrelate
  fft(1, X, Y)
  square(re_arr, im_arr)
  fft(-1, X, Y)
  
  //Detect pitch
  var threshold = options.threshold || 0.9
  var period = findPeriod(
          re_arr,
          options.start_bin || 16,
          xs>>>1,
          threshold)
  
  //Free temporary arrays
  pool.freeFloat(re_arr)
  pool.freeFloat(im_arr)
  
  return period
}
module.exports = detectPitch