'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (_ref) {
  var React = _ref.React;
  var connect = _ref.connect;
  var FixedDataTable = _ref.FixedDataTable;

  should.exist(React);
  should.exist(FixedDataTable);
  should.exist(connect);
  var Component = React.Component;
  var PropTypes = React.PropTypes;
  var Table = FixedDataTable.Table;
  var Column = FixedDataTable.Column;
  var Cell = FixedDataTable.Cell;

  var CoreGrid = function (_Component) {
    _inherits(CoreGrid, _Component);

    function CoreGrid(props) {
      _classCallCheck(this, CoreGrid);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CoreGrid).call(this, props));

      _initialiseProps.call(_this);

      _this.state = { width: 0, height: 0, canUpdate: true };
      return _this;
    }

    _createClass(CoreGrid, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (!IS_BROWSER) return;
        this._handleResize();
        this._handleExpands(this.props);
        (0, _detectResize.addResizeListener)(this.container.parentNode, this._handleResize);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        if (!IS_BROWSER) return;
        console.warn('WILL RECEIVE');
        this._handleExpands(nextProps);
      }
    }, {
      key: 'componentDidReceiveProps',
      value: function componentDidReceiveProps() {
        console.warn('DID RECEIVE');
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (!IS_BROWSER) return;
        (0, _detectResize.removeResizeListener)(this.container.parentNode, this._handleResize);
      }
    }, {
      key: 'render',

      //    shouldComponentUpdate() { return true }
      value: function render() {
        var _this2 = this;

        var _props = this.props;
        var state = _props.state;
        var selectColumns = _props.selectColumns;
        var selectRows = _props.selectRows;
        var maxHeight = _props.maxHeight;
        var width = this.state.width;

        should.exist(selectColumns);
        should.exist(selectRows);
        selectColumns.should.be.a('function');
        selectRows.should.be.a('function');
        var columns = selectColumns(state);
        var rows = selectRows(state);
        should.exist(columns);
        should.exist(rows);
        columns.should.be.an('object');
        rows.should.be.instanceof(Array);
        var columnKeys = Object.keys(columns);

        return React.createElement(
          'div',
          { ref: function ref(x) {
              return _this2.container = x;
            } },
          React.createElement(
            Table,
            _extends({
              rowHeight: 40,
              headerHeight: 50,
              rowsCount: rows.length,
              flexGrow: 1,
              width: width,
              height: 1000
            }, this.props),
            columnKeys.map(function (x, i) {
              return React.createElement(Column, {
                key: i,
                width: 50,
                flexGrow: 1,
                header: React.createElement(
                  Cell,
                  null,
                  columns[x]
                ),
                cell: function cell(_ref2) {
                  var rowIndex = _ref2.rowIndex;

                  var props = _objectWithoutProperties(_ref2, ['rowIndex']);

                  return React.createElement(
                    Cell,
                    props,
                    rows[rowIndex][i]
                  );
                }
              });
            })
          )
        );
      }
    }]);

    return CoreGrid;
  }(Component);

  CoreGrid.propTypes = _gridironCore.CoreGrid.PropTypes(React);
  CoreGrid.defaultProps = { maxHeight: 800 };

  var _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this._handleResize = function () {
      should.exist(_this3.container);
      var _container = _this3.container;
      var parentNode = _container.parentNode;
      var offsetWidth = _container.offsetWidth;
      var offsetHeight = _container.offsetHeight;
      var clientWidth = _container.clientWidth;
      var clientHeight = _container.clientHeight;

      should.exist(parentNode);
      should.exist(offsetWidth);
      should.exist(offsetHeight);
      should.exist(clientWidth);
      should.exist(clientHeight);
      var borderWidth = offsetWidth - clientWidth;
      var borderHeight = offsetHeight - clientHeight;
      var width = parentNode.offsetWidth - borderWidth;
      var height = parentNode.offsetHeight - borderHeight;
      _this3.setState({ width: width, height: height });
    };

    this._handleExpands = function (props) {
      //this.setState({ canUpdate: false })

      var expandHeight = 150;
      var expandedRows = props.expandedRows;

      var _Array$from = Array.from(document.querySelectorAll('.fixedDataTableRowLayout_rowWrapper'));

      var _Array$from2 = _toArray(_Array$from);

      var headerRow = _Array$from2[0];

      var domRows = _Array$from2.slice(1);

      var _state = _this3.state;
      var originalHeight = _state.originalHeight;
      var originalContainerHeight = _state.originalContainerHeight;


      var rowContainer = document.querySelector('.fixedDataTableLayout_rowsContainer');
      var expandRows = domRows.filter(function (x, i) {
        return expandedRows.includes(i);
      }).map(function (x) {
        return x.childNodes[0];
      });

      if (originalHeight && originalContainerHeight) {
        /** RESET BACK FIRST */
        rowContainer.style.height = originalContainerHeight + 'px';

        console.warn('calculating', originalHeight, originalContainerHeight);
        domRows.forEach(function (node, i) {
          node.style.transform = 'translate3d(0px, ' + i * originalHeight + 'px, 0px)';
          node.childNodes[0].style.height = originalHeight + 'px';
        });
      } else {
        if (expandRows.length === 0) return;
        originalContainerHeight = parseInt(rowContainer.style.height.split('px')[0]);
        originalHeight = parseInt(expandRows[0].style.height.split('px')[0]);
        _this3.setState({ originalContainerHeight: originalContainerHeight, originalHeight: originalHeight });
      }

      var offsetHeight = expandHeight - originalHeight;

      console.warn(originalHeight);
      expandRows.forEach(function (node, i) {
        node.style.height = originalHeight + expandHeight + 'px';
        node.style.backgroundColor = 'white';
      });
      console.warn(expandRows);

      var currentExpanded = 0;
      var pushedRows = 0;
      domRows.forEach(function (node, i) {
        if (expandedRows.includes(i - 1)) {
          currentExpanded++;
        }
        if (currentExpanded === 0) return;

        var translateHeight = i * originalHeight + expandHeight * currentExpanded;
        console.warn('translate', originalHeight, translateHeight);
        node.style.transform = 'translate3d(0px, ' + translateHeight + 'px, 0px)';
        pushedRows += currentExpanded;
      });

      var totalAddedHeight = pushedRows * offsetHeight;
      rowContainer.style.height = originalContainerHeight + totalAddedHeight + 'px';
    };
  };

  return _gridironCore.CoreGrid.Connect({ connect: connect })(CoreGrid);
};

var _gridironCore = require('gridiron-core');

var _detectResize = require('detect-resize');

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var should = require('chai').should();


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
var IS_BROWSER = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object';