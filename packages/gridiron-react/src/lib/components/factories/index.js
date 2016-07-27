import createColumn from './createColumn'

export default function factories (deps, defaults) {
  return  { column: createColumn(deps, defaults)
          }
}
