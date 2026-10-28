import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react'

const ZOOM_MIN = 75
const ZOOM_MAX = 220
const ZOOM_STEP = 12

function clampZoom(z: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z))
}

type GuestFloorPlanZoomProps = {
  children: ReactNode
}

export function GuestFloorPlanZoom({ children }: GuestFloorPlanZoomProps) {
  const [zoom, setZoom] = useState(100)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [panning, setPanning] = useState(false)
  const zoomRef = useRef(zoom)
  const panRef = useRef(pan)
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const pinchStart = useRef<{ dist: number; zoom: number } | null>(null)

  zoomRef.current = zoom
  panRef.current = pan

  const zoomAnchored = useCallback((nz: number, ax: number, ay: number) => {
    setZoom((z) => {
      const next = clampZoom(nz)
      const ratio = next / z
      setPan((p) => ({
        x: ax - (ax - p.x) * ratio,
        y: ay - (ay - p.y) * ratio,
      }))
      return next
    })
  }, [])

  const applyZoom = useCallback(
    (newZoom: number, anchorX?: number, anchorY?: number) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) {
        setZoom(clampZoom(newZoom))
        return
      }
      zoomAnchored(newZoom, anchorX ?? rect.width / 2, anchorY ?? rect.height / 2)
    },
    [zoomAnchored],
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let wheelRaf = 0
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const ax = e.clientX - rect.left
      const ay = e.clientY - rect.top
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP
      if (wheelRaf) cancelAnimationFrame(wheelRaf)
      wheelRaf = requestAnimationFrame(() => {
        zoomAnchored(zoomRef.current + delta, ax, ay)
      })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      if (wheelRaf) cancelAnimationFrame(wheelRaf)
    }
  }, [zoomAnchored])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const touchDistance = (t: TouchList) => {
      if (t.length < 2) return 0
      const dx = t[0].clientX - t[1].clientX
      const dy = t[0].clientY - t[1].clientY
      return Math.hypot(dx, dy)
    }

    const touchMid = (t: TouchList, rect: DOMRect) => ({
      x: (t[0].clientX + t[1].clientX) / 2 - rect.left,
      y: (t[0].clientY + t[1].clientY) / 2 - rect.top,
    })

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchStart.current = {
          dist: touchDistance(e.touches),
          zoom: zoomRef.current,
        }
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      const pinch = pinchStart.current
      if (!pinch || e.touches.length !== 2 || pinch.dist <= 0) return
      e.preventDefault()
      const dist = touchDistance(e.touches)
      const rect = el.getBoundingClientRect()
      const mid = touchMid(e.touches, rect)
      const nz = pinch.zoom * (dist / pinch.dist)
      zoomAnchored(nz, mid.x, mid.y)
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchStart.current = null
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [zoomAnchored])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (zoom <= 100 || e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('button, a, input, textarea, select')) return
    e.preventDefault()
    setPanning(true)
    panStart.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panRef.current.x,
      panY: panRef.current.y,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!panning) return
    setPan({
      x: panStart.current.panX + (e.clientX - panStart.current.x),
      y: panStart.current.panY + (e.clientY - panStart.current.y),
    })
  }

  const endPan = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!panning) return
    setPanning(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const resetView = () => {
    setZoom(100)
    setPan({ x: 0, y: 0 })
  }

  const scale = zoom / 100
  const canPan = zoom > 100

  return (
    <div className="guest-floor-zoom">
      <div className="guest-floor-zoom-toolbar" role="toolbar" aria-label="ซูมผังที่นั่ง">
        <button
          type="button"
          className="guest-floor-zoom-btn"
          onClick={() => applyZoom(zoom - ZOOM_STEP)}
          disabled={zoom <= ZOOM_MIN}
          aria-label="ซูมออก"
        >
          −
        </button>
        <span className="guest-floor-zoom-label" aria-live="polite">
          {zoom}%
        </span>
        <button
          type="button"
          className="guest-floor-zoom-btn"
          onClick={() => applyZoom(zoom + ZOOM_STEP)}
          disabled={zoom >= ZOOM_MAX}
          aria-label="ซูมเข้า"
        >
          +
        </button>
        <button type="button" className="guest-floor-zoom-btn guest-floor-zoom-btn-text" onClick={() => applyZoom(100)}>
          100%
        </button>
        <button type="button" className="guest-floor-zoom-btn guest-floor-zoom-btn-text" onClick={resetView}>
          รีเซ็ต
        </button>
        <span className="guest-floor-zoom-hint">
          {canPan ? 'ลากผังเลื่อน · บีบนิ้วซูม' : 'บีบนิ้วหรือกด + ซูม'}
        </span>
      </div>
      <div
        ref={containerRef}
        className={`guest-floor-zoom-viewport${canPan ? (panning ? ' guest-floor-zoom-viewport--grabbing' : ' guest-floor-zoom-viewport--grab') : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
      >
        <div
          className="guest-floor-zoom-layer"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
