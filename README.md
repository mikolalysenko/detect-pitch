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

console.log(Math.round(n / detectPitch(signal)))

//Prints out:
//
//    100
//
```

## Install

    npm install detect-pitch

### `require("detect-pitch")(signal)`
Detects the pitch of `signal` by computing the period by autocorrelation.

* `signal` is a (possibly windowed) snippet of an audio signal.  Represented as either a typed array or an [ndarray](https://github.com/mikolalysenko/ndarray).

**Returns** The **period** of the signal.  To recover the pitch, divide the sample rate by it.

## Credits
(c) 2013-2015 Mikola Lysenko. MIT License
