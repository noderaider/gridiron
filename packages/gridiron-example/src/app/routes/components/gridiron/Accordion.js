import pure from 'lib/modules/pure'
import { sandy, black, carbon, mellow } from 'gridiron-themes'

const { React, Immutable, gridiron, defaults } = pure
const { Pager, Grid, Columns, Accordion, Cards, Graph } = gridiron
const { styles, theme } = defaults

const should = require('chai').should()

export default pure (
  { displayName: 'Accordion'
  , render() {
      const { container } = this.props
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
            <Box>
              <Accordion
                  data={pager.status.get('data', Immutable.Map())}

                  header={
                    [ <h2 key="title" style={{ margin: 0, letterSpacing: 6 }}>Accordion</h2>
                    , <Controls key="maximize" />
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
            </Box>
          )}
        </Pager>
      ))
    }
  }
)
