/**
 * Excel/Sheets/Bluehouse export → guests.json
 *
 * คอลัมน์ CSV (หัวแถว):
 *   id,label,table,zone,seats
 *
 * รัน: npm run guests:build
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const csvPath = path.join(root, 'data', 'guests.csv')
const srcOut = path.join(root, 'src', 'data', 'guests.json')
/** ไม่เขียน public/seating.json — ใช้ scripts/sync-seating-snapshot.mjs จาก ERP แทน */

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
    source: 'csv',
    guests,
  }
  const json = JSON.stringify(payload, null, 2) + '\n'
  writeFileSync(srcOut, json, 'utf8')
  console.log(`Wrote ${guests.length} guests → ${srcOut}`)
} catch (e) {
  if (e.code === 'ENOENT') {
    console.log('ยังไม่มี data/guests.csv — export จาก Bluehouse/Sheets แล้วรัน npm run guests:build')
    process.exit(0)
  }
  throw e
}
