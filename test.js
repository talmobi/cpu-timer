var cpuTimer = require( './cpu-timer.js' )

var test = require( 'tape' )

test( 'api - timer.create()', function ( t ) {
  t.plan( 4 )
  t.timeoutAfter( 1000 )

  var timer = cpuTimer.create()

  var initialUsage = timer.usage()
  var initialAverage = timer.average()

  t.ok( initialUsage, 'initial usage OK' )
  t.ok( initialAverage, 'initial average OK' )

  setTimeout( function () {
    t.ok( timer.usage() < initialUsage, 'usage is lower' )
    t.ok( timer.average() < initialAverage, 'average is lower' )
  }, 666 )
})

test( 'api - timer.setTimeout', function ( t ) {
  t.plan( 2 )
  t.timeoutAfter( 1000 )

  cpuTimer.setTimeout( function ( cpu ) {
    t.ok( cpu.usage, 'cpu usage OK' )
    t.ok( cpu.average, 'cpu usage OK' )
  }, 333 )
})

test( 'api - off -> timer.setTimeout', function ( t ) {
  t.plan( 1 )
  t.timeoutAfter( 1000 )

  var off = cpuTimer.setTimeout( function ( cpu ) {
    t.fail( 'timer was not cancelled' )
  }, 333 )

  off()

  setTimeout( function () {
    t.ok( 'timer cancelled OK' )
  }, 666 )
})

test( 'api - timer.setInterval', function ( t ) {
  t.plan( 4 )
  t.timeoutAfter( 1000 )

  var counter = 0

  var off = cpuTimer.setInterval( function ( cpu ) {
    counter++
    t.ok( cpu.usage, 'cpu usage OK' )
    t.ok( cpu.average, 'cpu average OK' )

    if ( counter > 1 ) off()
  }, 333 )
})

test( 'api - off -> timer.setInterval', function ( t ) {
  t.plan( 1 )
  t.timeoutAfter( 1000 )

  var off = cpuTimer.setInterval( function ( cpu ) {
    t.fail( 'timer was not cancelled' )
  }, 333 )

  off()

  setTimeout( function () {
    t.ok( 'timer cancelled OK' )
  }, 666 )
})
