var cpuTimer = require( './cpu-timer.js' )

var timer = cpuTimer.create()

setTimeout(function () {
  var cpu = {
    average: timer.average(),
    usage: timer.usage()
  }

  console.log( 'average: ' + cpu.average )
  console.log( 'usage: ' + cpu.usage )
}, 1000)

cpuTimer.setTimeout(function ( cpu ) {
}, 500)

cpuTimer.setInterval(function ( cpu ) {
  console.log( 'average: ' + cpu.average )
  console.log( 'usage: ' + cpu.usage )
}, 1000 )
