import createPropagator from './createPropagator'

export default function factories (deps) {
  return  { propagator: createPropagator(deps)
          }
}
