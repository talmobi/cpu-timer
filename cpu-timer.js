const os = require( 'os' ) // for cpu average

function safeSetInterval ( fn, ms ) {
  var _running = true

  function wrapper () {
    if ( !_running ) return undefined // stop
    fn()
    setTimeout( wrapper, ms )
  }

  setTimeout( wrapper, ms )

  // return off fn
  return function off () {
    _running = false
  }
}

function getCpuAverage () {
  var cpus = os.cpus()

  var total = 0
  var idle = 0

  cpus.forEach(function ( cpu ) {
    var times = cpu.times

    var sum = (
      times.user +
      times.nice +
      times.sys +
      times.idle +
      times.irq
    )

    for ( type in cpu.times ) {
      total += cpu.times[ type ]
    }

    idle += times.idle
  })

  var data = {
    timestamp: Date.now(),
    idle: ( idle / cpus.length ),
    total: ( total / cpus.length )
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

    var idleDiff = ( avg.idle - _lastCpuAverage.idle )
    var totalDiff =  ( avg.total / _lastCpuAverage.total )
    var diff = ( idleDiff / totalDiff )

    var delta = ( now - _lastCpuUsageTime )
    var limit = ( delta ) // milliseconds

    var pct = String( 100 * ( 1 - ( diff / limit ) ) ).trim().slice( 0, 6 )

    _lastCpuAverage = avg
    _lastCpuAverageTime = now
    return pct
  }

  function usage () {
    var cpuUsage = process.cpuUsage()
    var now = Date.now()

    var prevTotal = ( _lastCpuUsage.user + _lastCpuUsage.system )
    var total = ( cpuUsage.user + cpuUsage.system )
    var diff = ( total - prevTotal )

    var delta = ( now - _lastCpuUsageTime )
    var limit = ( delta * 1000 ) // microseconds

    var pct = String( 100 * ( diff / limit ) ).trim().slice( 0, 6 )

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
    average: average,
    usage: usage,
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
