import createForm from './createForm'
import createInput from './createInput'


export default function factories (deps, defaults) {
  return  { header: createForm(deps, defaults)
          }
}
