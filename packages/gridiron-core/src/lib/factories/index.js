import createPubSub from './createPubSub'
import createHeader from './createHeader'

export default function factories (deps, defaults) {
  return  { pubSub: createPubSub(deps, defaults)
          , header: createHeader(deps, defaults)
          }
}
