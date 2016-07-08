import Promise from 'bluebird'
import path from 'path'
const mkdirp = Promise.promisify(require('mkdirp'))
const writeFile = Promise.promisify(require('fs').writeFile)

import { log, resolveRoot } from '../../config'

export default ({ logDirectory = resolveRoot('log') } = {}) => {
  return mkdirp(logDirectory)
    .then(() => {
      const logFile = (name, content) => {
        const filePath = path.join(logDirectory, name)
        return writeFile(filePath, content, 'utf8')
          .then(() => log.debug(`logging => ${name} written to log directory`))
      }
      return { logFile }
    })
}
