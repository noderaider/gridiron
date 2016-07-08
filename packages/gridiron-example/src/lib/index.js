import Promise from 'bluebird'
import { assert } from 'chai'
import path from 'path'

import configureServer from './server'
import { server, __rootname, resolveRoot } from '../config'

const mkdirp = Promise.promisify(require('mkdirp'))

/** Exports a server map of key (schemes) to server startup functions. */
export default paths => configureServer({ paths })
/** A function to create paths that are used throughout the server. */
export const definePaths = ({ NODE_ROOT = __rootname
                            , NODE_MODULES_ROOT = resolveRoot('node_modules')
                            , SERVER_CONFIG_PATH = resolveRoot('config-server.json')
                            , CLIENT_CONFIG_PATH = resolveRoot('config-client.json')
                            , PUBLIC_ROOT = resolveRoot('public')
                            , ASSETS_ROOT = resolveRoot('public/assets')
                            , STATIC_ROOT = resolveRoot('public/static')
                            , IMAGES_ROOT = resolveRoot('public/static/images')
                            , SRC_ROOT = resolveRoot('src')
                            , APP_ROOT = resolveRoot('app')
                            , LIB_ROOT = resolveRoot('lib')
                            , BIN_ROOT = resolveRoot('bin')
                            , LOG_ROOT = resolveRoot('log')
                            , DOC_ROOT = resolveRoot('doc')
                            , MOD_ROOT = path.resolve(server.fs.MOD_ROOT)
                            } = {}) => {
  const paths = { NODE_ROOT, NODE_MODULES_ROOT, SERVER_CONFIG_PATH, CLIENT_CONFIG_PATH, PUBLIC_ROOT, ASSETS_ROOT, STATIC_ROOT, IMAGES_ROOT, SRC_ROOT, APP_ROOT, LIB_ROOT, DOC_ROOT, BIN_ROOT, LOG_ROOT, MOD_ROOT }


  Object.keys(paths).forEach(x => assert.typeOf(paths[x], 'string', `path ${x} must be a string`) && assert.isAbove(paths[x].length, 0, `path ${x} must have length greater than 0`))
  return mkdirp(paths.LOG_ROOT)
    .then(() => paths)
    .catch(err => {
      console.error('An error occurred attempting to create log directory.', err)
      process.exit(1)
    })
}
