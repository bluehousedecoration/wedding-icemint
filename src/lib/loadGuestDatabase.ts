import { siteContent } from '../config/siteContent'
import type { GuestDatabase } from '../types/guest'

function isValidDb(json: unknown): json is GuestDatabase {
  if (typeof json !== 'object' || json === null) return false
  const guests = (json as GuestDatabase).guests
  return Array.isArray(guests) && guests.length > 0
}

/** ลำดับ: env ERP → siteContent URL → seating.json บน Pages */
export function getSeatingSourceUrls(): string[] {
  const urls: string[] = []
  const fromEnv = import.meta.env.VITE_SEATING_JSON_URL?.trim()
  if (fromEnv) urls.push(fromEnv)

  const fromConfig = siteContent.seatingLiveJsonUrl?.trim() ?? ''
  if (fromConfig && fromConfig !== fromEnv) urls.push(fromConfig)

  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  urls.push(`${base}seating.json`)

  return urls
}

export async function fetchGuestDatabase(): Promise<GuestDatabase | null> {
  for (const url of getSeatingSourceUrls()) {
    try {
      const res = await fetch(url, { cache: 'no-cache' })
      if (!res.ok) continue
      const json: unknown = await res.json()
      if (isValidDb(json)) return json
    } catch {
      /* CORS / offline — ลองแหล่งถัดไป */
    }
  }
  return null
}
