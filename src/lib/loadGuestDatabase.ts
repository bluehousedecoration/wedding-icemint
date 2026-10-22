import { siteContent } from '../config/siteContent'
import type { GuestDatabase } from '../types/guest'

function isValidDb(json: unknown): json is GuestDatabase {
  if (typeof json !== 'object' || json === null) return false
  const guests = (json as GuestDatabase).guests
  return Array.isArray(guests) && guests.length > 0
}

/** ลำดับ: env ERP → siteContent URL → seating.json บน Pages */
const FETCH_MS = 8_000

export function getSeatingSourceUrls(): string[] {
  const urls: string[] = []
  const fromEnv = import.meta.env.VITE_SEATING_JSON_URL?.trim()
  if (fromEnv) urls.push(fromEnv)

  const fromConfig = siteContent.seatingLiveJsonUrl?.trim() ?? ''
  if (fromConfig && fromConfig !== fromEnv) urls.push(fromConfig)

  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  const localUrl = `${base}seating.json`

  /** บน local ใช้ seating.json ก่อน — ไม่รอ ERP/CORS */
  if (import.meta.env.DEV) {
    return [localUrl, ...urls.filter((u) => u !== localUrl)]
  }

  urls.push(localUrl)
  return urls
}

export async function fetchGuestDatabase(): Promise<GuestDatabase | null> {
  for (const url of getSeatingSourceUrls()) {
    try {
      const res = await fetch(url, {
        cache: 'no-cache',
        signal: AbortSignal.timeout(FETCH_MS),
      })
      if (!res.ok) continue
      const json: unknown = await res.json()
      if (isValidDb(json)) return json
    } catch {
      /* CORS / offline — ลองแหล่งถัดไป */
    }
  }
  return null
}
