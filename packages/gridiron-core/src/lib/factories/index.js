import createHeader from './createHeader'

export default function factories (deps, defaults) {
  return  { header: createHeader(deps, defaults)
          }
}
