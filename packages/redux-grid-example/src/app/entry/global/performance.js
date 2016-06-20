import config, { appName } from 'config-client'
import { assert } from 'chai'

/** Gets the offset MS between now and an window.performance.timing (defaults to navigationStart) */
const timing = new Map()

/** Adds a custom timing event to window[name].performance.timing events */
export const addTiming = (eventName, time = new Date().getTime()) => {
  assert.ok(eventName, 'must specify a name for custom timing event')
  timing.set(eventName, time)
}

/** Safely retrieves a timing from window.performance.timing or window[name].performance.timing */
const getTiming = eventName => {
  let value = window.performance.timing[eventName]
  if(typeof value === 'undefined')
    value = timing.get(eventName)
  assert(typeof value !== 'undefined', `must specify a valid performance.timing or window[name].performance.timing event name => ${name}`)
  return value
}

/** Gets the offset time between a timing event and time or another timing event */
export const getTimingOffset = ({ eventName = 'navigationStart', fromValue = new Date().getTime() }) => {
  const event = getTiming(eventName)
  const startTime = typeof fromValue === 'string' ? getTiming(fromValue) : fromValue
  return startTime - event
}

const hasModernConsole = () => console.group && console.groupCollapsed && console.groupEnd && console.table

/** Prints a table of timings */
export const printTimings = __PROD__ ? () => {} : (collapsed = true) => {
  let timingMap = new Map()
  let timingObj = window.performance.timing.toJSON()
  for(let event of Object.keys(timingObj))
    timingMap.set(event, timingObj[event])
  for(let [event, time] of timing.entries())
    timingMap.set(event, time)

  let timingArray = []
  for(let [event, time] of timingMap.entries())
    timingArray.push({ event, time })
  timingArray.sort((a, b) => a.time - b.time)

  let formatted = []
  for(let timing of timingArray) {
    let { event, time } = timing
    let offset = getTimingOffset({ fromValue: event })
    if(event === 'navigationStart' || offset > 0)
      formatted.push({ event, offset })
  }

  const lastTime = formatted[formatted.length - 1].offset
  const seconds = lastTime / 1000
  const secondsFormatted = `${seconds.toLocaleString ? seconds.toLocaleString('en-us',{ maximumFractionDigits: 2 }) : seconds} seconds`
  const groupName = `timings => ${formatted.length} events | elapsed => ${secondsFormatted} | (toggle breakdown)`
  if(hasModernConsole()) {
    if(collapsed) console.groupCollapsed(groupName)
    else console.group(groupName)
    console.table(formatted)
    console.groupEnd()
  } else {
    console.log(groupName)
    if(collapsed && console.dir) console.dir(formatted)
    else {
      for(let timing of formatted)
        console.log(`${timing.event} => ${timing.offset}`)
    }
  }
}

const perf =  { timing
              , addTiming
              , getTiming
              , getTimingOffset
              , printTimings
              }
export default perf
window[appName] = window[appName] || {}
window[appName].performance = window[appName].performance || perf
