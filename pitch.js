"use strict"

var bits = require('bit-twiddle')
var pool = require('typedarray-pool')
var ndarray = require('ndarray')
var ops = require('ndarray-ops')
var fft = require('ndarray-fft')
var hann = require('scijs-window-functions/hann')

function square(x, y) {
  var n = x.length
  for(var i=0; i<n; ++i) {
    var a = x[i], b = y[i]
    x[i] = a*a + b*b
    y[i] = 0.0
  }
}

function prefilter(x, xf, n) {
  x[0] = 1
  var s = 0
  for(var i=1; i<n; ++i) {
    var d = Math.max(xf - x[i], 0.0)
    s += d
    x[i] = d * i / s
  }
}

function aperiodic(x, n) {
  if(n<=3) {
    return true
  }
  var d = ((x + 0.5 * n) % n) - 0.5 * n
  return Math.abs(d) > 1
}

function findPeriod(x, lo, hi, threshold) {
  var smallest = 1.0
  var period = 0
  for(var i=lo; i+2<hi; ++i) {
    var y0 = x[i], y1 = x[i+1], y2 = x[i+2]
    var denom = y2 - 2.0 * y1 + y0
    if(Math.abs(denom) < 1e-6) {
      if(y1 < smallest && aperiodic(i+1, period)) {
        smallest = y1
        period = i+1
      }
    } else {
      var s = 0.5 * (y0 - y2) / denom
      if(Math.abs(s) > 1.0) {
        continue
      }
      var ymin = y1 + 0.25 * Math.pow(y0 - y2, 2) / denom
      if(ymin < smallest) {
        var f0 = i + s + 1
        if(aperiodic(f0, period)) {
          smallest = ymin
          period = f0
        }
      }
    }
  }
  if(smallest < 1.0 - threshold) {
    return period
  }
  return 0.0
}

function detectPitch(signal, threshold) {
  threshold = threshold || 0.0

  var xs
  if(signal.shape) {
    xs = signal.shape[0]
  } else {
    xs = signal.length
  }

  var n = bits.nextPow2(2*xs)

  var i, j, k
  var re_arr = pool.mallocFloat(n)
  var im_arr = pool.mallocFloat(n)
  var X = ndarray(re_arr, [n], [1], 0)
  var Y = ndarray(im_arr, [n], [1], 0)

  //Initialize array depending on if it is a typed array
  if(signal.shape) {
    ops.assign(X.hi(xs), signal)
  } else {
    re_arr.set(signal)
  }

  //Compute magnitude
  var magnitude = 0.0
  for(var i=0; i<xs; ++i) {
    var z = re_arr[i] *= hann(i, xs)
    magnitude += Math.pow(z, 2)
  }

  //Zero out arrays
  for(var i=xs; i<n; ++i) {
    re_arr[i] = 0.0
  }
  for(var i=0; i<n; ++i) {
    im_arr[i] = 0.0
  }

  //Autocorrelate
  fft(1, X, Y)
  square(re_arr, im_arr)
  fft(-1, X, Y)

  //Apply prefiltering
  prefilter(re_arr, magnitude, xs)

  //Detect pitch
  var period = findPeriod(re_arr, 0, xs>>>1, threshold)

  //Free temporary arrays
  pool.freeFloat(re_arr)
  pool.freeFloat(im_arr)

  return period
}
module.exports = detectPitch
