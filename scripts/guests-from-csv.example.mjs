/**
 * ตัวอย่าง workflow: Excel/Sheets → CSV → guests.json
 *
 * คอลัมน์ CSV (หัวแถว):
 *   id,label,table,zone,seats
 *
 * id = รหัสคงที่สำหรับ QR (ไม่เปลี่ยน)
 * table, zone, ... = แก้ได้ก่อนงาน แล้ว npm run build + deploy
 *
 * รัน (เมื่อมีไฟล์ data/guests.csv):
 *   node scripts/guests-from-csv.example.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const csvPath = path.join(root, 'data', 'guests.csv')
const outPath = path.join(root, 'src', 'data', 'guests.json')

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/)
  const [header, ...rows] = lines
  const cols = header.split(',').map((c) => c.trim())
  return rows.map((line) => {
    const cells = line.split(',').map((c) => c.trim())
    const row = {}
    cols.forEach((col, i) => {
      row[col] = cells[i] ?? ''
    })
    return row
  })
}

try {
  const csv = readFileSync(csvPath, 'utf8')
  const rows = parseCsv(csv)
  const guests = rows.map((r) => ({
    id: String(r.id).replace(/-/g, '').toUpperCase(),
    label: r.label,
    table: Number(r.table),
    zone: r.zone,
    seats: Number(r.seats),
  }))
  const payload = {
    updatedAt: new Date().toISOString().slice(0, 10),
    guests,
  }
  writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8')
  console.log(`Wrote ${guests.length} guests → ${outPath}`)
} catch (e) {
  if (e.code === 'ENOENT') {
    console.log('ยังไม่มี data/guests.csv — สร้างจาก Google Sheets export แล้วรันสคริปต์นี้')
  } else {
    throw e
  }
}
