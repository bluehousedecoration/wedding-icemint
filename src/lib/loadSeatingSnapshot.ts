import { siteContent } from '../config/siteContent'
import { normalizeSeatingPayload } from './seatingSnapshot'
import type { PublicSeatingSnapshot } from '../types/seating'

const FETCH_MS = 8_000

export function getSeatingSourceUrls(): string[] {
  const urls: string[] = []
  const fromEnv = import.meta.env.VITE_SEATING_JSON_URL?.trim()
  if (fromEnv) urls.push(fromEnv)

  const fromConfig = siteContent.seatingLiveJsonUrl?.trim() ?? ''
  if (fromConfig && fromConfig !== fromEnv) urls.push(fromConfig)

  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  const localUrl = `${base}seating.json`

  const preferLive = import.meta.env.VITE_SEATING_LIVE === '1'
  const remoteOnly = urls.filter((u) => u !== localUrl)

  /** Production: ใช้ ERP เท่านั้น — ไม่ fallback seating.json ใน dist (ให้ตรงผังจริง) */
  if (import.meta.env.PROD && remoteOnly.length > 0) {
    return remoteOnly
  }

  /** Dev: ERP ก่อน (ตรง prod) — local เป็น fallback ตอน offline */
  if (import.meta.env.DEV && !preferLive) {
    return [...remoteOnly, localUrl]
  }

  urls.push(localUrl)
  return urls
}

export async function fetchSeatingSnapshot(): Promise<PublicSeatingSnapshot | null> {
  for (const url of getSeatingSourceUrls()) {
    try {
      const res = await fetch(url, {
        cache: 'no-cache',
        signal: AbortSignal.timeout(FETCH_MS),
      })
      if (!res.ok) continue
      const json: unknown = await res.json()
      const snapshot = normalizeSeatingPayload(json)
      if (snapshot) return snapshot
    } catch {
      /* ลองแหล่งถัดไป */
    }
  }
  return null
}
