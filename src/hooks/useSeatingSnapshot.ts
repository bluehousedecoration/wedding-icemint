import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchSeatingSnapshot } from '../lib/loadSeatingSnapshot'
import type { PublicSeatingSnapshot } from '../types/seating'

/** ไม่ใช้ legacy FLOOR_TABLE_POSITIONS ตอน boot — รอ ERP / seating.json จริง */
const INITIAL_SNAPSHOT: PublicSeatingSnapshot = {
  updatedAt: '',
  source: 'loading',
  layout: {
    floorPlanImage: '/floor-plan-ava.png',
    entrance: { x: 85, y: 68.5 },
    aisleX: 51,
  },
  tables: [],
  assignments: [],
  searchIndex: [],
}

const POLL_MS = 15_000

type Options = {
  poll?: boolean
}

export function useSeatingSnapshot(options: Options = {}) {
  const poll = options.poll ?? false
  const [data, setData] = useState<PublicSeatingSnapshot>(INITIAL_SNAPSHOT)
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
