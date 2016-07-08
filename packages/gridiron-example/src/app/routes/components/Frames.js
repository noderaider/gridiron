import React, { Component, PropTypes } from 'react'

const Frame = ({ src, width, height }) => {


  const frameStyle =  { width: `${100 * width}%`
                      , height: `${100 * height}%`
                      , borderWidth: 1
                      , borderColor: '#fff'
                      }
  return (
    <iframe src={src} style={frameStyle} />
  )
}

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
    return (
      <div>
        <input type="text" onChange={({ target }) => this.setState({ urlMap: { ...urlMap, [0]: value }})} />
        <Frame src={urlMap[0]} width={0.5} height={1}/>
      </div>
    )
  }

}
