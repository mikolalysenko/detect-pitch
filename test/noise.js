"use strict"

var detectPitch = require("../pitch.js")

function runTest(t, n, freq_list, phase_list, amplitude_list) {
  var signal = new Float32Array(n)
  var omega = 2.0 * Math.PI / n

  for(var i=0; i<freq_list.length; ++i) {
    var f = freq_list[i]
    for(var j=0; j<n; ++j) {
      signal[j] = Math.sin(f * j * omega + phase_list[i]) * amplitude_list[i] + 0.25*(0.5-Math.random())
    }
    var pitch = detectPitch(signal)
    t.equals(Math.round(n/pitch), f, 'detected period: ' + (pitch) + ', expected: ' + (n/f))
  }
}

require("tape")("detect-pitch: pure sine wave + uniform noise", function(t) {

  var freqs = []
  var phases = []
  var amplitudes = []
  for(var i=16; i<64; ++i) {
    freqs.push(i)
    phases.push(Math.random() * 2.0 * Math.PI)
    amplitudes.push(1)
  }
  runTest(t, 4096, freqs, phases, amplitudes)
  runTest(t, 2048, freqs, phases, amplitudes)
  runTest(t, 1024, freqs, phases, amplitudes)

  t.end()
})
