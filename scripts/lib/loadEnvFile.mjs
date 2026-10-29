import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

/** โหลด KEY=value จาก .env (ไม่ใช้ dotenv package) */
export function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return {}
  const text = readFileSync(filePath, 'utf8')
  const out = {}
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

export function mergeEnvPaths(...paths) {
  const merged = {}
  for (const p of paths) {
    Object.assign(merged, loadEnvFile(p))
  }
  return merged
}

export function resolveFromRoot(root, maybePath) {
  if (!maybePath?.trim()) return null
  const p = maybePath.trim()
  if (path.isAbsolute(p)) return p
  return path.join(root, p)
}
