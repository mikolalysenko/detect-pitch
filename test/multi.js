"use strict"

var detectPitch = require("../pitch.js")

function runTest(t, n, freq_list, phase_list, amplitude_list) {
  var signal = new Float32Array(n)
  var omega = 2.0 * Math.PI / n

  for(var i=0; i<freq_list.length; ++i) {
    var f = freq_list[i]
    for(var j=0; j<n; ++j) {
      signal[j] += Math.sin(f * j * omega + phase_list[i]) * amplitude_list[i]
    }
  }
  var pitch = detectPitch(signal)
  t.equals(Math.round(n/pitch), freq_list[0], 'detected period: ' + (pitch) + ', expected: ' + (n/freq_list[0]))
}

require("tape")("detect-pitch: pure sine wave", function(t) {

  var freqs = [32, 117]
  var phases = [0, 0]
  var amplitudes = [1, 0.1]

  runTest(t, 4096, freqs, phases, amplitudes)
  runTest(t, 2048, freqs, phases, amplitudes)
  runTest(t, 1024, freqs, phases, amplitudes)

  for(var i=16; i<64; ++i) {

    var freqs = [i]
    var phases = [Math.random()]
    var amplitudes = [1]

    for(var j=0; j<2; ++ j) {
      freqs.push(Math.random()*256)
      phases.push(Math.random()*2.0*Math.PI)
      amplitudes.push(0.1)
    }

    runTest(t, 4096, freqs, phases, amplitudes)
    runTest(t, 2048, freqs, phases, amplitudes)
    runTest(t, 1024, freqs, phases, amplitudes)

  }

  t.end()
})
