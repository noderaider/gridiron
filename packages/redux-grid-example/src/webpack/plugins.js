import { DefinePlugin, HotModuleReplacementPlugin, NoErrorsPlugin, SourceMapDevToolPlugin, ProvidePlugin, IgnorePlugin, optimize } from 'webpack'
import CompressionPlugin from 'compression-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { StatsWriterPlugin } from 'webpack-stats-plugin'

import { server, client, baseUrl, IS_HOT } from '../config.js'

const { CommonsChunkPlugin, OccurenceOrderPlugin, DedupePlugin, UglifyJsPlugin } = optimize

const NODE_ENV = process.env.NODE_ENV || 'production'
const getDefinePlugin = name => new DefinePlugin( { __CLIENT__: true
                                                  , __SERVER__: false
                                                  , __SHIM__: name === 'shim'
                                                  , __HOT__: IS_HOT
                                                  , __BASEURL__: baseUrl
                                                  , __DEV__: server.flags.dev
                                                  , __PROD__: server.flags.prod
                                                  , 'process.env.NODE_ENV': `"${name === 'server' ? 'hot' : (NODE_ENV || 'development')}"`
                                                  } )

export const extractText = (loaders, options) => ExtractTextPlugin.extract('style', loaders, options)

export default name => {
  let plugins = []

  //if((name === 'app' && !IS_HOT))// || name === 'server')
    plugins.push(new ExtractTextPlugin('[name].css', { allChunks: true, disable: false }))

  if(/^win/.test(process.platform))
    plugins.push(new IgnorePlugin(/dtrace-provider/i))

  plugins.push(getDefinePlugin(name))
  if(!IS_HOT)
    plugins.push(new DedupePlugin())
  plugins.push(new OccurenceOrderPlugin())


  if(name === 'app')
    plugins.push(new CommonsChunkPlugin('commons', 'commons.js'))


  if(name === 'app' && IS_HOT) {
    plugins.push(new HotModuleReplacementPlugin())
    plugins.push(new NoErrorsPlugin())
    //plugins.push(new SourceMapDevToolPlugin('[file].map', null, '[absolute-resource-path]'))
  }

  if(server.flags.minify) { //|| name === 'server') {
    plugins.push(new UglifyJsPlugin({ compress: { warnings: false } }))
    //  plugins.push(new CompressionPlugin( { asset: 'gz/{file}'
                                          //, algorithm: 'gzip'
                                          //, regExp: /\.(js|css|html|json|ico|eot|otf|ttf)$/
                                          //, threshold: 10240
                                          //, minRatio: 0.8
                                          //, minRatio: 100
                                          //} ))
  }
  /*
  if(name === 'server') // Write out stats.json file to build directory.
    plugins.push(new StatsWriterPlugin({ transform: ({ assetsByChunkName }) => ({ main: assetsByChunkName.main[0], css: assetsByChunkName.main[1] }) }))
  */
  return plugins
}
