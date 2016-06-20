import React, { PropTypes } from 'react'

const preStyle =  { overflow: 'auto'
                  , wordWrap: 'normal'
                  , whiteSpace: 'pre'
                  , color: 'rgb(255, 255, 60)'
                  , backgroundColor: 'rgb(50, 0, 0)'
                  , fontSize: '0.7em'
                  }

const JsonVisual = props => {
  const { isHorizontal, children } = props
  return (
    <pre style={preStyle}>
      {isHorizontal ? JSON.stringify(children) : <code>{JSON.stringify(children, null, 2)}</code>}
    </pre>
  )
}

JsonVisual.propTypes =  { isHorizontal: PropTypes.bool.isRequired
                        , children: PropTypes.any.isRequired
                        }
JsonVisual.defaultProps = { isHorizontal: false
                          }

export default JsonVisual
