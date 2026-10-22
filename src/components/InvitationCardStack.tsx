import { useCallback, useRef, useState } from 'react'
import { siteContent } from '../config/siteContent'
import { publicAssetUrl } from '../lib/assetUrl'
import { prefersReducedMotion } from '../lib/introSession'

const SWIPE_PX = 50

type InvitationCardStackProps = {
  frontUrl: string | null
  backUrl: string | null
  loading?: boolean
  fallbackImagePath?: string
}

function CardFigure({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="invitation-card">
      <img src={src} alt={alt} width={800} height={1200} draggable={false} />
    </figure>
  )
}

export function InvitationCardStack({
  frontUrl,
  backUrl,
  loading,
  fallbackImagePath,
}: InvitationCardStackProps) {
  const fallback = fallbackImagePath?.trim()
    ? publicAssetUrl(fallbackImagePath)
    : ''
  const front = frontUrl ?? fallback
  const back = backUrl ?? null
  const canFlip = Boolean(back && back !== front)

  const [showBack, setShowBack] = useState(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const reduceMotion = prefersReducedMotion()

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0
    touchStartY.current = e.touches[0]?.clientY ?? 0
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!canFlip) return
      const touch = e.changedTouches[0]
      if (!touch) return
      const dx = touch.clientX - touchStartX.current
      const dy = touch.clientY - touchStartY.current
      if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return
      if (dx < 0) setShowBack(true)
      else setShowBack(false)
    },
    [canFlip],
  )

  const onHintClick = useCallback(() => {
    if (!canFlip) return
    setShowBack((v) => !v)
  }, [canFlip])

  if (loading && !front) {
    return <p className="status">กำลังโหลดการ์ดเชิญ…</p>
  }

  if (!front) return null

  const altBase = `การ์ดเชิญ ${siteContent.couple} — ${siteContent.weddingDate}`

  if (!canFlip) {
    return (
      <div className="invitation-flip-wrap">
        <CardFigure src={front} alt={`${altBase} (ด้านหน้า)`} />
      </div>
    )
  }

  return (
    <div className="invitation-flip-wrap">
      <div
        className={`invitation-card-view${showBack ? ' is-back' : ''}${reduceMotion ? ' reduce-motion' : ''}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="invitation-card-panel invitation-card-panel--front">
          <CardFigure src={front} alt={`${altBase} (ด้านหน้า)`} />
          {!showBack ? (
            <button type="button" className="invitation-flip-hint" onClick={onHintClick}>
              พลิกเพื่อดูด้านหลัง
            </button>
          ) : null}
        </div>
        <div className="invitation-card-panel invitation-card-panel--back">
          <CardFigure src={back!} alt={`${altBase} (ด้านหลัง)`} />
          {showBack ? (
            <button type="button" className="invitation-flip-hint" onClick={onHintClick}>
              พลิกกลับด้านหน้า
            </button>
          ) : null}
        </div>
      </div>
      <p className="invitation-flip-swipe-note" aria-hidden="true">
        เลื่อนนิ้วซ้าย–ขวาเพื่อพลิกการ์ด
      </p>
    </div>
  )
}
