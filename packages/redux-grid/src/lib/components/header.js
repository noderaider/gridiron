import { Header as Core } from 'redux-grid-core'
const should = require('chai').should()

const sortDirection = value => {
  switch(value) {
    case 'asc':
      return '-asc'
    case 'desc':
      return '-desc'
    default:
      return ''
  }
}

export default ({ React }) => {
  const { Component, PropTypes } = React
  const wrapStyle = { display: 'flex'
                    , flexDirection: 'row'
                    , flexWrap: 'nowrap'
                    , flexGrow: 1
                    , alignItems: 'center'
                    , justifyContent: 'space-between'
                    }

  class Header extends Component {
    constructor(props) {
      super(props)
      this.state = { checked: false }

    }
    componentWillUpdate(...args) {
      const { handleUpdate } = this.props
      if(handleUpdate)
        handleUpdate(this, ...args)
    }
    render() {
      const { children
            , styles
            , theme
            , sort
            , filter
            , checkbox
            , radio
            } = this.props

      return (
        <span style={wrapStyle} className={theme.header}>
          <span>{children}</span>
          <span>
            {sort ? (
              <button onClick={sort.handle}>
                <i className={`fa fa-sort${sortDirection(sort.direction)}`} />
              </button>
            ) : null}
            {filter ? (
              <button onClick={filter.handle}>
                <i className={`fa fa-filter${''}`} />
              </button>
            ) : null}
            {checkbox ? checkbox.label ? (
                <label><input type="checkbox" id={checkbox.id} onChange={this.handleChecked} value={checkbox.value} checked={checkbox.checked} /> {checkbox.label}</label>
              ) : (
                <input type="checkbox" id={checkbox.id} onChange={this.handleChecked} value={checkbox.value} checked={checkbox.checked} />
              ) : null}
            {radio ? (
              <span>
                {radio.values.map(({ value, checked = false }, i) => (
                  <input key={i} type="radio" name={radio.name} value={value} checked={checked} />
                ))}
              </span>
            ) : null}
          </span>
        </span>
      )
    }
    handleChecked = () => {
      this.setState({ checked: !this.state.checked })
    }
  }
  Header.propTypes = Core.PropTypes(React)
  Header.defaultProps = Core.DefaultProps(React)
  return Header
}
