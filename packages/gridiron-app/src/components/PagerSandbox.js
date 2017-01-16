import React, { Component } from 'react'
import Immutable from 'immutable'
import gridiron from '../modules/gridiron'

class Sand extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const { Box, children, ...props } = this.props
    if(Box.propTypes)
      return <pre>{JSON.stringify(Object.keys(Box), null, 2)}</pre>
      //return <span>Add propTypes to the component.</span>
    return (
      <div>
        {Object.entries(Box.propTypes).map(([ propName, propType ], i) => {
          return (
            <div key={i}>
              <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
                {propName}:
                <input
                  type="number"
                  onChange={(e) => {
                    try {
                      this.setState({ [propName]: parseInt(e.target.value) }, () => console.info(`${propName} UPDATED`))
                    } catch(err) {}
                  }}
                  defaultValue={documentsPerPage}
                />
              </label>
            </div>
          )
        })}
        <Box {...props}>
          {children}
        </Box>
      </div>
    )
  }
}

export default class PagerSandbox extends Component {
  constructor(props) {
    super(props)
    this.state = (
      { documentsPerPage: 5
      , mapDocuments: state => Immutable.Map.isMap(state) ? state : Immutable.Map(state).map( (content, header) => Immutable.Map({ header, content }) )
      }
    )
  }
  render() {
    const { documentsPerPage, mapDocuments } = this.state
    return (
      <div style={{ display: 'flex', flexFlow: 'column nowrap' }}>
        <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          documentsPerPage:
          <input
            type="number"
            onChange={(e) => {
              try {
                this.setState({ documentsPerPage: parseInt(e.target.value) }, () => console.info('documentsPerPage UDPATED'))
              } catch(err) {}
            }}
            defaultValue={documentsPerPage}
          />
        </label>
        <label style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          map.documents:
          <textArea
            style={{ minHeight: '10vh' }}
            onChange={(e) => {
              try {
                const _mapDocuments = eval(e.target.value)
                if(typeof _mapDocuments === 'function')
                  this.setState({ mapDocuments: _mapDocuments }, () => console.info('map.documents UPDATED'))
              } catch(err) {}
            }}
            defaultValue={mapDocuments.toString()}
          />
        </label>
        <button onClick={() => this.forceUpdate()}>forceUpdate</button>
        <Sand
          Box={gridiron.Pager}
          documentsPerPage={documentsPerPage}
          map={{ documents: mapDocuments }}
        >
          {(pager) => {
            return (
              <pre>{JSON.stringify(pager, null, 2)}</pre>
            )
          }}
        </Sand>
      </div>
    )
  }
}
