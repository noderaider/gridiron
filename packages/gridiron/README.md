[![NPM](https://raw.githubusercontent.com/noderaider/gridiron/master/public/png/gridiron.png)](https://npmjs.com/packages/gridiron)

**Feature-Packed Grid Framework for React and ImmutableJS**

**:exclamation: Demo at [gridiron.js.org](https://gridiron.js.org)**

[![Build Status](https://travis-ci.org/noderaider/gridiron-test.svg?branch=master)](https://travis-ci.org/noderaider/gridiron-test)
[![codecov](https://codecov.io/gh/noderaider/gridiron-test/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/gridiron-test)

[![NPM](https://nodei.co/npm/gridiron.png?stars=true&downloads=true)](https://nodei.co/npm/gridiron/)

___

## Install

`npm install -S gridiron gridiron-modules`

For easiest usage across an application, setup a gridiron.js file in a modules folder with the following content:


```js
import gridiron from 'gridiron'
import gridironModules from 'gridiron-modules'

/** Factory that imports all of the gridiron components and feeds them your apps version of its dependencies (React, ReactDOM, addons, etc.) */
export default gridiron(gridironModules(), { themeName: 'mellow' })
```
___

## Components


![pager](https://raw.githubusercontent.com/noderaider/gridiron/master/public/png/pager.png)

All components should be wrapped in a pager component whether you want the data displayed in pages or not. The pager is responsible for taking data from redux and mapping it to the format that the grid and other components expect. Sorting, filtering, and partitioning of the data all occurs at the pager level. By filtering and sorting as early as possible in the rendering hierarchy, gridiron components are able to render fast and bypass unnecessary data.

#### PropTypes

| name                | type            | description                                     |
|---------------------|-----------------|-------------------------------------------------|
| `documentsPerPage`  | `number|null`   | how many documents to show on a single page     |
| `columns`           | `array`         | an array of the column IDs that will be passed  |
| `map`               | `object`        | how to break the data into documents and cells  |
| `mapEarlyProps`     | `function`      | allows early lifecycle filtering of columns     |
| `sort`              | `object`        | which columns to sort by                        |
| `filterStream`      | `function`      | how to filter the data                          |



![grid](https://raw.githubusercontent.com/noderaider/gridiron/master/public/png/grid.png)

**A complex full example:**

```bash

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Immutable from 'immutable'
import Header from './Header'
import styles from './styles.css'

/** Import your applications namespaced gridiron components. */
import gridiron from './modules/gridiron'

const getFormName = columnID => `filter-form-${columnID}`
const getFilterName = documentID => `filter_${documentID}`

/** gridiron filters operate on streams: */
const createFilterStream = columnIDs => {
  const formNames = columnIDs.map(getFormName)
  return onFilter => {
    const unsubscribe = gridiron.formula.subscribe(formNames, formStates => {
      const filterState = columnIDs.reduce((result, columnID, i) => {
        const formState = formStates[i]
        const getFilterValue = documentID => formState ? formState.getIn([ getFilterName(documentID), 'value' ], false) : false
        return { ...result, [columnID]: getFilterValue }
      }, {})

      onFilter(filterState)
    })
    return unsubscribe
  }
}

const FilterForm = pure (
  { displayName: 'FilterForm'
  , propTypes:  { columnID: PropTypes.any
                , columnData: PropTypes.object.isRequired
                }
  , render() {
      const { columnData, columnID } = this.props
      const form = gridiron.formula(getFormName(this.props.columnID))
      return (
        <div>
          {columnData.entrySeq().map(([ documentID, cells ], documentIndex) => {
            const cellDatum = cells.get(columnID)
            return (
              <form.Field key={documentIndex} name={getFilterName(documentID)} type="checkbox"><pre>{JSON.stringify(cellDatum, null, 2)}</pre></form.Field>
            )
          })}
        </div>
      )
    }
  }
)

function mapStateToProps (state) {
  const meta = state.data.getIn([ 'meta' ], Immutable.Map())

  const columns = gridiron.Columns ( meta.get('columns', []).filter(x => x !== 'Alias')
                          , { 'Airline ID': { style: { flex: '0 0 2em', alignItems: 'center' }, className: styles.desktop }
                            , 'Name': { style: { flex: '2 0 7em' } }
                            , 'IATA': { style: { flex: '0 0 4em' } }
                            , 'ICAO': { style: { flex: '0 0 4em', alignItems: 'flex-start' } }
                            , 'Callsign': { style: { flex: '1 0 4em', alignItems: 'flex-start' } }
                            , 'Country': { style: { flex: '1 0 4em', alignItems: 'flex-start' } }
                            , 'Active': { style: { flex: '1 0 4em', alignItems: 'flex-start' } }
                            }
                          )
  return { columns }
}

export default connect(mapStateToProps) (
  class Grid extends Component {
    constructor (props) {
      super(props)
      this.state = { useContentHeight: false }
    }
    toggleFixedHeight = () => {
      const { useContentHeight } = this.state
      this.setState({ useContentHeight: !useContentHeight })
    };
    render() {
      const { container, columns } = this.props
      const { useContentHeight } = this.state

      /**
       * A Pager component is used to split the data with ImmutableJS and hand it
       * to the Grid component in a consistent manner.
       */
      return (
        <gridiron.Pager
          documentsPerPage={100}
          columns={columns.ids}
          filterStream={createFilterStream(columns.ids)}

          map={
            { documents: state => state.data.getIn([ 'results' ], Immutable.Map())
            , cells: (documentID, datum) => Immutable.Map(
                columns.ids.reduce((cells, columnID) => ({ ...cells, [columnID]: datum.get(columnID) }), {})
              )
            }
          }

          /** EARLY PROPS ({ documents }) -> WILL BYPASS UPDATES IF DEFINED HERE */
          mapEarlyProps={
            ({ documents, columnData }) => {
              const columnFilters = columns.reduce(columnID => <FilterForm columnData={columnData} columnID={columnID} />)
              return { columnFilters }
            }
          }

          sort={Immutable.fromJS({ cols: [ 'Airline ID', 'Name' ] })}
        >
          {pager => (
            <gridiron.Grid
                data={pager.status.get('data', Immutable.Map())}
                useContentHeight={useContentHeight}
                /* mapDocument allows creation of a document header and footer row
                mapDocument={(
                  { header: ({ local, documentID, documentIndex, document }) => (
                      <h3>{documentID}</h3>
                    )
                  , footer: ({ local, documentID, documentIndex, document }) => (
                      <h5 style={{ float: 'right' }}>({documentIndex + 1})</h5>
                    )
                  }
                )}
                */
                mapColumn={
                  { local: columnID => columns[columnID]
                  , header: ({ local, columnID, columnIndex }) => local ? (
                      <local.Header
                        actions={pager.actions}
                        fields={
                          { sort: pager.status.get('sort')
                          /*
                          , filter: true
                          , checkbox: true
                          , radio: [ { yes: 'Yes', no: 'No' }, 'yes' ]
                          */
                          }
                        }
                        paneContent={pager.earlyProps.columnFilters[columnID]}
                      >
                        {columnID}
                      </local.Header>
                    ) : null
                  , footer: ({ local, columnID, columnIndex }) => local ? (
                      <local.Footer />
                    ) : null
                  }
                }
                mapCell={({ local, documentIndex, columnIndex, documentID, columnID, datum }) => local ? (
                  <local.Cell documentID={documentID}>
                    {datum}
                  </local.Cell>
                ) : null}
                onDocumentClick={
                  ({ documentID, documentIndex }) => {
                    console.info(`DOCUMENT CLICKED => ${documentID}, ${documentIndex}`)
                  }
                }
                header={
                  [ <Header key="left" title="Grid" subtitle="swiss army knife" description="badass grid" />
                  , (
                      <span key="right" className={styles.controls}>
                        <button className={styles.expandButton} onClick={this.toggleFixedHeight}>
                            <i className="fa fa-arrows-v" />
                        </button>
                        {/*
                        <Controls key="maximize" />
                      */}
                      </span>
                    )
                  ]
                }
                footer={
                  [ (
                      <span key="footer-left">
                        <pager.Controls key="pager-buttons">
                          <pager.Select />
                        </pager.Controls>
                      </span>
                    )
                  , (
                      <span key="footer-center">
                        <pager.DocumentStatus key="pager-row-status" />
                        <pager.PageStatus key="pager-page-status" />
                      </span>
                    )
                  , (
                      <span key="footer-right">
                        <pager.DocumentsPerPage label="Documents Per Page" key="documents-per-page" />
                      </span>
                    )
                  ]
                }
                {...this.props}
              />
          )}
        </gridiron.Pager>
      )
    }
  }
)
```

![accordion](https://raw.githubusercontent.com/noderaider/gridiron/master/public/png/accordion.png)

**Accordion documentation is coming soon!**

![cards](https://raw.githubusercontent.com/noderaider/gridiron/master/public/png/cards.png)

**Cards documentation is coming soon!**

![graph](https://raw.githubusercontent.com/noderaider/gridiron/master/public/png/graph.png)

**Graph documentation is coming soon!**

___

## Contributing

To setup gridiron for use in development run the following steps at CLI:

```bash
npm i -g lerna@latest
git clone https://github.com/noderaider/gridiron
cd gridiron
lerna bootstrap
lerna run start
```

Then from your project:

```bash
npm link ../gridiron/packages/gridiron
# start your project, gridiron should hot reload as you update its source code.
```

___

## Test

**See gridiron's test project at [gridiron-test](https://github.com/noderaider/gridiron-test)**


**In active development, come back in a few days.**
