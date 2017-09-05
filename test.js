var cpuTimer = require( './cpu-timer.js' )

var test = require( 'tape' )

test( 'api - timer.create()', function ( t ) {
  t.plan( 4 )
  t.timeoutAfter( 1500)

  var timer = cpuTimer.create()

  var init = timer.cpu()
  var initialUsage = init.usage
  var initialAverage = init.average

  console.log( initialUsage )
  console.log( initialAverage )

  t.ok( initialUsage >= 0 && initialAverage <= 100, 'initial usage OK' )
  t.ok( initialAverage >= 0 && initialAverage <= 100, 'initial average OK' )

  setTimeout( function () {
    var cpu = timer.cpu()
    // console.log( cpu.usage )
    // console.log( cpu.average )
    t.ok( cpu.usage > 0 && cpu.usage <= 100, 'usage OK' )
    t.ok( cpu.average > 0 && cpu.average <= 100, 'average OK' )
  }, 666 )
})

test( 'api - timer.setTimeout', function ( t ) {
  t.plan( 2 )
  t.timeoutAfter( 1000 )

  cpuTimer.setTimeout( function ( cpu ) {
    t.ok( cpu.usage >= 0 && cpu.usage <= 100, 'usage OK' )
    t.ok( cpu.average >= 0 && cpu.average <= 100, 'average OK' )
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
    t.ok( cpu.usage >= 0 && cpu.usage <= 100, 'usage OK' )
    t.ok( cpu.average >= 0 && cpu.average <= 100, 'average OK' )

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
