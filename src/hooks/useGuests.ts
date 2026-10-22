import { useEffect, useState } from 'react'
import guestDatabase from '../data/guests.json'
import { fetchGuestDatabase } from '../lib/loadGuestDatabase'
import type { GuestDatabase, GuestRecord } from '../types/guest'
import { normalizeGuestCode } from '../lib/guestCode'

const bundled = guestDatabase as GuestDatabase

/**
 * โหลดรายชื่อ: Bluehouse URL → public/seating.json → guests.json ใน bundle
 */
export function useGuests() {
  const [data, setData] = useState<GuestDatabase>(bundled)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchGuestDatabase()
      .then((remote) => {
        if (cancelled) return
        if (remote) setData(remote)
      })
      .catch(() => {
        if (!cancelled) setError(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { data, error, loading }
}

export function findGuestByCode(
  db: GuestDatabase | null,
  code: string | null,
): GuestRecord | undefined {
  if (!db || !code) return undefined
  const id = normalizeGuestCode(code)
  return db.guests.find((g) => normalizeGuestCode(g.id) === id)
}
