import React, { Component, PropTypes } from 'react'

export default class Frames extends Component {
  constructor(props) {
    super(props)
    const { initialLayout } = props
    this.state =  { layout: initialLayout
                  , urlMap: {}
                  }
  }

  render() {
    const { urlMap } = this.state
    const frameStyle = { width: '100%', height: '60%' }

    return (
      <div>
        <input type="text" onChange={({ target }) => this.setState({ urlMap: { ...urlMap, [0]: value }})} />
        <iframe src={urlMap[0]} style={frameStyle} />
      </div>
    )
  }

}
