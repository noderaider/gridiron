import { DrillGrid as Core, factories } from 'gridiron-core'
import coreGrid from './coreGrid'
import expander from './expander'
const should = require('chai').should()

export default function drillGrid (deps) {
  const { React, Immutable, connect } = deps
  const { Component, PropTypes } = React

  const CoreGrid = coreGrid(deps)
  const { header } = factories(deps)
  const Expander = expander(deps)


  return class DrillGrid extends Component {
    static propTypes = Core.PropTypes(React);
    static defaultProps = Core.DefaultProps(React);
    constructor(props) {
      super(props)
      this.state = { drilledRows: [] }
    }
    render() {
      const { styles, theme, mapCols, mapRows, mapDrill, ...rest } = this.props
      const { drilledRows } = this.state
      const onToggleExpand = index => {
        let newDrilledRows = drilledRows.includes(index) ? drilledRows.filter(x => x !== index) : [ ...drilledRows, index ]
        newDrilledRows.sort()
        this.setState({ drilledRows: newDrilledRows })
      }


      let spannedRows = []
      const _mapCols = state => {
        const { Header, createSub } = header()
        return  [ { id: 'expander'
                  , header: () => <Header theme={theme}><Expander visible={false} /></Header>
                  , footer: () => <Expander visible={false} />
                  , width: 35
                  , className: styles.minimal
                  }
                , ...mapCols(state)
                ]
      }
      const _mapRows = state => {
        const coreRows = mapRows(state)
        return coreRows.reduce((rows, x, i) => {
          if(this.state.drilledRows.includes(i)) {
            return  [ ...rows
                    , { id: x.id
                      , render: () => [ <Expander expanded={true} handleExpand={() => onToggleExpand(i)} theme={theme} />
                                      , ...x.render()
                                      ]
                      }
                    , { id: `${x.id}_span`
                      , span: true
                      , render: () => mapDrill(state, x.id)
                      }
                    ]
          }
          return  [ ...rows
                  , { id: x.id
                    , render: () => [ <Expander expanded={false} handleExpand={() => onToggleExpand(i)} theme={theme} />
                                    , ...x.render()
                                    ]
                    }
                  ]
        }, [])
      }


      return (
          <CoreGrid
            {...rest}
            styles={styles}
            theme={theme}
            mapCols={_mapCols}
            mapRows={_mapRows}
          />
      )
    }
  }
}
