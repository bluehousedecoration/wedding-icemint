/**
 * ทดสอบ Media API หลัง deploy — อ่าน VITE_MEDIA_API_BASE จาก .env
 */
import { mergeEnvPaths } from './lib/loadEnvFile.mjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const env = mergeEnvPaths(path.join(root, '.env'), path.join(root, 'functions', '.env'))

const base = env.VITE_MEDIA_API_BASE?.trim().replace(/\/$/, '')
if (!base) {
  console.error('FAIL: ใส่ VITE_MEDIA_API_BASE ใน .env (root)')
  process.exit(1)
}

const album = env.MEDIA_VERIFY_ALBUM?.trim() || 'prewedding'

async function check(url, label) {
  const res = await fetch(url, { cache: 'no-store' })
  console.log(`${label}: ${res.status} ${url}`)
  if (!res.ok) {
    const t = await res.text()
    console.error(t.slice(0, 500))
    return false
  }
  return true
}

let ok = true
ok &&= await check(`${base}/health`, 'health')
ok &&= await check(`${base}/media/list?album=${encodeURIComponent(album)}&page=1&pageSize=5`, 'list')

if (ok) {
  const listRes = await fetch(
    `${base}/media/list?album=${encodeURIComponent(album)}&page=1&pageSize=5`,
    { cache: 'no-store' },
  )
  const data = await listRes.json()
  console.log(`  items: ${data.items?.length ?? 0}, hasMore: ${data.hasMore}`)

  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  )
  const form = new FormData()
  form.append('type', 'photo')
  form.append('sourceLabel', 'verify-script')
  form.append('file', new Blob([png], { type: 'image/png' }), 'verify.png')
  const up = await fetch(`${base}/media/share`, {
    method: 'POST',
    body: form,
    headers: { Origin: 'https://icemintwedding20dec26.com' },
  })
  console.log(`share upload test: ${up.status}`)
  const upText = await up.text()
  if (up.ok) {
    console.log(`  ${upText.slice(0, 120)}`)
    console.log('\nOK — API + Drive พร้อม · /share บนเว็บอัปโหลดได้')
  } else {
    console.log(`  ${upText.slice(0, 200)}`)
    if (upText.includes('drive_upload_not_configured') || upText.includes('drive_sa_no_quota')) {
      console.warn(
        '\nWARN — ต้องตั้ง OAuth อัปโหลด: npm run drive:oauth แล้ว npm run media:deploy (ดู docs/DRIVE-QUICKSTART.md §3)',
      )
    } else {
      console.warn(
        '\nWARN — list/health OK แต่อัปโหลดไม่ผ่าน: ตรวจ OAuth + สิทธิโฟลเดอร์ Drive',
      )
    }
  }
} else {
  process.exit(1)
}
