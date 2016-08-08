import pure from 'lib/modules/pure'
import { AgGridReact } from 'ag-grid-react'
const { React } = pure

export default pure (
  { displayName: 'ag-grid'
  , state:  { showToolPanel: false
            , quickFilterText: ''
            , icons: []
            , columnDefs: []
            , rowData: []
            }
  , onRowSelected(...args) {
      console.info(...args)
    }
  , onCellClicked(...args) {
      console.info(...args)
    }
  , render() {

      return (
        <AgGridReact
          // listen for events with React callbacks
          onRowSelected={this.onRowSelected.bind(this)}
          onCellClicked={this.onCellClicked.bind(this)}

          // binding to properties within React State or Props
          showToolPanel={this.state.showToolPanel}
          quickFilterText={this.state.quickFilterText}
          icons={this.state.icons}

          // column definitions and row data are immutable, the grid
          // will update when these lists change
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}

          // or provide props the old way with no binding
          rowSelection="multiple"
          enableSorting="true"
          enableFilter="true"
          rowHeight="22"
        />
      )
    }
  }
)
