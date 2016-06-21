import { DrillGrid as Core } from 'redux-grid-core'
import coreGrid from './coreGrid'
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

  return class DrillGrid extends Component {
    static propTypes = Core.PropTypes(React);
    constructor(props) {
      super(props)
      this.state = { drilledRows: [] }
    }
    render() {
      const { styles, mapCols, mapRows, mapDrill, ...rest } = this.props
      const { drilledRows } = this.state
      const isExpanded = index => drilledRows.includes(index)

      const getExpandedIndices = () => this.state.drilledRows
      const isExpandable = index => index > 0
      const getClassName = index => styles.expandedRow
      const getExpanderClassName = index => styles.expander
      const getExpanderWidth = index => 25
      const onToggleExpand = index => {
        let newDrilledRows = drilledRows.includes(index) ? drilledRows.filter(x => x !== index) : [ ...drilledRows, index ]
        newDrilledRows.sort()
        this.setState({ drilledRows: newDrilledRows })
      }

      const expandRowManager =  { getExpandedIndices
                                , isExpandable
                                , getContent: mapDrill
                                , getClassName
                                , getExpanderClassName
                                , getExpanderWidth
                                , onToggleExpand
                                , rowStyle: styles.rowStyle
                                , totalHeight: 0
                                }


      return (
          <CoreGrid
            styles={styles}
            mapCols={mapCols}
            mapRows={mapRows}
            expandedRows={this.state.expandedRows}
            expandRowManager={expandRowManager}
          />
      )
    }
  }
}
