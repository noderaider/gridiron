import React, { Component } from 'react'
import Immutable from 'immutable'
import gridiron from 'gridiron'
import gridironModules from 'gridiron-modules'
const { Pager, Grid, Accordion, Cards, Graph } = gridiron(gridironModules())

export default () => (
  <Pager
    documentsPerPage={5}
    map={ { documents: state => (Immutable.Map.isMap(state) ? state : Immutable.Map(state)).map(
              (content, header) => Immutable.Map({ header, content })
            )
          }
        }
  >
    {(pager) => {
      return (
        <pre>{JSON.stringify(pager, null, 2)}</pre>
      )
    }}
  </Pager>
)
