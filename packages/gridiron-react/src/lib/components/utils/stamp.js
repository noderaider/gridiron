import reactStamp from 'react-stamp'

export default function stamp(deps, defaults) {
  const { compose } = reactStamp(deps.React)
  function composePure (...desc) {
    return compose( { shouldComponentUpdate(nextProps, nextState) {
                        return shallowCompare(this, nextProps, nextState)
                      }
                    }
                  , ...desc
                  )
  }

  return { composePure }
}
