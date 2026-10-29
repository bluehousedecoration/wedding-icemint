/**
 * สร้าง refresh token สำหรับอัปโหลดแขกลง Drive (My Drive ของเจ้าของ)
 * ใช้: npm run drive:oauth
 *
 * ต้องมี OAuth Client (Web) ใน GCP โปรเจกต ice-mint-wedding
 * Authorized redirect URI: http://127.0.0.1:5555/oauth2callback
 */
import { createServer } from 'node:http'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeEnvPaths } from './lib/loadEnvFile.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const secretsDir = path.join(root, 'secrets')
const outPath = path.join(secretsDir, 'google-drive-oauth.json')
const clientPath = path.join(secretsDir, 'google-oauth-client.json')
const REDIRECT = 'http://127.0.0.1:5555/oauth2callback'
const SCOPE = 'https://www.googleapis.com/auth/drive'

const env = mergeEnvPaths(path.join(root, '.env'), path.join(root, 'functions', '.env'))

function loadClient() {
  const inline = env.GOOGLE_OAUTH_CLIENT_JSON?.trim()
  if (inline) return JSON.parse(inline)
  if (existsSync(clientPath)) {
    return JSON.parse(readFileSync(clientPath, 'utf8'))
  }
  console.error(`
FAIL: ยังไม่มี OAuth Client

1. เปิด https://console.cloud.google.com/apis/credentials?project=ice-mint-wedding
2. Create Credentials → OAuth client ID → Web application
3. Authorized redirect URI: ${REDIRECT}
4. บันทึก JSON เป็น secrets/google-oauth-client.json รูปแบบ:
   { "client_id": "....apps.googleusercontent.com", "client_secret": "...." }

หรือใส่ GOOGLE_OAUTH_CLIENT_JSON ใน functions/.env (บรรทัดเดียว)
`)
  process.exit(1)
}

const client = loadClient()
const clientId = client.client_id || client.installed?.client_id
const clientSecret = client.client_secret || client.installed?.client_secret
if (!clientId || !clientSecret) {
  console.error('FAIL: client_id / client_secret ไม่ครบ')
  process.exit(1)
}

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
authUrl.searchParams.set('client_id', clientId)
authUrl.searchParams.set('redirect_uri', REDIRECT)
authUrl.searchParams.set('response_type', 'code')
authUrl.searchParams.set('scope', SCOPE)
authUrl.searchParams.set('access_type', 'offline')
authUrl.searchParams.set('prompt', 'consent')

console.log('\n1) ล็อกอินบัญชี Google ที่เป็นเจ้าของโฟลเดอร์ Drive\n')
console.log(authUrl.toString())
console.log('\n2) รอ redirect กลับมาที่ localhost...\n')

const server = createServer(async (req, res) => {
  if (!req.url?.startsWith('/oauth2callback')) return
  const u = new URL(req.url, REDIRECT)
  const code = u.searchParams.get('code')
  const err = u.searchParams.get('error')
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  if (err || !code) {
    res.end(`<p>ยกเลิกหรือ error: ${err ?? 'no code'}</p>`)
    server.close()
    process.exit(1)
  }
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT,
        grant_type: 'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokens.refresh_token) {
      res.end(
        '<p>ไม่ได้ refresh_token — ลบการเข้าถึงแอปที่ myaccount.google.com/permissions แล้วรันสคริปต์ใหม่</p>',
      )
      server.close()
      process.exit(1)
    }
    mkdirSync(secretsDir, { recursive: true })
    const payload = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokens.refresh_token,
    }
    writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
    res.end('<p>สำเร็จ — ปิดหน้านี้ได้ แล้วรัน npm run media:deploy</p>')
    console.log(`\nOK — บันทึก ${outPath}`)
    console.log('ต่อไป: npm run media:deploy\n')
  } catch (e) {
    res.end(`<p>error: ${e.message}</p>`)
    console.error(e)
    process.exit(1)
  } finally {
    server.close()
    process.exit(0)
  }
})

server.listen(5555, '127.0.0.1', () => {
  import('node:child_process').then(({ exec }) => {
    exec(`start "" "${authUrl.toString()}"`, { shell: true })
  })
})
