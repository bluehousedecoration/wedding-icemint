/**
 * Deploy mediaApi (Drive) หลังใส่ functions/.env
 * ใช้: npm run media:deploy
 */
import { execSync } from 'node:child_process'
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeEnvPaths, resolveFromRoot } from './lib/loadEnvFile.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const functionsDir = path.join(root, 'functions')
const tmpDir = path.join(root, '.media-deploy-tmp')

function run(cmd, opts = {}) {
  console.log(`\n> ${cmd}\n`)
  execSync(cmd, {
    stdio: 'inherit',
    cwd: opts.cwd ?? root,
    shell: true,
    env: { ...process.env, ...opts.env },
  })
}

function readJsonFile(filePath, label) {
  const raw = readFileSync(filePath, 'utf8').trim()
  JSON.parse(raw)
  return raw
}

function resolveSecretJson(env, inlineKey, fileKey, label) {
  const fileRel = env[fileKey]?.trim()
  if (fileRel) {
    const rel = fileRel.replace(/^\.\.\//, '')
    const candidates = [
      resolveFromRoot(root, rel),
      resolveFromRoot(functionsDir, fileRel),
      path.isAbsolute(fileRel) ? fileRel : null,
    ].filter(Boolean)
    const abs = candidates.find((p) => existsSync(p))
    if (!abs) {
      throw new Error(`${fileKey} ไม่พบไฟล์: ${fileRel}`)
    }
    return readJsonFile(abs, label)
  }
  const inline = env[inlineKey]?.trim()
  if (inline) {
    JSON.parse(inline)
    return inline
  }
  throw new Error(`ใส่ ${inlineKey} (บรรทัดเดียว) หรือ ${fileKey} (path ไปไฟล์ .json)`)
}

const env = mergeEnvPaths(
  path.join(root, '.env'),
  path.join(functionsDir, '.env'),
)

const projectId =
  env.VITE_FIREBASE_PROJECT_ID?.trim() ||
  env.GCP_PROJECT_ID?.trim() ||
  env.FIREBASE_PROJECT_ID?.trim()

if (!projectId) {
  console.error('FAIL: ใส่ VITE_FIREBASE_PROJECT_ID=ice-mint-wedding ใน root .env')
  process.exit(1)
}

let saJson
let albumsJson
try {
  saJson = resolveSecretJson(
    env,
    'GOOGLE_SERVICE_ACCOUNT_JSON',
    'GOOGLE_SERVICE_ACCOUNT_JSON_FILE',
    'Service Account',
  )
  albumsJson = resolveSecretJson(
    env,
    'DRIVE_ALBUMS_JSON',
    'DRIVE_ALBUMS_JSON_FILE',
    'Drive albums',
  )
} catch (e) {
  console.error('FAIL:', e.message)
  process.exit(1)
}

const allowedOrigins =
  env.ALLOWED_ORIGINS?.trim() ||
  'https://icemintwedding20dec26.com,https://www.icemintwedding20dec26.com,http://127.0.0.1:5173,http://localhost:5173'

mkdirSync(tmpDir, { recursive: true })
const saPath = path.join(tmpDir, 'sa.json')
const albumsPath = path.join(tmpDir, 'albums.json')
const originsPath = path.join(tmpDir, 'origins.txt')
writeFileSync(saPath, saJson, 'utf8')
writeFileSync(albumsPath, albumsJson, 'utf8')
writeFileSync(originsPath, allowedOrigins, 'utf8')

writeFileSync(
  path.join(root, '.firebaserc'),
  `${JSON.stringify({ projects: { default: projectId } }, null, 2)}\n`,
  'utf8',
)

const fb = 'npx --yes firebase-tools@14'

try {
  try {
    run(`${fb} --version`)
  } catch {
    console.error('FAIL: ไม่สามารถรัน firebase-tools — ตรวจเน็ตแล้วลองใหม่ หรือ npm i -g firebase-tools')
    process.exit(1)
  }

  run('npm install', { cwd: functionsDir })
  run('npm run build', { cwd: functionsDir })

  run(`${fb} use ${projectId}`)
  run(`${fb} functions:secrets:set GOOGLE_SERVICE_ACCOUNT_JSON --data-file "${saPath}" --force`)
  run(`${fb} functions:secrets:set DRIVE_ALBUMS_JSON --data-file "${albumsPath}" --force`)
  run(`${fb} functions:secrets:set ALLOWED_ORIGINS --data-file "${originsPath}" --force`)
  run(`${fb} deploy --only functions:mediaApi`)

  const mediaBase = `https://asia-southeast1-${projectId}.cloudfunctions.net/mediaApi`
  console.log('\n=== Deploy เสร็จ ===')
  console.log('ใส่ใน .env (root) แล้ว npm run dev / push GitHub:')
  console.log(`VITE_MEDIA_API_BASE=${mediaBase}`)
  console.log('\nGitHub Pages: Settings → Secrets → VITE_MEDIA_API_BASE (ค่าเดียวกัน)')
  console.log('ทดสอบ: npm run media:verify')
} finally {
  try {
    rmSync(tmpDir, { recursive: true, force: true })
  } catch {
    /* ignore */
  }
}
