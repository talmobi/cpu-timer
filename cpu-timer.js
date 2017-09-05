const os = require( 'os' ) // for cpu average

function safeSetInterval ( fn, ms ) {
  var _running = true
  var _timeout

  function wrapper () {
    if ( !_running ) return undefined // stop
    fn()
    _timeout = setTimeout( wrapper, ms )
  }

  _timeout = setTimeout( wrapper, ms )

  // return off fn
  return function off () {
    _running = false
    clearTimeout( _timeout )
  }
}

function getCpuAverage () {
  var cpus = os.cpus()

  var used = 0
  var idle = 0

  cpus.forEach(function ( cpu ) {
    var times = cpu.times

    var sum = 0
    for ( type in cpu.times ) {
      sum += cpu.times[ type ]
    }

    used += sum - times.idle
    idle += times.idle
  })

  var data = {
    timestamp: Date.now(),
    idle: ( idle ),
    used: ( used )
  }

  return data
}

function createTimer () {
  var now = Date.now()

  var _lastCpuAverage = getCpuAverage()
  var _lastCpuAverageTime = now

  var _lastCpuUsage = process.cpuUsage()
  var _lastCpuUsageTime = now

  function average () {
    var avg = getCpuAverage()
    var now = Date.now()

    var idleDiff = ( avg.idle - _lastCpuAverage.idle ) + 1
    var usedDiff =  ( avg.used - _lastCpuAverage.used ) + 0.1

    var pct = (
      String( 100 * ( usedDiff / ( usedDiff + idleDiff ) ) )
      .trim()
      .slice( 0, 6 )
    )

    _lastCpuAverage = avg
    _lastCpuAverageTime = now
    return pct
  }

  function usage () {
    var cpuUsage = process.cpuUsage()
    var now = Date.now()

    var prevTotal = ( _lastCpuUsage.user + _lastCpuUsage.system )
    var total = ( cpuUsage.user + cpuUsage.system )
    var diff = ( total - prevTotal ) + 0.01

    var delta = ( now - _lastCpuUsageTime )
    var limit = ( delta * 1000 ) + 0.1 // microseconds to milliseconds

    var pct = (
      String( 100 * ( diff / limit ) )
      .trim()
      .slice( 0, 6 )
    )

    _lastCpuUsage = cpuUsage
    _lastCpuUsageTime = now
    return pct
  }

  function both () {
    var cpu = {
      average: average(),
      usage: usage()
    }

    return cpu
  }

  var api = {
    // average: average,
    // usage: usage,
    cpu: both
  }

  return api
}

function createInterval( callback, interval ) {
  var timer = createTimer()

  // return off function
  return safeSetInterval( function () {
    callback( timer.cpu() )
    // callback({
    //   average: timer.average(),
    //   usage: timer.usage()
    // })
  }, interval )
}

function createTimeout ( callback, delay ) {
  var timer = createTimer()

  var _timeout = setTimeout( function () {
    callback( timer.cpu() )
  }, delay )

  // return off function
  return function off () {
    clearTimeout( _timeout )
  }
}

module.exports = {
  create: createTimer,
  setTimeout: createTimeout,
  setInterval: createInterval
}
