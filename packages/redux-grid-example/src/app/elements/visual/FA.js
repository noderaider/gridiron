import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { contextTypes } from 'lib/context'

export const faSizeOptions = ['lg', 'xl', '2x', '3x', '4x', '5x']
const faPropTypes = { name: PropTypes.string.isRequired
                    , loadingName: PropTypes.oneOf(['same', 'spinner', 'circle-o-notch', 'refresh', 'cog', 'spinner'])
                    , spinnerName: PropTypes.oneOf(['spin', 'pulse'])
                    , size: PropTypes.oneOf(faSizeOptions)
                    , isLoading: PropTypes.bool
                    /** BASE 16 NAME (CONTEXT) OR RESOLVES TO NORMAL COLOR STYLE */
                    , accentColor: PropTypes.string
                    , style: PropTypes.object
                    }

export const faDefaultProps = { name: 'circle-o-notch'
                              , loadingName: 'same'
                              , spinnerName: 'spin'
                              , isLoading: false
                              }

const noop = () => {}
const prefix = (pre, name, spacer = '-') => name ? `${pre}${spacer}${name}` : noop()
const prefixMultiple = (pre, names, spacer = '-') =>  ( names && names.filter
                                                      ? names .filter(name => typeof name === 'string' && name.length > 0)
                                                              .map(name => prefix(pre, name, spacer))
                                                              .join(' ')
                                                      : noop()
                                                      )

const faClassNames = (...names) => ( names && names.filter
                              ? classNames('fa', prefixMultiple('fa', names))
                              : noop()
                              )

class FA extends Component {
  static contextTypes = contextTypes;
  static propTypes = faPropTypes;
  static defaultProps = faDefaultProps;
  componentDidMount() {
    require('styles/font-awesome/less/font-awesome.less')
  }
  render() {
    const { name
          , loadingName
          , spinnerName
          , size
          , isLoading
          , iconStyle
          , color
          } = this.props
    const { theme, gridProps } = this.context

    const resolvedStyle = { color: color || theme.color.accent, ...iconStyle }

    const resolvedName = isLoading ? (loadingName === 'same' ? name : loadingName) : name
    const resolvedSpinner= isLoading ? spinnerName : noop()
    const iconClassNames = faClassNames(resolvedName, size, resolvedSpinner)
    return <i style={resolvedStyle} className={iconClassNames} />
  }
}

export default FA
