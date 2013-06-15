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


## Credits
(c) 2013 Mikola Lysenko. MIT License