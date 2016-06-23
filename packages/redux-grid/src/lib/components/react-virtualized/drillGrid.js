import { DrillGrid as Core } from 'redux-grid-core'
import coreGrid from './coreGrid'
import expander from '../expander'
const should = require('chai').should()

export default function drillGrid (dependencies) {
  const { React, Immutable, connect } = dependencies
  const { Component, PropTypes } = React

  const rows =  [ [ 'jim', 26, 'being boring', 'male' ]
                , [ 'tony', 37, 'skydiving', 'male' ]
                , [ 'lisa', 40, 'sleeping', 'female' ]
                , [ 'dan', 20, 'jumping', 'male' ]
                , [ 'sarah', 15, 'eating', 'female' ]
                , [ 'michael', 25, 'nothing', 'unsure' ]
                , [ 'michelle', 35, 'idk', 'female' ]
                ]

  const list = Immutable.List(rows)
  const getState = () => ({ rows, list })
  const CoreGrid = coreGrid(dependencies)
  const Expander = expander(dependencies)

  return class DrillGrid extends Component {
    static propTypes = Core.PropTypes(React);
    static defaultProps = Core.DefaultProps(React);
    constructor(props) {
      super(props)
      this.state = { drilledRows: [] }
    }
    render() {
      const { styles, mapCols, mapRows, mapIds, mapDrill, ...rest } = this.props
      const { drilledRows } = this.state
      const onToggleExpand = index => {
        let newDrilledRows = drilledRows.includes(index) ? drilledRows.filter(x => x !== index) : [ ...drilledRows, index ]
        newDrilledRows.sort()
        this.setState({ drilledRows: newDrilledRows })
      }

      let spannedRows = []
      const _mapCols = state => {
        return  [ { id: 'expander', render: () => <Expander visible={false} />, width: 25, className: styles.minimal }
                , ...mapCols(state)
                ]
      }
      const _mapRows = state => {
        const coreRows = mapRows(state)
        return coreRows.reduce((rows, x, i) => {
          if(this.state.drilledRows.includes(i))
            return  [ ...rows,  [ <Expander expanded={true} handleExpand={() => onToggleExpand(i)}/>
                                , ...x
                                ]
                                /** TODO: FINISH ID MAPPING FUNCTIONALITY */
                    , { span: true, render: () => mapDrill(state, i) /*, mapIds(state, i))*/ }
                    ]
          return  [ ...rows,  [ <Expander expanded={false} handleExpand={() => onToggleExpand(i)}/>
                              , ...x
                              ]
                  ]
        }, [])
      }

      return (
          <CoreGrid
            {...rest}
            styles={styles}
            mapCols={_mapCols}
            mapRows={_mapRows}
          />
      )
    }
  }
}
