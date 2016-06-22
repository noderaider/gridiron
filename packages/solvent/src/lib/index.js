const should = require('chai').should()
/**
 * Creates a dependency resolver that will auto check incoming dependencies against a JavaScript type.
 * @param  {Object} dependencyTypes [description]
 * @return {[type]}                 [description]
 */
export default function solvent(depTypes = {}) {
  const validTypes = [ 'object', 'function', 'string', 'number' ]
  Object.values(depTypes)
        .forEach(x => should.exist(x, 'solvent: all dependency type contraints require values')
                      && x.should.be.a('string', 'solvent: dependency type contraints must be strings')
                      && validTypes.should.include(x, `dependency type constraints must be a supported type | supported types => ${JSON.stringify(validTypes)}, provided => ${x}`))

  return arg => Object.keys(depTypes).reduce((deps, x) => {
    should.exist(arg, `solvent: dependency object of type ${JSON.stringify(depTypes)} is required`)
    const dep = arg[x]
    should.exist(dep, `solvent: dependency '${x}'' of type '${depTypes[x]}' is required but was not passed`)
    dep.should.be.a(depTypes[x], `solvent: dependency '${x}' was found but its type was incorrect | expected type => '${depTypes[x]}', provided => '${typeof dep}'`)
    return ({ ...deps, [x]: arg[x] })
  }, {})
}
