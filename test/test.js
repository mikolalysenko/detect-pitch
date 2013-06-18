"use strict"

var detectPitch = require("../pitch.js")

function runTest(t, n, freq_list) {
  var signal = new Float32Array(n)
  var omega = 2.0 * Math.PI / n
  
  for(var i=0; i<freq_list.length; ++i) {
    var f = freq_list[i]
    for(var j=0; j<1024; ++j) {
      signal[j] = Math.sin(f * j * omega)
    }
    t.equals(Math.round(n/detectPitch(signal)), f)
  }
}

require("tape")("detect-pitch", function(t) {
  runTest(t, 1024, [ 16, 32, 13, 33, 57, 64 ])
  runTest(t, 999, [ 16, 32, 13, 33 ])

  t.end()
})