import { DrillGrid as Core } from 'gridiron-core'
import factories from './factories'
import coreGrid from './coreGrid'
import expander from './expander'
const should = require('chai').should()

export default function drillGrid (deps, defaults) {
  const { React, Immutable, connect } = deps
  const { Component, PropTypes } = React

  const CoreGrid = coreGrid(deps)
  const { header } = factories(deps, defaults)
  const Expander = expander(deps, defaults)

  return class DrillGrid extends Component {
    static propTypes = Core.PropTypes(React);
    static defaultProps = Core.DefaultProps(React);
    constructor(props) {
      super(props)
      this.state = { drilledRows: [] }
    }
    render() {
      const { styles, theme, cols, rows, mapDrill, ...rest } = this.props
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
            rows={rows.reduce((rows, x, i) => {
                if(this.state.drilledRows.includes(i)) {
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
                }
                return  [ ...rows
                        , { ...x
                          , cells:  [ () => <Expander expanded={false} handleExpand={() => onToggleExpand(i)} theme={theme} />
                                    , ...x.cells
                                    ]
                          }
                        ]
              }, [])
            }
          />
      )
    }
  }
}
