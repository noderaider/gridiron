const should = require('chai').should()

/**
 * Creates a dependency resolver that will auto check incoming dependencies against a JavaScript type.
 * @param  {Object} dependencyTypes [description]
 * @return {[type]}                 [description]
 */
export function dependencyResolver (depTypes = {}) {
  const validTypes = [ 'object', 'function', 'string', 'number' ]
  Object.values(depTypes)
        .forEach(x => should.exist(x)
                      && x.should.be.a('string', 'dependency type contraints must be strings')
                      && validTypes.should.include(x, `dependency type constraints must be valid JavaScript types | passed => ${x}`))

  return arg => Object.keys(depTypes).reduce((deps, x) => {
    should.exist(arg, `A dependency object of type ${JSON.stringify(depTypes)} is required`)
    const dep = arg[x]
    should.exist(dep, `Dependency '${x}'' of type '${depTypes[x]}' is required but was not passed`)
    dep.should.be.a(depTypes[x], `Dependency '${x}' was found but its type was incorrect | expected type => '${depTypes[x]}', passed => '${typeof dep}'`)
    return ({ ...deps, [x]: arg[x] })
  }, {})
}
