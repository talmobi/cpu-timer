
var cpuTimer = require( './cpu-timer.js' )
var t = cpuTimer.create()
console.log( t.cpu() )

// run()

function run () {
	cpuTimer.setTimeout( function ( cpu ) {
		console.log( cpu )
		run()
	}, 1000 )
}

cpuTimer.setInterval( function ( cpu ) {
	console.log( cpu )
}, 1000 )
