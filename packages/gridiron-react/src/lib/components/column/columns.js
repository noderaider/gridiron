import column from './column'

export default function columns (pure) {
  const { React, PropTypes, cloneElement, formula, Pre, defaults } = pure
  const Column = column(pure)

  return function Columns (columnIDs, columnProps = {}) {
    console.warn('COLUMN IDs', columnIDs)
    function reduceColumns (reducer) {
      return columnIDs.reduce((reduced, columnID) => ({ ...reduced, [columnID]: reducer(columnID) }), {})
    }
    const fixedWidths = Object.values(columnProps)
      .filter(props => typeof props.width !== 'undefined')
      .map(({ width }) => width)
    const _columns = reduceColumns(columnID => Column(columnID, columnProps[columnID]), { fixedWidths })
    _columns.ids = columnIDs
    _columns.reduce = reduceColumns
    return _columns
  }
}
