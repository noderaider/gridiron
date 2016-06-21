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

