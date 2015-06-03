detect-pitch
============
Detects the pitch of a signal using the autocorrelation method.

## Example

```javascript
var detectPitch = require("detect-pitch")

var n = 1024
var ω = 2.0 * Math.PI / n

//Initialize signal
var signal = new Float32Array(n)
for(var i=0; i<n; ++i) {
  signal[i] = Math.sin(100 * i * ω)
}

console.log(Math.round(n / detectPitch(signal)))

//Prints out:
//
//    100
//
```

## Install

    npm install detect-pitch

### `require('detect-pitch')(signal)`
Detects the pitch of `signal` by computing the period by autocorrelation.

* `signal` is a (possibly windowed) snippet of an audio signal.  Represented as either a typed array or an [ndarray](https://github.com/scijs/ndarray).

**Returns** The number of samples in the **period** of the signal.  To recover the pitch *frequency*, you need to divide the sample rate by this number:

```javascript
var pitchInHz = sampleRateInHz / periodInSamples
```

## Credits
(c) 2013-2015 Mikola Lysenko. MIT License
