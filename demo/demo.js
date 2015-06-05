var fit = require('canvas-fit')
var detectPitch = require('../pitch')

var NUM_SAMPLES = 4096

var signal = new Float32Array(NUM_SAMPLES)

var audio = new Audio
audio.src = 'Arpeggio.ogg'
audio.loop = true

var pitchDiv = document.createElement('div')
pitchDiv.style.position = 'absolute'
pitchDiv.style.top = '60%'
pitchDiv.style.left = '0px'
pitchDiv.style.width = '100%'
pitchDiv.style['text-align'] = 'center'
pitchDiv.style['font-size'] = '400px'
pitchDiv.style['z-index'] = 10
document.body.appendChild(pitchDiv)

var pitchCanvas = document.createElement('canvas')
pitchCanvas.style['z-index'] = '0'
document.body.appendChild(pitchCanvas)
window.addEventListener('resize', fit(pitchCanvas), false)

var drawContext = pitchCanvas.getContext('2d')
drawContext.fillStyle = '#fff'
drawContext.fillRect(0, 0, pitchCanvas.width, pitchCanvas.height)

var fillColumn = 0

audio.addEventListener('canplay', function() {
  var context = new (window.AudioContext || window.webkitAudioContext)
  var stream = context.createMediaElementSource(audio)
  var analyser = context.createAnalyser(audio)

  stream.connect(analyser)
  analyser.connect(context.destination)

  audio.play()

  function processSection() {
    requestAnimationFrame(processSection)

    analyser.getFloatTimeDomainData(signal)
    var period = detectPitch(signal, 0.2)
    var pitch = -1
    pitchDiv.style['font-size'] = ((0.25*(window.innerHeight))|0) + 'px'
    if(period) {
      pitch = Math.round(44100.0 / period)
      pitchDiv.innerHTML = (pitch) + ' Hz'
    } else {
      pitchDiv.innerHTML = '-'
    }

    drawContext.fillStyle = '#fff'
    drawContext.fillRect(fillColumn % pitchCanvas.width, 0, 1, pitchCanvas.height)
    drawContext.fillStyle = '#00f'
    drawContext.fillRect(fillColumn % pitchCanvas.width, pitch, 1, 1)
    fillColumn += 1
  }

  processSection()
})
