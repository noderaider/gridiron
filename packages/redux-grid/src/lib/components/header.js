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
  const wrapStyle = { display: 'flex'
                    , flexDirection: 'row'
                    , flexWrap: 'nowrap'
                    , flexGrow: 1
                    , alignItems: 'center'
                    , justifyContent: 'space-between'
                    }

  const Header = props => (
    <span style={wrapStyle} className={props.theme.header}>
      <span>{props.children}</span>
      <span>
        {props.hasSort ? (
          <button onClick={props.handleSort}>
            <i className={`fa fa-sort${sortDirection(props.sortDirection)}`} />
          </button>
        ) : null}
        {props.hasFilter ? (
          <button onClick={props.handleFilter}>
            <i className={`fa fa-filter${''}`} />
          </button>
        ) : null}
        {props.checkbox ? props.checkbox.label ? (
            <label><input type="checkbox" id={props.checkbox.id} value={props.checkbox.value} checked={props.checkbox.checked} /> {props.checkbox.label}</label>
          ) : (
            <input type="checkbox" id={props.checkbox.id} value={props.checkbox.value} checked={props.checkbox.checked} />
          ) : null}
        {props.radio ? (
          <span>
            {props.radio.values.map(({ value, checked = false }, i) => (
              <input key={i} type="radio" name={props.radio.name} value={value} checked={checked} />
            ))}
          </span>
        ) : null}
      </span>
    </span>
  )
  Header.propTypes = Core.PropTypes(React)
  Header.defaultProps = Core.DefaultProps(React)
  return Header
}
