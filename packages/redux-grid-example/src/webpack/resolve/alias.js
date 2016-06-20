import { resolveRoot } from '../../config.js'
import { resolve } from 'path'

export const configClientPath = resolveRoot('./config-client.json')
export const configServerPath = resolveRoot('./config-server.json')
export const configPath = resolveRoot('./config.js')

export const libFolder = resolveRoot('./src/lib')
export const packageFolder = resolveRoot('./src/package')
export const appFolder = resolveRoot('./src/app')
export const binFolder = resolveRoot('./src/bin')

export const stylesFolder = resolve(appFolder, 'styles')
export const imagesFolder = resolve(appFolder, 'images')
export const vendorFolder = resolve(appFolder, 'vendor')

const resolveVendor = path => resolve(vendorFolder, path)

export default name => {
  return  { 'config': configPath
          , 'package': packageFolder
          , 'app': appFolder
          , 'lib': libFolder
          , 'vendor': vendorFolder
          , 'styles': stylesFolder
          , 'images': imagesFolder
          }
}
