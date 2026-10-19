import { useEffect, useState } from 'react'
import guestDatabase from '../data/guests.json'
import type { GuestDatabase, GuestRecord } from '../types/guest'
import { normalizeGuestCode } from '../lib/guestCode'

const bundled = guestDatabase as GuestDatabase

/**
 * โหลดรายชื่อจาก public/seating.json (sync จาก Bluehouse) ถ้ามี
 * ไม่มีหรือโหลดไม่ได้ → ใช้ guests.json ใน bundle
 */
export function useGuests() {
  const [data, setData] = useState<GuestDatabase>(bundled)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
    const url = `${base}seating.json`

    fetch(url, { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: GuestDatabase | null) => {
        if (json?.guests && Array.isArray(json.guests) && json.guests.length > 0) {
          setData(json)
        }
      })
      .catch(() => {
        setError(null)
      })
      .finally(() => {
        setLoading(false)
      })
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
