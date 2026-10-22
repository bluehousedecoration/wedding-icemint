/** GitHub Pages: 404.html = index.html เพื่อให้ React Router เปิด /seat, /share ฯลฯ ได้ */
import { copyFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const index = path.join(root, 'dist', 'index.html')
const notFound = path.join(root, 'dist', '404.html')

if (!existsSync(index)) {
  console.error('dist/index.html not found — run vite build first')
  process.exit(1)
}

copyFileSync(index, notFound)
console.log('Copied dist/index.html → dist/404.html (SPA fallback)')
