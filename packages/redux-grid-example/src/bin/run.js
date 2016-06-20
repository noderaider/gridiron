#! /usr/bin/env node
import 'babel-polyfill'

import { server, log } from '../config'
import createServer, { definePaths } from '../lib'

module.exports = definePaths()
  .then(paths => {
    log.info({ paths })
    return createServer(paths).get('http').start()
  })
  .catch(err => log.fatal(err, 'A fatal error occurred.'))
