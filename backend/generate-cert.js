// generate-cert.js
import mkcert from 'mkcert';
import { writeFileSync, mkdirSync, existsSync } from 'fs'

async function createCertificate() {
  const ca = await mkcert.createCA({
    organization: 'Local Dev CA',
    countryCode: 'FR',
    state: 'Dev',
    locality: 'Localhost',
    validity: 365,
  })

  const cert = await mkcert.createCert({
    domains: ['localhost', '127.0.0.1'],
    validity: 365,
    ca: ca,
  })

  if (!existsSync('./certs')) mkdirSync('./certs')
  writeFileSync('./certs/key.pem', cert.key)
  writeFileSync('./certs/cert.pem', cert.cert)

  console.log('✅ Certificats générés dans /certs')
}

createCertificate()
