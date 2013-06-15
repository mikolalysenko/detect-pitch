"use strict"

var detectPitch = require("../pitch.js")

function runTest(t, n, freq_list) {
  var signal = new Float32Array(1024)
  var omega = 2.0 * Math.PI / 1024.0
  
  for(var i=0; i<freq_list.length; ++i) {
    var f = freq_list[i]
    for(var j=0; j<1024; ++j) {
      signal[j] = Math.sin(f * j * omega)
    }
    t.equals(detectPitch(signal), f)
  }
}

require("tape")("detect-pitch", function(t) {
  runTest(t, 1024, [ 16, 32, 13, 33, 57, 64 ])
  runTest(t, 1000, [ 16, 32, 13, 33, 57, 64 ])

  t.end()
})