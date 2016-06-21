import { CoreGrid as Core } from 'redux-grid-core'
import { addResizeListener, removeResizeListener } from 'detect-resize'
const should = require('chai').should()
const IS_BROWSER = typeof window === 'object'

export default function ({ React, connect, FixedDataTable }) {
  should.exist(React)
  should.exist(FixedDataTable)
  should.exist(connect)
  const { Component, PropTypes } = React
  const { Table, Column, Cell } = FixedDataTable


  class CoreGrid extends Component {
    static propTypes = Core.PropTypes(React);
    static defaultProps = { maxHeight: 800 }
    constructor(props) {
      super(props)
      this.state = { width: 0, height: 0, canUpdate: true }
    }
    componentDidMount() {
      if(!IS_BROWSER) return
      this._handleResize()
      this._handleExpands(this.props)
      addResizeListener(this.container.parentNode, this._handleResize)
    }
    componentWillReceiveProps(nextProps) {
      if(!IS_BROWSER) return
      console.warn('WILL RECEIVE')
      this._handleExpands(nextProps)

    }
    componentDidReceiveProps() {
      console.warn('DID RECEIVE')
    }
    componentWillUnmount() {
      if(!IS_BROWSER) return
      removeResizeListener(this.container.parentNode, this._handleResize)
    }
    _handleResize = () => {
      should.exist(this.container)
      const { parentNode, offsetWidth, offsetHeight, clientWidth, clientHeight } = this.container
      should.exist(parentNode)
      should.exist(offsetWidth)
      should.exist(offsetHeight)
      should.exist(clientWidth)
      should.exist(clientHeight)
      const borderWidth = offsetWidth - clientWidth
      const borderHeight = offsetHeight - clientHeight
      const width = parentNode.offsetWidth - borderWidth
      const height = parentNode.offsetHeight - borderHeight
      this.setState({ width, height })
    };
    _handleExpands = props => {
      //this.setState({ canUpdate: false })

      let expandHeight = 150
      const { expandedRows } = props

      const [ headerRow, ...domRows ] = Array.from(document.querySelectorAll('.fixedDataTableRowLayout_rowWrapper'))

      let { originalHeight, originalContainerHeight } = this.state

      const rowContainer = document.querySelector('.fixedDataTableLayout_rowsContainer')
      const expandRows = domRows.filter((x, i) => expandedRows.includes(i)).map(x => x.childNodes[0])

      if(originalHeight && originalContainerHeight) {
        /** RESET BACK FIRST */
        rowContainer.style.height = `${originalContainerHeight}px`

        console.warn('calculating', originalHeight, originalContainerHeight)
        domRows.forEach((node, i) => {
          node.style.transform = `translate3d(0px, ${i * originalHeight}px, 0px)`
          node.childNodes[0].style.height = `${originalHeight}px`
        })
      } else {
        if(expandRows.length === 0)
          return
        originalContainerHeight = parseInt(rowContainer.style.height.split('px')[0])
        originalHeight = parseInt(expandRows[0].style.height.split('px')[0])
        this.setState({ originalContainerHeight, originalHeight })
      }

      let offsetHeight = expandHeight - originalHeight

      console.warn(originalHeight)
      expandRows.forEach((node, i) => {
        node.style.height = `${originalHeight + expandHeight}px`
        node.style.backgroundColor = 'white'
      })
      console.warn(expandRows)

      let currentExpanded = 0
      let pushedRows = 0
      domRows.forEach((node, i) => {
        if(expandedRows.includes(i -1)) {
          currentExpanded++
        }
        if(currentExpanded === 0)
          return

        let translateHeight = i * originalHeight + expandHeight * currentExpanded
        console.warn('translate', originalHeight, translateHeight)
        node.style.transform = `translate3d(0px, ${translateHeight}px, 0px)`
        pushedRows+=currentExpanded
      })

      let totalAddedHeight = (pushedRows) * offsetHeight
      rowContainer.style.height = `${originalContainerHeight + totalAddedHeight}px`
    };
//    shouldComponentUpdate() { return true }
    render() {
      const { state, selectColumns, selectRows, maxHeight } = this.props
      const { width } = this.state
      should.exist(selectColumns)
      should.exist(selectRows)
      selectColumns.should.be.a('function')
      selectRows.should.be.a('function')
      const columns = selectColumns(state)
      const rows = selectRows(state)
      should.exist(columns)
      should.exist(rows)
      columns.should.be.an('object')
      rows.should.be.instanceof(Array)
      const columnKeys = Object.keys(columns)

      return (
        <div ref={x => this.container=x}>
          <Table
            rowHeight={40}
            headerHeight={50}
            rowsCount={rows.length}
            flexGrow={1}
            width={width}
            height={1000}
            {...this.props}>

            {columnKeys.map((x, i) => {
              return (
                <Column
                  key={i}
                  width={50}
                  flexGrow={1}
                  header={<Cell>{columns[x]}</Cell>}
                  cell={({ rowIndex, ...props }) => {
                    return (
                        <Cell {...props}>
                          {rows[rowIndex][i]}
                        </Cell>
                    )
                  }}
                />
              )
            })}
          </Table>
        </div>
      )
    }
  }
  return Core.Connect({ connect })(CoreGrid)
}

          /*
      //this.state = { dataList: new FakeObjectDataListStore(100) }
          <Column
            header={<Cell>First Name</Cell>}
            cell={<Cell data={data} col="firstName" />}
            fixed={true}
            width={100}
          />
          <Column
            header={<Cell>Sentence! (flexGrow greediness=2)</Cell>}
            cell={<TextCell data={data} col="sentence" />}
            flexGrow={2}
            width={200}
          />
          <Column
            header={<Cell>Company (flexGrow greediness=1)</Cell>}
            cell={<TextCell data={data} col="companyName" />}
            flexGrow={1}
            width={200}
          />
        */
/*
  const colorizeText = (str, index) => {
    var val, n = 0
    return str.split('').map((letter) => {
      val = index * 70 + n++
      var color = 'hsl(' + val + ', 100%, 50%)'
      return <span style={{color}} key={val}>{letter}</span>
    })
  }

  const TextCell = ({rowIndex, data, columnKey, ...props}) => (
    <Cell {...props}>
      {data.getObjectAt(rowIndex)[columnKey]}
    </Cell>
  )
  const ColoredTextCell = ({rowIndex, data, col, ...props}) => (
    <Cell {...props}>
      {colorizeText(data.getObjectAt(rowIndex)[col], rowIndex)}
    </Cell>
  )
  */
