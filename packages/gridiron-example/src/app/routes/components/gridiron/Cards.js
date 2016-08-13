import pure from 'lib/modules/pure'
import Header from './Header'

const { React, PropTypes, cloneElement, Immutable, gridiron, defaults } = pure
const { Pager, Cards, Pre, formula } = gridiron

const should = require('chai').should()

export default pure (
  { displayName: 'Cards'
  , render() {
      const { container } = this.props
      return container(({ Controls, Box, isMaximized, id, actions }) => (
        <Pager
          documentsPerPage={6}
          map={ { documents: state => (Immutable.Map.isMap(state) ? state : Immutable.Map(state)).map(
                    (content, header) => Immutable.Map({ header, content })
                  )
                }
              }
        >
          {pager => (
            <Box>
              <Cards
                  data={pager.status.get('data', Immutable.Map())}

                  header={
                    [ <Header key="left" title="Cards" description="for business" />
                    , <Controls key="right" />
                    ]
                  }
                  footer={
                    [ <pager.Controls key={0}><pager.Select /></pager.Controls>
                    , <pager.DocumentStatus key={1} />
                    , <pager.PageStatus key={2} />
                    , <pager.DocumentsPerPage key={3} label="Documents Per Page" />
                    ]
                  }

                  mapHeader={({ documentID, documentIndex, datum }) => (
                    <h3>{datum}</h3>
                  )}
                  mapContent={({ documentID, documentIndex, datum }) => (
                    <h4>content: <Pre>{{ documentID, documentIndex, datum }}</Pre></h4>
                  )}
                />

            </Box>
          )}
        </Pager>
      ))
    }
  }
)
