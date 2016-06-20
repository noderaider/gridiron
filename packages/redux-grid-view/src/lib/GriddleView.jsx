import React, { Component, PropTypes } from 'react'
import * as DefaultModules from './DefaultModules'
import { getAssignedStyles } from './defaultStyles'
import * as defaultSettings from './defaultSettings'
import { arraysEqual } from './utils/arrayHelper'

export default class GriddleView extends Component {
  static propTypes =  { events: PropTypes.object
                      , data: PropTypes.array
                      , components: PropTypes.object
                      };
  static defaultProps = { currentPage: 0
                        , resultsPerPage: 10
                        , maxPage: 0
                        };

  constructor(props, context) {
    super(props, context)

    this.wireUpSettings(props)
    this.state = { showSettings: false }
  }

  wireUpSettings = props => {
    this.settings = Object.assign({}, defaultSettings, props.settings)
    this.components = Object.assign({}, defaultModules, props.components)
    this.styles = getAssignedStyles(props.style, this.settings.useGriddleStyles)
  };

  //TODO: This is okay-ish for the defaults but lets do something to override for plugins... there is stuff here for subgrid and selection and there shouldn't be.
  getEvents = () => ( { getNextPage: this._nextPage
                      , getPreviousPage: this._previousPage
                      , getPage: this._getPage
                      , setFilter: this._filter
                      , setFilterByColumn: this._filterByColumn
                      , setPageSize: this._setPageSize
                      , rowHover: this._rowHover
                      , rowClick: this._rowClick
                      , rowSelect: this._rowSelect
                      , columnHover: this._columnHover
                      , columnClick: this._columnClick
                      , headingHover: this._columnHeadingHover
                      , headingClick: this._columnHeadingClick
                      , toggleColumn: this._toggleColumn
                      , expandRow: this._expandRow
                      , setScrollPosition: this._setScrollPosition
                      , toggleRowSelection: this._toggleRowSelection
                      } );

  getComponents = () => this.components;

  render() {
    const events = this.getEvents()
    const components = this.getComponents()
    const { styles, settings } = this

    return (
      <div>
        {/*TODO: Lets not duplicate these prop defs all over (events/components) */}
        <this.components.Filter {...this.props} components={components} styles={styles} settings={settings} events={events} />
        <this.components.SettingsToggle components={components} styles={styles} events={events} settings={settings} showSettings={this._showSettings} />
        {this.state.showSettings ? <this.components.Settings {...this.props} components={components} styles={styles} settings={settings} events={events} /> : null }

        {(this.props.data && this.props.data.length > 0) || this.props.columnFilters.length > 0 ?
          <this.components.Table {...this.props} components={components} styles={styles} settings={settings} events={events} /> :
          <this.components.NoResults components={components} styles={styles} settings={settings} events={events} /> }

        <this.components.Pagination {...this.props} components={components} styles={styles} settings={settings} events={events} />
      </div>
    )
  }

  /*TODO: Move to store */
  _showSettings = shouldShow => this.setState({showSettings: shouldShow});

  _nextPage = () => {
    if(this.props.loadNext)
      this.props.loadNext()
  };

  _previousPage = () => {
    if(this.props.loadPrevious)
      this.props.loadPrevious()
  };

  _getPage = (pageNumber) => {
    if(this.props.loadPage)
      this.props.loadPage(pageNumber)
  };

  _filter = (query) => {
    if(this.props.filterData)
      this.props.filterData(query)
  };

  _filterByColumn = (filter, column) => {
    if(this.props.filterDataByColumn)
      this.props.filterDataByColumn(filter, column)
  };

  _setPageSize = (size) => {
    if(this.props.setPageSize)
      this.props.setPageSize(size)
  };

  _toggleRowSelection = (columnId) => {
    if(this.props.toggleRowSelection)
      this.props.toggleRowSelection(columnId)
  };

  _toggleColumn = (columnId) => {
    if(this.props.toggleColumn)
      this.props.toggleColumn(columnId)
  };

  _expandRow = (griddleKey) => {
    if(this.props.expandRow)
      this.props.expandRow(griddleKey)
  };

  _rowClick = (rowData, originalRowData) => {
    //TODO: lets make a function for getting these chains of 'does this property exist?'
    if(this.props.renderProperties && this.props.renderProperties.rowProperties && this.props.renderProperties.rowProperties.onClick)
      this.props.renderProperties.rowProperties.onClick(rowData, originalRowData)
  };

  _rowHover = (rowData) => {
    //TODO:
  };

  _rowSelect = (rowData) => {
    //TODO:
  };

  _columnHover = (columnId, columnValue, rowIndex, rowData) => {
    //TODO:
  };

  _columnClick = (columnId, columnValue, rowIndex, rowData) => {
    //TODO:
  };

  _columnHeadingClick = (columnId) => {
    if(this.props.sort)
      this.props.sort(columnId)
  };

  _columnHeadingHover = (columnId) => {
  };

  _setScrollPosition = (scrollLeft, scrollWidth, visibleWidth, scrollTop, scrollHeight, visibleHeight) => {
    const { setScrollPosition, positionConfig, loadNext} = this.props
    if(setScrollPosition)
      setScrollPosition(scrollLeft, scrollWidth, visibleWidth, scrollTop, scrollHeight, visibleHeight)
  };
}
