import postcssImport from 'postcss-import'
import postcssUrl from 'postcss-url'
import postcssCssnext from 'postcss-cssnext'
import postcssBrowserReporter from 'postcss-browser-reporter'
import postcssReporter from 'postcss-reporter'

export default name => {
  return webpack => ( [ postcssImport({ addDependencyTo: webpack })
                      , postcssUrl( { url: 'inline'
                                    //, basePath: '../src/app'
                                    , assetsPath: '../images'
                                    })
                      , postcssCssnext()
                      , postcssBrowserReporter()
                      , postcssReporter()
                      ] )
}
