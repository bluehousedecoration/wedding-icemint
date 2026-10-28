/**
 * ตรวจว่า JSON สาธารณะจาก ERP พร้อมให้เว็บแขกใช้ (และตรง spec กับ ERP publish)
 */
const ERP_JSON =
  process.env.SEATING_JSON_URL?.trim() ||
  'https://erp.bluehousedecoration.com/wedding/seating/guest-seating.json'
const GUEST_SITE = process.env.GUEST_SITE_URL?.trim() || 'https://icemintwedding20dec26.com'

const res = await fetch(ERP_JSON, { cache: 'no-store' })
if (!res.ok) {
  console.error('FAIL: ERP JSON', res.status, ERP_JSON)
  process.exit(1)
}
const snap = await res.json()
let ok = true
const fail = (msg) => {
  console.error('FAIL:', msg)
  ok = false
}

if (!snap.layout?.floorPlanImage?.includes('floor-plan-ava')) {
  fail(`layout.floorPlanImage should be AVA, got ${snap.layout?.floorPlanImage}`)
}
if (!Array.isArray(snap.tables) || snap.tables.length < 1) {
  fail('tables missing or empty')
}
if (!Array.isArray(snap.searchIndex)) {
  fail('searchIndex missing')
}
if (snap.layout?.entrance?.x == null || snap.layout?.entrance?.y == null) {
  fail('layout.entrance incomplete')
}
if (snap.layout?.aisleX == null) {
  fail('layout.aisleX missing')
}

for (const t of snap.tables ?? []) {
  if (t.posX < 0 || t.posX > 100 || t.posY < 0 || t.posY > 100) {
    fail(`table ${t.tableNo} pos out of range: ${t.posX}, ${t.posY}`)
  }
}

console.log('ERP snapshot OK')
console.log('  updatedAt:', snap.updatedAt)
console.log('  tables:', snap.tables.length)
console.log('  layout:', JSON.stringify(snap.layout))
console.log('  guest /seat uses this URL in production:', ERP_JSON)
console.log('  compare visually: ERP → หน้าแขก (preview) vs', `${GUEST_SITE}/seat`)

if (!ok) process.exit(1)
