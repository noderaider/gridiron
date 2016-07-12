import React from 'react'
import reactStamp from 'react-stamp'

const { compose } = reactStamp(React)

let head = []
const HtmlHead = compose( { componentWillMount() {
                            head = this.props.children
                          }
                        , componentWillUnmount() {
                            head = []
                          }
                        , render() {
                            return null
                          }
                        } )
export default HtmlHead

