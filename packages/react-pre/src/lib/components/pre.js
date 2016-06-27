import solvent from 'solvent'
const should = require('chai').should()

/**
 * Factory that creates <Pre /> elements for code blocks
 */
export default function pre (deps) {
  const { React } = solvent({ React: 'object' })(deps)
  const { Component, PropTypes } = React

  const immutableListKeys = [ '_root', '__ownerID', '__hash', '__altered', '_origin', '_capacity', '_level', '_tail' ]
  const immutableMapKeys = [ '_root', '__ownerID', '__hash', '__altered' ]

  const preStyle =  { fontFamily: 'monospace'
                    , fontSize: '0.8em'
                    , lineHeight: 1.55
                    , display: 'flex'
                    , padding: 2
                    , border: '2px solid rgba(100, 100, 255, 0.1)'
                    , borderRadius: 2
                    }
  const labelStyle =  { borderRadius: 2
                      , color: 'rgb(255, 255, 255)'
                      , padding: '1px 2px'
                      , fontSize: '0.9em'
                      }
  const numberStyle = { ...labelStyle
                      , color: 'rgb(0, 148, 177)'
                      , border: '1px dotted rgba(0, 148, 177, 1)'
                      , backgroundColor: 'rgba(255, 255, 255, 0.2)'
                      , fontWeight: 600
                      }
  const stringStyle = { ...labelStyle
                      , backgroundColor: 'rgba(0, 0, 0, 0.6)'
                      , color: 'rgb(190, 219, 57)'
                      }
  const functionStyle = { ...labelStyle
                        , backgroundColor: 'rgba(200, 50, 50, 0.2)'
                        , color: '#000'
                        }
  const boolStyle = { ...labelStyle
                    , backgroundColor: 'rgba(226, 255, 92, 0.5)'
                    , color: 'rgb(159, 57, 219)'
                    , border: '1px dotted rgba(121, 143, 23, 0.6)'
                    , fontWeight: 'bold'
                    }
  const symbolStyle = { ...labelStyle
                      , backgroundColor: 'rgb(200, 100, 110)'
                      }
  const nullStyle = { ...labelStyle
                    , backgroundColor: 'rgba(90, 111, 255, 1)'
                    , color: 'rgb(255, 225, 26)'
                    , opacity: 0.6
                    }

  const undefinedStyle =  { ...labelStyle
                          , backgroundColor: 'rgba(134, 153, 77, 0.8)'
                          , color: 'rgb(255, 225, 26)'
                          }

  const immutableCommon =   { ...labelStyle
                            , fontSize: '0.95em'
                            , position: 'relative'
                            , width: '80%'
                            , minWidth: 140
                            , minHeight: 22
                            , color: 'rgb(0, 0, 0)'
                            }
  const immutableListStyle =  { ...immutableCommon
                              , backgroundColor: 'rgba(31, 138, 112, 0.3)'
                              , border: '2px dashed rgba(31, 138, 112, 0.6)'
                              , marginBottom: 0
                              }
  const immutableMapStyle = { ...immutableCommon
                            , backgroundColor: 'rgba(0, 67, 88, 0.3)'
                            , border: '2px dashed rgba(0, 67, 88, 0.6)'
                            }
  const immutableWatermark =  { transform: 'rotate(0.25turn)'
                              , position: 'absolute'
                              , color: 'rgba(0, 0, 0, 0.5)'
                              , fontWeight: 'bold'
                              , top: 6
                              , right: 0
                              , pointerEvents: 'none'
                              }
  const floats = { float: 'left', clear: 'left' }
  const inlineTable = { display: 'table' }
  return class Pre extends Component {
    render() {
      let parsed = this.parseJS(this.props.children)
      return (
        <pre style={preStyle}>
          {parsed}
        </pre>
      )
    }
    shouldComponentUpdate() {
      return true
    }
    parseJS = (obj, level = 0, { inArray = false, isImmutableMap = false, isImmutableList = false } = {}) => {

      switch(typeof obj) {
        case 'object':
          if(obj === null)
            return <span style={nullStyle}>null</span>

          if(Array.isArray(obj)) {
            return this.parseArray(obj, level, { inArray })
          }

          const objKeys = Object.keys(obj)
          const objStyle =  { marginLeft: `${level * 1.1}em`
                            , marginRight: `${level * 1.1}em`
                            , marginTop: inArray ? '-1.4em' : 0
                            , marginBottom: inArray ? '-1.4em' : 0
                            , width: '100%'
                            }
          const inlineObjStyle =  { ...objStyle
                                  , marginLeft: 0
                                  , color: 'rgb(200, 50, 50)'
                                  }

          if(immutableListKeys.every(x => objKeys.includes(x))) {
            const visibleKeys = objKeys.filter(x => !immutableListKeys.includes(x))
            const { size, _root } = obj
            return (
              <div className="js-immutable-list" style={{ ...objStyle, ...immutableListStyle }}>
                <span key={-1} className="js-immutable-watermark" style={immutableWatermark}>List</span>
                {visibleKeys.map((x, i) => {
                  return (
                    <div key={i} style={inlineTable}>
                      <div style={floats}>{i > 0 ? ', ' : '{ '}</div>
                      {x}: {this.parseJS(obj[x], level + 1, { isImmutableList: true })}{'\n'}
                      {size > 0 && i === visibleKeys.length - 1 ? <div>, entries: {this.parseJS(obj._root.entries, level, { isImmutableList: true })}</div> : null}
                      {i === visibleKeys.length - 1 ? <div style={floats}>}</div> : ''}
                    </div>
                  )
                })}
              </div>
            )
          }

          if(immutableMapKeys.every(x => objKeys.includes(x))) {
            const visibleKeys = objKeys.filter(x => !immutableMapKeys.includes(x))
            const { size, _root } = obj
            return (
              <div className="js-immutable-map" style={{ ...objStyle, ...immutableMapStyle }}>
                <span key={-1} className="js-immutable-watermark" style={immutableWatermark}>Map</span>
                {visibleKeys.map((x, i) => {
                  return (
                    <div key={i} style={inlineTable}>
                      <div style={floats}>{i > 0 ? ', ' : '{ '}</div>
                      {x}: {this.parseJS(obj[x], level + 1, { isImmutableMap: true })}{'\n'}
                      {size > 0 && i === visibleKeys.length - 1 ? <div style={floats}>, entries: {this.parseJS(obj._root.entries, level, { isImmutableMap: true })}</div> : null}
                      {i === visibleKeys.length - 1 ? <div style={floats}>}</div> : ''}
                    </div>
                  )
                })}
              </div>
            )
          }

          return objKeys.length === 0 ? <span className="js-object" style={inlineObjStyle}>{'{}'}</span> : (
            <div className="js-object" style={objStyle}>{objKeys.map((x, i) => {
              return (
                <div key={i} style={inlineTable}>
                  <div style={floats}>{i > 0 ? ', ' : '{ '}</div>
                  {x}: {this.parseJS(obj[x], level + 1)}{'\n'}
                  {i === objKeys.length - 1 ? <div style={floats}>}</div> : ''}
                </div>
              )
            })}</div>
          )

        case 'number':
          return <span style={numberStyle}>{obj.toLocaleString()}</span>
        case 'string':
          return <span style={stringStyle}>'{obj.toString()}'</span>
        case 'boolean':
          return <span style={boolStyle}>{obj.toString()}</span>
        case 'symbol':
          return <span style={symbolStyle}>{obj.toString()}</span>
        case 'function':
          return <div style={functionStyle}>{obj.toString().replace(/[ \n]+/g, ' ').replace(/function \(\) \{ return (.*); \}/, '() => $1')}</div>
        case 'undefined':
          return <span style={undefinedStyle}>undefined</span>
      }
    };
    parseArray = (arr, level, { inArray = false } = {}) => {
      const arrayStyle =  { marginLeft: `${level * 1.1}em`
                          , marginTop: inArray ? '-1.4em' : 0
                          , marginBottom: inArray ? '-1.4em' : 0
                          }
      const inlineArrayStyle =  { ...arrayStyle
                                , marginLeft: 0
                                , color: 'rgb(200, 50, 50)'
                                }
      return arr.length === 0 ? <span className="js-array" style={inlineArrayStyle}>[]</span> : (
        <div className="js-array" style={arrayStyle}>
          {arr.map((x, i) => {
            return (
              <span key={i}>
                {i > 0 ? ', ' : '[ '}
                {this.parseJS(x, level + 1, { inArray: true })}{'\n'}
                {i === arr.length - 1 ? ']' : ''}
              </span>
            )
          })}
        </div>
      )
    };
  }
}
