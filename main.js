import * as keyring  from 'keyring-gpg'
import * as forge  from 'node-forge'
import { default as peerca } from 'peerca'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { spawn } from 'child_process'
const hostname = os.hostname()
const ca = peerca({host: hostname})

export async function signCSR (csr) {  
  return keyring.sign(csr)
}

export async function verifyCSR (pem, signature) {
  var csr = forge.pki.certificationRequestFromPem(pem)
  if (!csr.verify()) return false
  var cn = csr.subject.getField({name: 'commonName'})
  if (cn && cn.value) {
    cn = cn.value
    if (cn.indexOf('.')) cn = cn.split('.').pop()
    var fpr = await keyring.listKeys(`${cn}@${cn}.guld`)
    if (!fpr || fpr.length === 0) return false
    return keyring.verify(pem, signature, Object.keys(fpr))
  } else {
    return false
  }
}

export async function authorizeCSR (pem, cn) {
  return new Promise((resolve, reject) => {
    var proc = child_process.spawn('peerca', ['authorize', cn, '-h', hostname]) // eslint-disable-line camelcase
    const buffers = []
    let buffersLength = 0
    let stderr = ''
    proc.stdout.on('data', function (buf) {
      buffers.push(buf)
      buffersLength += buf.length
    })
    proc.stderr.on('data', function (buf) {
      stderr += buf.toString('utf8')
    })
    proc.on('close', function (code) {
      if (code !== 0 && stderr !== '') reject(new Error(stderr))
      resolve(Buffer.concat(buffers, buffersLength))
    })
    proc.stdin.end(pem)
  })
}

export function save (pem, cn) {
  ca.save(cn).end(pem)
}
