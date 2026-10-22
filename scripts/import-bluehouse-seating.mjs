/**
 * แปลง export จาก Bluehouse Wedding → guests.json + public/seating.json
 *
 * รองรับ JSON รูปแบบ:
 * A) { "guests": [{ "id", "label", "table", "zone?", "seats?" }] }
 * B) [{ "id"|"code", "label"|"name", "table"|"tableNumber", "zone", "seats" }]
 * C) CSV path ใน argv[2] — ใช้ logic เดียวกับ guests-from-csv
 *
 * รัน: node scripts/import-bluehouse-seating.mjs path/to/export.json
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcOut = path.join(root, 'src', 'data', 'guests.json')
const publicOut = path.join(root, 'public', 'seating.json')

const input = process.argv[2]
if (!input) {
  console.log(`
Usage:
  node scripts/import-bluehouse-seating.mjs <export.json|.csv>

Bluehouse: export รายชื่อ+โต๊ะจาก Wedding → Seating แล้วส่งไฟล์ JSON/CSV มาที่นี่
คอลัมน์ที่ต้องมี: id (รหัส QR), ชื่อ, table
`)
  process.exit(1)
}

const abs = path.resolve(input)
const raw = readFileSync(abs, 'utf8')

function normalizeRow(r) {
  const id = String(r.id ?? r.code ?? r.guestId ?? '').replace(/-/g, '').toUpperCase()
  const label = r.label ?? r.name ?? r.guestName ?? ''
  const table = Number(r.table ?? r.tableNumber ?? r.table_no)
  const zone = r.zone ?? r.side ?? '—'
  const seats = Number(r.seats ?? r.pax ?? 2)
  const tableName = r.tableName ?? r.table_name ?? r.tableTitle ?? ''
  const seatLabel = r.seatLabel ?? r.seat_label ?? r.seatName ?? ''
  return {
    id,
    label,
    table,
    zone,
    seats,
    ...(tableName ? { tableName: String(tableName) } : {}),
    ...(seatLabel ? { seatLabel: String(seatLabel) } : {}),
  }
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/)
  const [header, ...rows] = lines
  const cols = header.split(',').map((c) => c.trim())
  return rows.filter(Boolean).map((line) => {
    const cells = line.split(',').map((c) => c.trim())
    const row = {}
    cols.forEach((col, i) => {
      row[col] = cells[i] ?? ''
    })
    return row
  })
}

let rows = []
if (abs.endsWith('.csv')) {
  rows = parseCsv(raw)
} else {
  const parsed = JSON.parse(raw)
  if (Array.isArray(parsed)) rows = parsed
  else if (parsed.guests) rows = parsed.guests
  else rows = []
}

const guests = rows.map(normalizeRow).filter((g) => g.id && g.label && !Number.isNaN(g.table))

const payload = {
  updatedAt: new Date().toISOString().slice(0, 10),
  source: 'bluehouse',
  guests,
}

const json = JSON.stringify(payload, null, 2) + '\n'
writeFileSync(srcOut, json, 'utf8')
writeFileSync(publicOut, json, 'utf8')
console.log(`Imported ${guests.length} guests →`)
console.log(`  ${srcOut}`)
console.log(`  ${publicOut}`)
console.log('Next: npm run build (or refresh dev — โหลด seating.json อัตโนมัติ)')
