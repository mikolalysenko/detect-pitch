detect-pitch
============
Detects the pitch of a signal using the autocorrelation method.

## Example

```javascript
var detectPitch = require("detect-pitch")

var n = 1024

var signal = new Float32Array(n)

var omega = 2.0 * Math.PI / n
for(var i=0; i<n; ++i) {
  signal[i] = Math.sin(100 * i * omega)
}

console.log(detectPitch(signal))

//Prints out:
//
//    100
//
```

## Install

    npm install detect-pitch

### `require("detect-pitch")(signal[, options])`
Detects the pitch of `signal`

* `signal` is a (possibly windowed) snippet of an audio signal.  Represented as either a typed array or an [ndarray](https://github.com/mikolalysenko/ndarray).
* `options` is an object containing optional arguments to the function:

    + `options.threshold` a float between `[0,1]` that determines how intense a peak needs to be before it is consider a pitch. (Default `0.9`)
    + `options.start_bin` an integer representing 1/lowest freqeuency.  (Default `16`)
    
**Returns** The frequency of the pitch of the signal.  To recover the period compute `pitch / signal.length`

## Credits
(c) 2013 Mikola Lysenko. MIT License