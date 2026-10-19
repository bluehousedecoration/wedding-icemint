/**
 * สร้าง CSV ลิงก์ QR ต่อแขก สำหรับ Canva / การพิมพ์การ์ด
 *
 *   SITE_ORIGIN=https://your-user.github.io BASE_PATH=/repo-name/ npm run qr:export
 *
 * ผลลัพธ์: data/guest-qr-links.csv
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const guestsPath = path.join(root, 'src', 'data', 'guests.json')
const outPath = path.join(root, 'data', 'guest-qr-links.csv')

const siteOrigin = (process.env.SITE_ORIGIN ?? 'https://YOUR-SITE-ORIGIN').replace(/\/$/, '')
const basePath = process.env.BASE_PATH ?? '/'
const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
const pathPrefix = base === '' || base === '/' ? '' : base

function inviteUrl(guestId) {
  const pathPart = pathPrefix === '' ? '/' : `${pathPrefix}/`
  return `${siteOrigin}${pathPart}?g=${encodeURIComponent(guestId)}`
}

const db = JSON.parse(readFileSync(guestsPath, 'utf8'))
const lines = ['id,label,table,zone,invite_url']
for (const g of db.guests) {
  const row = [
    g.id,
    `"${String(g.label).replace(/"/g, '""')}"`,
    g.table,
    `"${String(g.zone).replace(/"/g, '""')}"`,
    inviteUrl(g.id),
  ]
  lines.push(row.join(','))
}
writeFileSync(outPath, lines.join('\n') + '\n', 'utf8')
console.log(`Wrote ${db.guests.length} links → ${outPath}`)
console.log(`Origin: ${siteOrigin}  Base: ${basePath}`)
