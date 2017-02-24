import cn from 'classnames'
import solvent from 'solvent'

const should = require('chai').should()

function nextDirection(direction) {
  switch(direction) {
    case 'asc':
      return 'desc'
    case 'desc':
      return null
    default:
      return 'asc'
  }
}

export default function pager (pure) {
  const { React, PropTypes, cloneElement, connect, shallowCompare, Immutable, defaults } = pure
  const { styles, theme } = defaults
  const desktopStyles = [ styles.desktop, theme.desktop ]
  const mobileStyles = [ styles.mobile, theme.mobile ]

  const contentShape =  { FastBackward: PropTypes.any.isRequired
                        , StepBackward: PropTypes.any.isRequired
                        , StepForward: PropTypes.any.isRequired
                        , FastForward: PropTypes.any.isRequired
                        , PageStatus: PropTypes.any.isRequired
                        , DocumentStatus: PropTypes.any.isRequired
                        , DocumentCount: PropTypes.any.isRequired
                        , selectOption: PropTypes.func.isRequired
                        , documentsPerPageOption: PropTypes.func.isRequired
                        }

  const propTypes = { children: PropTypes.func.isRequired
                    , styles: PropTypes.object.isRequired
                    , theme: PropTypes.object.isRequired
                    , columns: PropTypes.array
                    , sort: PropTypes.object
                    , createSortKeys: PropTypes.func.isRequired
                    , createSortKeyComparator: PropTypes.func.isRequired
                    , page: PropTypes.number.isRequired
                    , documentsPerPage: PropTypes.any
                    , documentsPerPageOptions: PropTypes.arrayOf(PropTypes.any).isRequired
                    , typeSingular: PropTypes.string.isRequired
                    , typePlural: PropTypes.string.isRequired
                    , content: PropTypes.shape(contentShape).isRequired
                    }
                          /** CREATES SORT KEYS FOR A DOCUMENT */
  const defaultProps =  { createSortKeys: (cells, access) => {
                            const sort = access.sort
                            return sort.get('cols')
                              .filter(columnID => typeof sort.getIn([ 'direction', columnID ]) === 'string')
                              .map(columnID => {
                                const sortKey = sort.getIn([ 'keys', columnID ], null)
                                const cellDatum = cells.get(columnID)
                                const currentKey = sortKey ? sortKey(cellDatum) : cellDatum
                                switch(typeof currentKey) {
                                  case 'number':
                                  case 'string':
                                    return currentKey
                                  default:
                                    return currentKey.toString()
                                }
                              })
                          }
                          /** COMPARES SORT KEYS OF TWO DOCUMENTS */
                        , createSortKeyComparator: access => {
                            const sort = access.sort
                            const multipliers = sort.get('direction') ? sort.get('cols').map(columnID => sort.getIn([ 'direction', columnID ]) === 'desc' ? -1 : 1) : []
                            return (sortKeysA, sortKeysB) => {
                              for(let colIndex = 0; colIndex < sortKeysA.size; colIndex++) {
                                let result
                                let keyA = sortKeysA.get(colIndex)
                                let keyB = sortKeysB.get(colIndex)
                                let multiplier = multipliers.get(colIndex)
                                if(typeof keyA === 'number') {
                                  if(keyA > keyB)
                                    return 1 * multiplier
                                  if(keyB > keyA)
                                    return -1 * multiplier
                                  continue
                                }
                                result = keyA.localeCompare(keyB) * multiplier
                                if(result !== 0)
                                  return result
                              }
                              return 0
                            }
                          }
                        , page: 0
                        , documentsPerPage: null
                        , documentsPerPageOptions: [ 1, 2, 3, 4, 5, 10, 25, 50, 100, 500, 1000, 'All' ]
                        , typeSingular: 'document'
                        , typePlural: 'documents'
                        , content:  { FastBackward: ({ status, ...props }) => <i className={'fa fa-fast-backward'} />
                                    , StepBackward: ({ status, ...props }) => <i className={'fa fa-step-backward'} />
                                    , StepForward: ({ status, ...props }) => <i className={'fa fa-step-forward'} />
                                    , FastForward: ({ status, ...props }) => <i className={'fa fa-fast-forward'} />
                                    , PageStatus: ({ status, ...props }) => (
                                        <span className={cn(styles.pageStatus, theme.pageStatus, ...desktopStyles)}>
                                          Page {(status.get('page') + 1).toLocaleString()} of {status.get('pages')}
                                        </span>
                                      )
                                    , PageStatusMobile: ({ status, ...props }) => (
                                        <span className={cn(styles.pageStatus, theme.pageStatus, ...mobileStyles)}>
                                          {(status.get('page') + 1).toLocaleString()} / {status.get('pages')}
                                        </span>
                                      )
                                    , DocumentStatus: ({ status, ...props }) => (
                                        <span className={cn(styles.documentStatus, theme.documentStatus, ...desktopStyles)}>
                                          Showing {props.typePlural} {(status.get('startIndex') + 1).toLocaleString()} through {status.get('lastIndex').toLocaleString()} ({status.get('totalDocuments').toLocaleString()} total)
                                        </span>
                                      )
                                    , DocumentStatusMobile: ({ status, ...props }) => (
                                        <span className={cn(styles.documentStatus, theme.documentStatus, ...mobileStyles)}>
                                          {(status.get('startIndex') + 1).toLocaleString()} - {status.get('lastIndex').toLocaleString()} / {status.get('totalDocuments').toLocaleString()}
                                        </span>
                                      )
                                    , DocumentCount: ({ status, ...props }) => (
                                        <span className={cn(styles.documentCount, theme.documentCount, ...desktopStyles)}>
                                          {status.totalDocuments.toLocaleString()} {status.get('totalDocuments') === 1 ? props.typeSingular : props.typePlural}
                                        </span>
                                      )
                                    , DocumentCountMobile: ({ status, ...props }) => (
                                        <span className={cn(styles.documentCount, theme.documentCount, ...mobileStyles)}>
                                          {status.totalDocuments.toLocaleString()} {status.get('totalDocuments') === 1 ? props.typeSingular : props.typePlural}
                                        </span>
                                      )
                                    , selectOption: ({ index, ...props }) => (index + 1).toLocaleString()
                                    , documentsPerPageOption: ({ index, ...props }) => typeof index === 'number' ? index.toLocaleString() : index
                                    }
                        , ...defaults
                        }


  /** PRE REDUX (CONFIG) */
  const PagerContext = pure (
    { displayName: 'PagerContext'
    , propTypes
    , defaultProps
    , render() {
        const { columns
              , map
              , documentsPerPageOptions
              , createSortKeys
              , createSortKeyComparator
              , ...childProps
              } = this.props
        return (
          <PagerDataFilter
            {...childProps}

            mapStateToDocumentData={state => {
              const documents = map.documents(state)
              if(!Immutable.Map.isMap(documents)) {
                console.warn('redux-pager: map.documents() should return an Immutable Map for best performance (converting...).')
                return Immutable.Map(documents)
              }
              return documents
            }}
            mapColumnData={documents => {
              if(columns) {
                should.exist(map.cells, 'map.cells function should exist when columns specified.')
                return documents.map((datum, documentID) => map.cells(documentID, datum))
              }
            }}
            /** CALLED BY FILTER STREAM */
            filterDocumentData={this.props.filterStream ? (documentData, filterState) => {
              if(filterState) {
                let anyFiltered = false
                const filtered = documentData.filter((datum, documentID) => {
                  const value = Object.keys(filterState).some(columnID => (
                    filterState[columnID](documentID) === true
                  ))
                  if(value)
                    anyFiltered = true
                  return value
                })
                return anyFiltered ? filtered : documentData
              }
              return documents
            } : null}
            /** MAP CELL AND SORT DATA AND ADD TO DATA CONSTRUCT */

            mapData={(documentData, columnData, access) => {
              const documents = documentData.map((datum, documentID) => {
                const cells = columnData ? columnData.get(documentID) : null
                const sortKeys = this.props.sort ? createSortKeys(cells, access) : null
                const context = Immutable.Map({ datum, cells, sortKeys })
                return context
              })
              const data = Immutable.Map({ documents: documents, columns })
              return data
            }}
            sortData={this.props.sort ? (data, access) => {
              const comparator = createSortKeyComparator(access)
              return data.set('documents', data.get('documents').sortBy((context, documentID) => context.get('sortKeys'), comparator))
            } : null}
            mapDataToStatus={(data, access) => {
              const sort = access.sort
              const page = access.page
              const documentsPerPage = access.documentsPerPage
              const documents = data.get('documents')

              if(typeof documentsPerPage !== 'number') {
                return  Immutable.Map({ data
                                      , startIndex: 0
                                      , lastIndex: documents.size
                                      , page
                                      , pages: 1
                                      , documentsPerPage
                                      , documentsPerPageOptions
                                      , totalDocuments: documents.size
                                      , sort
                                      })
              }

              const startIndex = page * documentsPerPage
              const endIndex = (page + 1) * documentsPerPage
              const pages = Math.ceil(documents.size / documentsPerPage)
              const documentSlice = documents.slice(startIndex, endIndex)
              const lastIndex = startIndex + (documentSlice.size || documentSlice.length)

              return  Immutable.Map({ data: data.set('documents', documentSlice)
                                    , page
                                    , pages
                                    , startIndex
                                    , lastIndex
                                    , documentsPerPage
                                    , documentsPerPageOptions
                                    , totalDocuments: documents.size
                                    , sort
                                    })
            }}
            mapStatusToActions={(status, access) => {
              return (
                { fastBackward: () => { access.page = 0 }
                , stepBackward: () => { access.page = access.page - 1 }
                , stepForward: () => { access.page = access.page + 1 }
                , fastForward: () => { access.page = access.page - 1 }
                , select: x => { access.page = x }
                , documentsPerPage: documentsPerPage => {
                    access.merge( { documentsPerPage
                                  , page: 0
                                  } )
                  }
                , sort: id => {
                    const sort = access.sort
                    const _cols = sort.get('cols')
                    const index = _cols.indexOf(id)
                    if(index === -1)
                      throw new Error(`id ${id} is not a sortable column.`)
                    let lastDirection = sort.getIn([ 'direction', id ], null)
                    let newDirection = nextDirection(lastDirection)
                    let direction = sort.get('direction', Immutable.Map()).set(id, newDirection)
                    let cols = newDirection ? _cols.delete(index).unshift(id) : _cols.delete(index).push(id)
                    const newSort = sort.merge({ cols, direction })
                    access.merge({ sort: newSort })
                  }
                }
              )
            }}
          />
        )
      }
    }
  )

  const PagerDataFilter = pure (
    { displayName: 'PagerDataFilter'
    , propTypes:  { mapStateToDocumentData: PropTypes.func.isRequired
                  , mapColumnData: PropTypes.func.isRequired
                  , filterStream: PropTypes.func
                  , filterDocumentData: PropTypes.func
                  }

    , render() {
        const { mapStateToDocumentData
              , mapColumnData
              , mapEarlyProps
              , ...childProps
              } = this.props

        const documentData = mapStateToDocumentData()
        const columnData = mapColumnData(documentData)
        const earlyProps = mapEarlyProps ? mapEarlyProps({ documentData, columnData }) : null


        return (
          <PagerDocumentFilter
            {...childProps}
            earlyProps={earlyProps}
            documentData={documentData}
            columnData={columnData}
          />
        )
      }
    }
  )

  const PagerDocumentFilter = pure (
    { displayName: 'PagerDocumentFilter'
    , propTypes:  { documentData: PropTypes.object.isRequired
                  , columnData: PropTypes.object
                  , mapData: PropTypes.func.isRequired
                  , sortData: PropTypes.func
                  , mapDataToStatus: PropTypes.func.isRequired
                  , mapStatusToActions: PropTypes.func.isRequired
                  }
    , state:  { status: Immutable.Map()
              , filterState: null
              }
    , init() {
        const getProps = () => this.props
        const getStatus = status => this.state.status
        const setStatus = status => this.setState({ status })

        this.access = { get page() { return getStatus().get('page', getProps().page) }
                      , set page(value) { setStatus(getStatus().set('page', value)) }
                      , get documentsPerPage() { return getStatus().get('documentsPerPage', getProps().documentsPerPage) }
                      , get sort() { return getStatus().get('sort', getProps().sort) }
                      , getSortDirection: id => getStatus().getIn([ 'sort', 'direction', id ], null)
                      , merge: value => setStatus(this.state.status.merge(value))
                      }

      }
    , componentWillMount() {
        const { mapStateToDocumentData, mapColumnData, filterStream, filterDocumentData, Filter } = this.props
        if(filterStream)
          this.unsubscribe = filterStream(filterState => this.setState({ filterState }))
      }
    , componentWillUnmount() {
        if(this.unsubscribe)
          this.unsubscribe()
      }
    , render() {
        const { documentData
              , columnData
              , filterDocumentData
              , mapData
              , sortData
              , sortDocuments
              , mapDataToStatus
              , mapStatusToActions
              , mapLateProps
              , earlyProps
              , ...childProps
              } = this.props

        const { filterState } = this.state

        const filteredData = filterDocumentData && filterState ? filterDocumentData(documentData, filterState) : documentData

        const rawData = mapData(filteredData, columnData, this.access)
        const data = sortData ? sortData(rawData, this.access) : rawData
        const status = mapDataToStatus(data, this.access)
        const actions = mapStatusToActions(status, this.access)
        const lateProps = mapLateProps ? mapLateProps({ earlyProps, status, actions }) : null

        return (
          <Pager
            {...childProps}
            earlyProps={earlyProps}
            lateProps={lateProps}
            status={status}
            actions={actions}
          />
        )
      }
    }
  )


   const Pager = pure (
    { displayName: 'Pager'
    , defaultProps: defaults
    , render() {
        const { children, data, content, ...childProps } = this.props
        const { status, actions, styles, theme } = childProps

        return children({ ...childProps
                        , Controls: props => <PagerControls {...props} {...childProps} content={content} />
                        , Select: props => <PagerSelect {...props} {...childProps} content={content} />
                        , DocumentsPerPage: props => <PagerDocumentsPerPage {...props} {...childProps} content={content} />
                        , PageStatus: props => <PagerStatus {...props} {...childProps} styleName="pagerPageStatus" Content={content.PageStatus} ContentMobile={content.PageStatusMobile} />
                        , DocumentStatus: props => <PagerStatus {...props} {...childProps} styleName="pagerDocumentStatus" Content={content.DocumentStatus} ContentMobile={content.DocumentStatusMobile} />
                        , DocumentCount: props => <PagerStatus {...props} {...childProps} styleName="pagerDocumentCount" Content={content.DocumentCount} ContentMobile={content.DocumentCountMobile} />
                        })
      }
    }
  )


  const PagerControls = pure (
    { displayName: 'PagerControls'
    , defaultProps: defaults
    , render() {
        const { children, status, actions, content, styles, theme } = this.props
        const buttonClass = cn(styles.pagerButton, theme.pagerButton)
        return (
          <span className={cn(styles.pagerControls, theme.pagerControls)}>
            <button onClick={actions.fastBackward} className={buttonClass} disabled={status.get('page') === 0}>
              <content.FastBackward {...this.props} />
            </button>
            {' '}
            <button onClick={actions.stepBackward} className={buttonClass} disabled={status.get('page') === 0}>
              <content.StepBackward {...this.props} />
            </button>
            {' '}
            {children ? <span className={cn(styles.pagerControlsChildren, theme.pagerControlsChildren)}>{children}</span> : null}
            {' '}
            <button onClick={actions.stepForward} className={buttonClass} disabled={status.get('page') === status.get('pages') - 1}>
              <content.StepForward {...this.props} />
            </button>
            {' '}
            <button onClick={actions.fastForward} className={buttonClass} disabled={status.get('page') === status.get('pages') - 1}>
              <content.FastForward {...this.props} />
            </button>
          </span>
        )
      }
    }
  )

  const PagerSelect = pure (
    { displayName: 'PagerSelect'
    , defaultProps: defaults
    , render() {
        const { status, actions, content, styles, theme } = this.props
        const documentsPerPage = status.get('documentsPerPage')
        return typeof documentsPerPage === 'number' && documentsPerPage > 0 ? (
          <select
            value={status.get('page')}
            onChange={x =>  actions.select(parseInt(x.target.value))}
            className={cn(styles.pagerSelect, theme.pagerSelect)}
          >
            {Array.from(Array(status.get('pages')).keys()).map(x => <option key={x} value={x}>{content.selectOption({ ...this.props, index: x })}</option>)}
          </select>
        ) : <span>All</span>
      }
    }
  )

  const PagerDocumentsPerPage = pure (
    { displayName: 'PagerDocumentsPerPage'
    , defaultProps: defaults
    , render() {
        const { label, status, actions, content, styles, theme } = this.props
        return (
          <span className={cn(styles.pagerDocumentsPerPage, theme.pagerDocumentsPerPage)}>
            {label ? <label className={cn(desktopStyles)}>{label}</label> : null}
            {' '}
            <select
              value={status.get('documentsPerPage')}
              onChange={x => {
                const { value } = x.target
                if(/\d+/.test(value))
                  actions.documentsPerPage(parseInt(value))
                else
                  actions.documentsPerPage(value)
              }}
              className={cn(styles.pagerSelect, theme.pagerSelect)}
            >
              {status.get('documentsPerPageOptions').map(x => <option key={x} value={x}>{content.documentsPerPageOption({ ...this.props, index: x })}</option>)}
            </select>
          </span>
        )
      }
    }
  )

  const PagerStatus = pure (
    { displayName: 'PagerStatus'
    , defaultProps: defaults
    , render() {
        const { styleName, Content, ContentMobile, className, status, actions, content, styles, theme } = this.props
        return (
          <span className={cn(styles[styleName], theme[styleName])}>
            <Content {...this.props} />
            <ContentMobile {...this.props} />
          </span>
        )
      }
    }
  )
  return PagerContext
}
