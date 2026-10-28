/**
 * ดึง guest-seating.json จาก ERP → public/seating.json (ให้ตรง prod + fallback dev)
 */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'public', 'seating.json')
const url =
  process.env.SEATING_JSON_URL?.trim() ||
  'https://erp.bluehousedecoration.com/wedding/seating/guest-seating.json'

const res = await fetch(url, { cache: 'no-store' })
if (!res.ok) {
  console.error(`sync failed: ${res.status} ${url}`)
  process.exit(1)
}
const json = await res.json()
if (!Array.isArray(json.tables) || json.tables.length === 0) {
  console.error('sync failed: not a public seating snapshot (tables empty)')
  process.exit(1)
}
writeFileSync(out, `${JSON.stringify(json, null, 2)}\n`, 'utf8')
console.log(`Synced ${json.tables.length} tables → public/seating.json (${json.updatedAt})`)
