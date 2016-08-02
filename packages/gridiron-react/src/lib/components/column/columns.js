import column from './column'

export default function columns (pure) {
  const { React, PropTypes, cloneElement, formula, Pre, defaults } = pure
  const Column = column(pure)

  return function Columns (...columnIDs) {
    function reduceColumns (reducer) {
      return columnIDs.reduce((reduced, columnID) => ({ ...reduced, [columnID]: reducer(columnID) }), {})
    }
    const _columns = reduceColumns(Column)
    _columns.ids = columnIDs
    _columns.reduce = reduceColumns
    return _columns
  }
}
