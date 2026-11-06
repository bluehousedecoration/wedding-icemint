import { useEffect, useRef, useState } from 'react'
import type { MediaListItem } from '../config/mediaApi'

type MediaLightboxProps = {
  items: MediaListItem[]
  index: number | null
  canPrev: boolean
  canNext: boolean
  loadingMore: boolean
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

type Zoom = { scale: number; x: number; y: number }

const MIN_SCALE = 1
const MAX_SCALE = 4

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function ZoomablePhoto({
  src,
  alt,
  onSwipe,
}: {
  src: string
  alt: string
  onSwipe: (direction: -1 | 1) => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef<Zoom>({ scale: 1, x: 0, y: 0 })
  const [zoom, setZoom] = useState<Zoom>(zoomRef.current)
  const lastTap = useRef(0)

  function apply(next: Zoom) {
    const stage = stageRef.current
    const scale = clamp(next.scale, MIN_SCALE, MAX_SCALE)
    let x = next.x
    let y = next.y
    if (scale <= 1.01) {
      x = 0
      y = 0
    } else if (stage) {
      const maxX = (stage.clientWidth * (scale - 1)) / 2
      const maxY = (stage.clientHeight * (scale - 1)) / 2
      x = clamp(x, -maxX, maxX)
      y = clamp(y, -maxY, maxY)
    }
    const value = { scale, x, y }
    zoomRef.current = value
    setZoom(value)
  }

  useEffect(() => {
    apply({ scale: 1, x: 0, y: 0 })
  }, [src])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return

    type Gesture = {
      mode: 'pinch' | 'pan' | 'swipe'
      startX: number
      startY: number
      originX: number
      originY: number
      originScale: number
      dist: number
      midX: number
      midY: number
    }
    let gesture: Gesture | null = null

    function focalShift(
      clientX: number,
      clientY: number,
      originScale: number,
      originX: number,
      originY: number,
      nextScale: number,
    ) {
      const rect = el!.getBoundingClientRect()
      const lx = clientX - rect.left - rect.width / 2
      const ly = clientY - rect.top - rect.height / 2
      const ratio = nextScale / Math.max(originScale, 0.01)
      return {
        x: lx - (lx - originX) * ratio,
        y: ly - (ly - originY) * ratio,
      }
    }

    function onStart(event: TouchEvent) {
      if (event.touches.length >= 2) {
        const a = event.touches[0]
        const b = event.touches[1]
        gesture = {
          mode: 'pinch',
          startX: 0,
          startY: 0,
          originX: zoomRef.current.x,
          originY: zoomRef.current.y,
          originScale: zoomRef.current.scale,
          dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
          midX: (a.clientX + b.clientX) / 2,
          midY: (a.clientY + b.clientY) / 2,
        }
        return
      }
      const touch = event.touches[0]
      gesture = {
        mode: zoomRef.current.scale > 1.02 ? 'pan' : 'swipe',
        startX: touch.clientX,
        startY: touch.clientY,
        originX: zoomRef.current.x,
        originY: zoomRef.current.y,
        originScale: zoomRef.current.scale,
        dist: 0,
        midX: touch.clientX,
        midY: touch.clientY,
      }
    }

    function onMove(event: TouchEvent) {
      if (!gesture) return
      if (gesture.mode === 'pinch' && event.touches.length >= 2) {
        event.preventDefault()
        const a = event.touches[0]
        const b = event.touches[1]
        const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
        const next = clamp(gesture.originScale * (dist / Math.max(gesture.dist, 1)), MIN_SCALE, MAX_SCALE)
        const midX = (a.clientX + b.clientX) / 2
        const midY = (a.clientY + b.clientY) / 2
        const shifted = focalShift(gesture.midX, gesture.midY, gesture.originScale, gesture.originX, gesture.originY, next)
        apply({
          scale: next,
          x: shifted.x + (midX - gesture.midX),
          y: shifted.y + (midY - gesture.midY),
        })
        return
      }
      if (gesture.mode === 'pan' && event.touches.length === 1) {
        event.preventDefault()
        const touch = event.touches[0]
        apply({
          scale: zoomRef.current.scale,
          x: gesture.originX + (touch.clientX - gesture.startX),
          y: gesture.originY + (touch.clientY - gesture.startY),
        })
      }
    }

    function onEnd(event: TouchEvent) {
      if (!gesture || event.touches.length > 0) return
      const current = gesture
      gesture = null
      if (current.mode !== 'swipe') {
        if (zoomRef.current.scale < 1.05) apply({ scale: 1, x: 0, y: 0 })
        return
      }
      const touch = event.changedTouches[0]
      const dx = touch.clientX - current.startX
      const dy = touch.clientY - current.startY
      const now = Date.now()
      if (Math.hypot(dx, dy) < 16 && now - lastTap.current < 300) {
        lastTap.current = 0
        if (zoomRef.current.scale > 1.05) {
          apply({ scale: 1, x: 0, y: 0 })
        } else {
          const shifted = focalShift(touch.clientX, touch.clientY, 1, 0, 0, 2.5)
          apply({ scale: 2.5, ...shifted })
        }
        return
      }
      lastTap.current = now
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return
      onSwipe(dx < 0 ? 1 : -1)
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault()
      const current = zoomRef.current
      const next = clamp(current.scale * Math.exp(-event.deltaY * 0.0016), MIN_SCALE, MAX_SCALE)
      const shifted = focalShift(event.clientX, event.clientY, current.scale, current.x, current.y, next)
      apply({ scale: next, ...shifted })
    }

    function onDoubleClick(event: MouseEvent) {
      if (zoomRef.current.scale > 1.05) {
        apply({ scale: 1, x: 0, y: 0 })
        return
      }
      const shifted = focalShift(event.clientX, event.clientY, 1, 0, 0, 2.5)
      apply({ scale: 2.5, ...shifted })
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd)
    el.addEventListener('touchcancel', () => {
      gesture = null
    })
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('dblclick', onDoubleClick)
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('dblclick', onDoubleClick)
    }
  }, [onSwipe])

  return (
    <div
      ref={stageRef}
      className={`media-lightbox-stage${zoom.scale > 1.02 ? ' is-zoomed' : ''}`}
    >
      <img
        className="media-lightbox-img"
        src={src}
        alt={alt}
        draggable={false}
        style={{ transform: `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.scale})` }}
      />
    </div>
  )
}

