import { browserDefer } from 'try-defer'

export default function universalStyles () {
  if(global.__universal__)
    return global.__universal__._context

  let [ _context, defer ] = browserDefer({ tracing: true })
  global.__universal__ =  { _context
                          , ...defer
                          }
  return _context
}

export function reactStyles(React) {
  if(!global.__universal__ || !global.__universal__.reactReplay)
    return null
  const { reactReplay } = global.__universal__
  if(typeof reactReplay !== 'function')
    throw new Error(`reactReplay was not a function => ${JSON.stringify({ reactReplay })}`)
  return reactReplay(React)
}
