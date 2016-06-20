import { log } from '../config'
import { readFile } from 'graceful-fs'
import path from 'path'
import { assert } from 'chai'

const getDefaultCertificateRoot = path.resolve(__dirname, '..', 'etc', 'certificates')

export function readCertificate({ certificateRoot = getDefaultCertificateRoot(), filename }) {
  let certificatePath = path.resolve(certificateRoot, filename)
  return new Promise((resolve, reject) => {
    readFile(certificatePath, (err, certificate) => {
      if (err)
        return reject(err)
      resolve(certificate)
    })
  })
}

export function readPfx({ certificateRoot = getDefaultCertificateRoot(), filename, passphrase }) {
  assert.typeOf(filename, 'string', 'filename for pfx must be specified')
  assert.isAbove(filename.length, 0, 'filename must not be empty')
  assert.typeOf(passphrase, 'string', 'passphrase must be a string')
  assert.isAbove(passphrase.length, 0, 'passphrase must not be empty')
  return readCertificate({ certificateRoot, filename }).then(pfx => ({ pfx, passphrase }))
}
