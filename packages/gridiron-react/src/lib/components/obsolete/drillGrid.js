import { DrillGrid as Core } from 'gridiron-core'
import coreGrid from './coreGrid'
import expander from './expander'
const should = require('chai').should()

export default function drillGrid (pure) {
  const { React, Immutable, connect, defaults } = pure
  const { Component, PropTypes } = React

  const CoreGrid = coreGrid(pure)
  const Expander = expander(pure)

  return pure (
    { displayName: 'DrillGrid'
    , propTypes: Core.PropTypes(React)
    , defaultProps: Core.DefaultProps(React)
    , state: { drilledRows: [] }
    , render() {
        const { styles, theme, cols, data, mapDrill, ...rest } = this.props
        const { drilledRows } = this.state
        const onToggleExpand = index => {
          let newDrilledRows = drilledRows.includes(index) ? drilledRows.filter(x => x !== index) : [ ...drilledRows, index ]
          newDrilledRows.sort()
          this.setState({ drilledRows: newDrilledRows })
        }
        let spannedRows = []
        const { Header, createSub } = header()

        return (
            <CoreGrid
              {...rest}
              styles={styles}
              theme={theme}
              cols={(
                [ { id: 'expander'
                  , header: () => <Header theme={theme} hasContent={false}><Expander visible={false} /></Header>
                  , footer: () => <Expander visible={false} />
                  , width: 35
                  , className: styles.minimal
                  }
                , ...cols
                ]
              )}
              data={data} /*data.reduce((rows, rowDatum, rowID) => {

                  if(this.state.drilledRows.includes(rowID)) {
                    const drilled = { rowID: `${x.rowId}_span`
                                    , span: true
                                    , render: () => mapDrill(x.rowID)
                                    }
                    return rows.push(drilled)

                    /*
                    return  [ ...rows
                            , { ...x
                              , cells:  [ () => <Expander expanded={true} handleExpand={() => onToggleExpand(i)} theme={theme} />
                                        , ...x.cells
                                        ]
                              }
                            , { rowID: `${x.rowId}_span`
                              , span: true
                              , render: () => mapDrill(x.rowID)
                              }
                            ]
                            */
                            /*
                  }

                  return  [ ...rows
                          , { ...x
                            , cells:  [ () => <Expander expanded={false} handleExpand={() => onToggleExpand(i)} theme={theme} />
                                      , ...x.cells
                                      ]
                            }
                          ]
                }, [])
              }*/
            />
        )
      }
    }
  )
}
