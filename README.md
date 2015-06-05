detect-pitch
============
Detects the pitch of a signal using the autocorrelation method.

## Example

```javascript
var detectPitch = require('detect-pitch')

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

### `require('detect-pitch')(signal[, threshold])`
Detects the pitch of `signal` by computing the period by autocorrelation.

* `signal` is a snippet of an audio signal.  Represented as either a typed array or an [ndarray](https://github.com/scijs/ndarray).
* `threshold` is an optional parameter between `0` and `1` which determines the cutoff for reporting a successful detection.  Higher values indicate stricture cutoff.  Default is `0`

**Returns** The number of samples in the **period** of the signal.  If no pitch was detected, returns `0`.  To recover the pitch *frequency*, you need to divide the sample rate by this number (note that this will be `NaN` for signals with no pitch):

```javascript
var pitchInHz = sampleRateInHz / periodInSamples
```

## Credits
(c) 2013-2015 Mikola Lysenko. MIT License
