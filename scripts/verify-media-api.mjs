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
  console.log('\nOK — เปิด /photos บนเว็บได้ (ถ้า VITE_MEDIA_API_BASE ใน build แล้ว)')
} else {
  process.exit(1)
}
