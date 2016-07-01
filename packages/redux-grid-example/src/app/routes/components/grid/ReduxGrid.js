import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import ReactDOM from 'react-dom'
import shallowCompare from 'react-addons-shallow-compare'
import ReactHeight from 'react-height'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import * as ReactVirtualized from 'react-virtualized'
import reduxGrid from 'redux-grid'
import reactPre from 'react-pre'
import util from 'util'

import reduxPager from 'redux-pager'
import reduxPagerStyles from './css/redux-pager.css' // 'redux-pager/lib/styles.css'


import styles from './css/redux-grid.css'
import sandy from './css/theme/sandy.css'
import subgrid from './css/theme/subgrid.css'


const should = require('chai').should()

const { Pager } = reduxPager({ React, connect, shallowCompare }, { styles: reduxPagerStyles })
const { CoreGrid, DrillGrid, Header, Footer, Expander } = reduxGrid({ React, ReactDOM, ReactVirtualized, connect, Immutable /*, Maximize*/ })
const { Pre, Arrows } = reactPre({ React })


const mapCols = state => {
  return  [ { id: 'id'
            , header: ({ theme }) => <Header hasSort={true} hasFilter={true} theme={theme}>Path</Header>
            //, footer: ({ rows }) => <Footer theme={sandy}>{rows.length} rows</Footer>
            , width: 300
            }
          , { id: 'key'
            , header: ({ theme }) => <Header hasSort={true} hasFilter={true} theme={theme}>State</Header>
            //, footer: ({ rows }) => <Footer theme={sandy}>State</Footer>
            }
          ]
}


const createRowMapper = ({ ids = [] } = {}) => (state, { rows } = {}) => {
  const selectedState = ids.reduce((s, x) => s[x], state)

  return Object.keys(selectedState).reduce((rows, x, i) => {
    const id = [ ...ids, x ]
    return  [ ...rows
            , { id
              , render: () => [ <Arrows>{id}</Arrows>, <Pre>{selectedState[x]}</Pre> ]
              }
            ]
  }, [])
}


class ReduxGrid extends Component {
  constructor(props) {
    super(props)
    this.state = { pager: null, Container: props.maximize.container() }
  }
  render() {
    const { Container } = this.state
    const ReduxGridDetail = detailProps => {
      return props.maximize.container(({ Controls }) => (
          <Pager maxRecords={5} mapRows={createRowMapper({ ids: detailProps.ids })} theme={sandy}>
            {pager => (
              <DrillGrid
                styles={styles}
                theme={sandy}
                mapCols={mapCols}
                mapRows={() => pager.rows}
                mapDrill={(state, parentId) => <ReduxGridDetail ids={parentId} />}
                header={
                  [ <span key="title" style={{ fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 6, fontSize: '1em' }}>
                      <Arrows>{detailProps.ids}</Arrows> details
                    </span>
                  , <Controls key="maximize" />
                  ]
                }
                footer={
                  [ <pager.Controls key="pager-buttons"><pager.Select /></pager.Controls>
                  , <pager.RowStatus key="pager-row-status" />
                  , <pager.PageStatus key="pager-page-status" />
                  , <pager.RowsPerPage label="Rows Per Page" key="rows-per-page" />
                  ]
                }
                maximize={this.props.maximize}
              />
            )}
          </Pager>
        )
      )
    }

    const rowMapper = createRowMapper()

    return (
      <Container>
        {container => (
          <Pager rowsPerPage={5} mapRows={rowMapper} theme={subgrid}>
            {pager => (
              <DrillGrid
                styles={styles}
                theme={subgrid}
                mapCols={mapCols}
                mapRows={() => pager.rows}
                mapDrill={(state, parentId) => <div />} // <ReduxGridDetail ids={parentId} />}
                header={
                  [ <h3 key="title" style={{ margin: 0, letterSpacing: 6 }}>redux-grid</h3>
                  , <span key="maximize">{container.controls}</span> //<Controls key="maximize" />
                  ]
                }
                footer={[ <pager.Controls key="pager-buttons"><pager.Select /></pager.Controls>
                        , <pager.RowStatus key="pager-row-status" />
                        , <pager.PageStatus key="pager-page-status" />
                        , <pager.RowsPerPage label="Rows Per Page" key="rows-per-page" />
                        ]}
                {...this.props}
              />
            )}
          </Pager>
        )}
      </Container>
    )
  }
}

export default ReduxGrid