export function MediaLightbox({
  items,
  index,
  canPrev,
  canNext,
  loadingMore,
  onPrev,
  onNext,
  onClose,
}: MediaLightboxProps) {
  const item = index != null ? items[index] : null

  useEffect(() => {
    if (!item) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && canPrev) onPrev()
      if (event.key === 'ArrowRight' && canNext) onNext()
    }
    document.body.classList.add('lightbox-open')
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('lightbox-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose, onPrev, onNext, canPrev, canNext])

  if (!item || index == null) return null

  const isVideo = item.mime.startsWith('video/')
  const showNav = items.length > 1 || canNext

  return (
    <div className="media-lightbox" role="dialog" aria-modal="true" aria-label={item.name}>
      <button type="button" className="media-lightbox-close" onClick={onClose} aria-label="ปิด">
        ×
      </button>
      {showNav ? (
        <button
          type="button"
          className="media-lightbox-nav media-lightbox-nav--prev"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="รูปก่อนหน้า"
        >
          ‹
        </button>
      ) : null}
      {showNav ? (
        <button
          type="button"
          className="media-lightbox-nav media-lightbox-nav--next"
          onClick={onNext}
          disabled={!canNext || loadingMore}
          aria-label={loadingMore ? 'กำลังโหลดรูปถัดไป' : 'รูปถัดไป'}
        >
          ›
        </button>
      ) : null}
      <div className={`media-lightbox-body${showNav ? '' : ' media-lightbox-body--solo'}`}>
        {isVideo ? (
          <video key={item.id} controls playsInline src={item.viewUrl} className="media-lightbox-video" />
        ) : (
          <ZoomablePhoto
            key={item.id}
            src={item.viewUrl}
            alt={item.name}
            onSwipe={(direction) => {
              if (direction < 0 && canPrev) onPrev()
              if (direction > 0 && canNext) onNext()
            }}
          />
        )}
      </div>
      <p className="media-lightbox-count">
        {index + 1} / {items.length}
        {isVideo ? '' : ' · บีบนิ้วหรือแตะสองครั้งเพื่อซูม'}
        {loadingMore ? ' · กำลังโหลด…' : ''}
      </p>
      <div className="media-lightbox-actions">
        <a className="action primary" href={item.downloadUrl} download={item.name}>
          บันทึกลงเครื่อง
        </a>
      </div>
    </div>
  )
}
