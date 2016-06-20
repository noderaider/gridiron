'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FakeObjectDataListStore = function () {
  function FakeObjectDataListStore( /*number*/size) {
    _classCallCheck(this, FakeObjectDataListStore);

    this.size = size || 2000;
    this._cache = [];
  }

  _createClass(FakeObjectDataListStore, [{
    key: 'createFakeRowObjectData',
    value: function createFakeRowObjectData( /*number*/index) /*object*/{
      return {
        id: index,
        avartar: _faker2.default.image.avatar(),
        city: _faker2.default.address.city(),
        email: _faker2.default.internet.email(),
        firstName: _faker2.default.name.firstName(),
        lastName: _faker2.default.name.lastName(),
        street: _faker2.default.address.streetName(),
        zipCode: _faker2.default.address.zipCode(),
        date: _faker2.default.date.past(),
        bs: _faker2.default.company.bs(),
        catchPhrase: _faker2.default.company.catchPhrase(),
        companyName: _faker2.default.company.companyName(),
        words: _faker2.default.lorem.words(),
        sentence: _faker2.default.lorem.sentence()
      };
    }
  }, {
    key: 'getObjectAt',
    value: function getObjectAt( /*number*/index) /*?object*/{
      if (index < 0 || index > this.size) {
        return undefined;
      }
      if (this._cache[index] === undefined) {
        this._cache[index] = this.createFakeRowObjectData(index);
      }
      return this._cache[index];
    }

    /**
    * Populates the entire cache with data.
    * Use with Caution! Behaves slowly for large sizes
    * ex. 100,000 rows
    */

  }, {
    key: 'getAll',
    value: function getAll() {
      if (this._cache.length < this.size) {
        for (var i = 0; i < this.size; i++) {
          this.getObjectAt(i);
        }
      }
      return this._cache.slice();
    }
  }, {
    key: 'getSize',
    value: function getSize() {
      return this.size;
    }
  }]);

  return FakeObjectDataListStore;
}();

exports.default = FakeObjectDataListStore;