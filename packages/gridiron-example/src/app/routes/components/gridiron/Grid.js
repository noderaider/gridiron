import pure from 'lib/modules/pure'
import { idSelector } from 'lib/redux/actions/data'
import Header from './Header'
import styles from './styles.css'
const should = require('chai').should()

const { React, PropTypes, cloneElement, Immutable, gridiron, defaults } = pure
const { Pager, Grid, Columns, Pre, formula } = gridiron

const getFormName = columnID => `filter-form-${columnID}`
const getFilterName = documentID => `filter_${documentID}`

const createFilterStream = columnIDs => {
  const formNames = columnIDs.map(getFormName)
  return onFilter => {
    const unsubscribe = formula.subscribe(formNames, formStates => {
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
      const form = formula(getFormName(this.props.columnID))
      return (
        <div>
          {columnData.entrySeq().map(([ documentID, cells ], documentIndex) => {
            const cellDatum = cells.get(columnID)
            return (
              <form.Field key={documentIndex} name={getFilterName(documentID)} type="checkbox"><Pre>{cellDatum}</Pre></form.Field>
            )
          })}
        </div>
      )
    }
  }
)


export default pure ( pure.profile(),
  { displayName: 'Grid'
  , connect: {
      mapStateToProps: state => {
        const select = idSelector([ 'openflights', 'airlines' ])
        const meta = state.data.getIn(select('meta'), Immutable.Map())

        const columns = Columns ( meta.get('columns', []).filter(x => x !== 'Alias')
                                , { 'Airline ID': { style: { flex: '0 0 2em', alignItems: 'center' }, className: styles.desktop }
                                  , 'Name': { style: { flex: '2 0 7em' } }
                                  , 'IATA': { style: { flex: '0 0 4em' } }
                                  , 'ICAO': { style: { flex: '0 0 4em', alignItems: 'flex-start' } }
                                  , 'Callsign': { style: { flex: '1 0 4em', alignItems: 'flex-start' } }
                                  , 'Country': { style: { flex: '1 0 4em', alignItems: 'flex-start' } }
                                  , 'Active': { style: { flex: '1 0 4em', alignItems: 'flex-start' } }
                                  }
                                )
        console.info('COLUMNS', columns)
        return { select, columns }
      }
    }
  , state: { useContentHeight: false }
  , init() {
      this.toggleFixedHeight = () => {
        const { useContentHeight } = this.state
        this.setState({ useContentHeight: !useContentHeight })
      }
    }
  , componentDidUpdate() {
      this.profile()
    }
  , render() {
      const { select, container, columns } = this.props
      const { useContentHeight } = this.state

/*
      return container(({ Controls, Box, isMaximized, id, actions }) => (
      */
      return (
        <Pager
          documentsPerPage={100}
          columns={columns.ids}
          filterStream={createFilterStream(columns.ids)}

          map={ { documents: state => state.data.getIn(select('results'), Immutable.Map())
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

          sort={Immutable.fromJS(
            { cols: [ 'Airline ID', 'Name' ] //columns.ids
              /*
            , keys: { id: datum => datum
                    , state: datum => Object.keys(datum).join('_')
                    }
                    */
            })
          }
        >
          {pager => (
            /*
            <Box>
            */
              <Grid
                  data={pager.status.get('data', Immutable.Map())}
                  useContentHeight={useContentHeight}
                  /*
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
                  footer={[ (
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
                          ]}
                  {...this.props}
                />
                /*
            </Box>
            */
          )}
        </Pager>
      )
    }
  }
)
