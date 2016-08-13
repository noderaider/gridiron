import pure from 'lib/modules/pure'
import Header from './Header'
import styles from './styles.css'

const { React, PropTypes, cloneElement, Immutable, gridiron, defaults } = pure
const { Pager, Grid, Columns, Accordion, Cards, Graph, Pre, formula } = gridiron

const should = require('chai').should()

export default pure (
  { displayName: 'Accordion'
  , render() {
      const { container, orientation } = this.props
      return container(({ Controls, Box, isMaximized, id, actions }) => (
        <Pager
          documentsPerPage={5}
          map={ { documents: state => (Immutable.Map.isMap(state) ? state : Immutable.Map(state)).map(
                    (content, header) => Immutable.Map({ header, content })
                  )
                }
              }
        >
        {pager => (

              <Accordion
                  data={pager.status.get('data', Immutable.Map())}
                  orientation={orientation}
                  header={
                    [ <Header
                        key="left"
                        title="Accordion"
                        subtitle={`orientation="${orientation}"`}
                        description={`badass ${orientation === 'ltr' ? 'left to right' : 'top to bottom'} accordion`}
                        />
                    , <Controls key="right" />
                    ]
                  }
                  footer={
                    [ <pager.Controls key="pager-buttons"><pager.Select /></pager.Controls>
                    , <pager.DocumentStatus key="pager-row-status" />
                    , <pager.PageStatus key="pager-page-status" />
                    , <pager.DocumentsPerPage label="Documents Per Page" key="documents-per-page" />
                    ]
                  }

                  mapHeader={({ documentID, documentIndex, datum }) => (
                    <h3>{datum}</h3>
                  )}
                  mapContent={({ documentID, documentIndex, datum }) => (
                    <h4><Pre>{{ documentID, documentIndex, datum }}</Pre></h4>
                  )}
                />

          )}
        </Pager>
      ))
    }
  }
)
