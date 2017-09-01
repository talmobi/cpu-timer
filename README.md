# cpu-timer

# easy to use
```js
var cpuTimer = require( 'cpu-timer' )

var timer = cpuTimer.create()
setTimeout(function () {
  var cpu = timer.cpu()
  console.log( 'process usage: ' + cpu.usage + ' %' )
  console.log( 'system total average: ' + cpu.average + ' %' )
}, 1000)

// or help functions setTimeout and setInterval

cpuTimer.setTimeout(function ( cpu ) {
  console.log( 'process usage: ' + cpu.usage + ' %' )
  console.log( 'system total average: ' + cpu.average + ' %' )
}, 1000)
```

# API

```js
var cpuTimer = require( 'cpu-timer' )

cpuTimer.setTimeout( callback, delay ) // get process and system average cpu % over 'delay' ms

cpuTimer.setInterval( callback, delay ) // safe setInterval ( using setTimeout's, not setInterval )

var timer = cpuTimer.create( callback, delay ) // returns a timer

// get usage and system average cpu % since the last time timer.cpu() was called
// ( called implicitly on creation )
var cpu = timer.cpu() // cpu { usage: 0-100, average: 0-100 }
```

# About
TODO

# How
TODO

# test
```bash
npm test
```
