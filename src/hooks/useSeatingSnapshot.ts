import { useCallback, useEffect, useRef, useState } from 'react'
import guestDatabase from '../data/guests.json'
import { fetchSeatingSnapshot } from '../lib/loadSeatingSnapshot'
import { normalizeSeatingPayload } from '../lib/seatingSnapshot'
import type { GuestDatabase } from '../types/guest'
import type { PublicSeatingSnapshot } from '../types/seating'

const bundled = guestDatabase as GuestDatabase
const bundledFallback = normalizeSeatingPayload(bundled)

const POLL_MS = 15_000

type Options = {
  poll?: boolean
}

export function useSeatingSnapshot(options: Options = {}) {
  const poll = options.poll ?? false
  const [data, setData] = useState<PublicSeatingSnapshot>(
    bundledFallback ?? {
      updatedAt: bundled.updatedAt,
      source: 'bundled',
      layout: {
        floorPlanImage: '/floor-plan-ava.png',
        entrance: { x: 78, y: 94 },
        aisleX: 50,
      },
      tables: [],
      assignments: [],
      searchIndex: [],
    },
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const updatedRef = useRef(data.updatedAt)

  const load = useCallback(async (silent?: boolean) => {
    if (!silent) setLoading(true)
    try {
      const remote = await fetchSeatingSnapshot()
      if (remote && remote.updatedAt !== updatedRef.current) {
        updatedRef.current = remote.updatedAt
        setData(remote)
      } else if (remote) {
        setData(remote)
      }
      setError(null)
    } catch {
      if (!silent) setError('โหลดข้อมูลโต๊ะไม่สำเร็จ')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(false)
  }, [load])

  useEffect(() => {
    if (!poll) return

    const tick = () => {
      if (document.hidden) return
      load(true)
    }

    const id = setInterval(tick, POLL_MS)
    const onVis = () => {
      if (!document.hidden) load(true)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [poll, load])

  return { data, loading, error, refresh: () => load(false) }
}
