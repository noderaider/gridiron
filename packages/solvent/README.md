# solvent

**Simple dependency resolver designed for validating typed dependency contraints.**

[![Build Status](https://travis-ci.org/noderaider/solvent.svg?branch=master)](https://travis-ci.org/noderaider/solvent)
[![codecov](https://codecov.io/gh/noderaider/solvent/branch/master/graph/badge.svg)](https://codecov.io/gh/noderaider/solvent)

[![NPM](https://nodei.co/npm/solvent.png?stars=true&downloads=true)](https://nodei.co/npm/solvent/)

## Install

`npm i -S solvent`

## Usage

```js
import solvent from 'solvent'

export default function (dependencies) {
  const { React, connect } = solvent( { React: 'object'
                                      , connect: 'function'
                                      } )(dependencies)

  /** DO SOMETHING */
}
```

---


## TEST

**Unit tests output for current release:**

# TOC
   - [lib](#lib)
     - [#default](#lib-default)
     - [solvent](#lib-solvent)
<a name=""></a>
 
<a name="lib"></a>
# lib
<a name="lib-default"></a>
## #default
should have default export.

```js
return should.exist(lib.default);
```

<a name="lib-solvent"></a>
## solvent
should be a function.

```js
return solvent.should.be.a('function');
```

should not throw.

```js
return function () {
  return solvent();
}.should.not.throw();
```

should return a function.

```js
return solvent().should.be.a('function');
```

should validate object.

```js
var resolver = solvent({ React: 'object' });
resolver({ React: { prop: 'Some property' } }).should.be.an('object').that.has.property('React').that.is.an('object');
```

