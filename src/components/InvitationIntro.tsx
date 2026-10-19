import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { siteContent } from '../config/siteContent'
import { prefersReducedMotion } from '../lib/introSession'

/** ตำแหน่งประกายรอบการ์ด (%) */
const SPARKLE_POSITIONS: { x: number; y: number }[] = [
  { x: 50, y: 8 },
  { x: 78, y: 15 },
  { x: 92, y: 35 },
  { x: 88, y: 55 },
  { x: 75, y: 72 },
  { x: 55, y: 88 },
  { x: 35, y: 92 },
  { x: 18, y: 78 },
  { x: 8, y: 55 },
  { x: 12, y: 32 },
  { x: 28, y: 18 },
  { x: 42, y: 5 },
  { x: 62, y: 42 },
  { x: 38, y: 48 },
  { x: 65, y: 28 },
  { x: 22, y: 62 },
]
const MS_APPEAR = 800
const MS_SPARKLE = 1200
const MS_EXIT = 600

type Phase = 'loading' | 'appear' | 'sparkle' | 'exit'

type InvitationIntroProps = {
  cardUrl: string
  onComplete: () => void
}

export function InvitationIntro({ cardUrl, onComplete }: InvitationIntroProps) {
  const [phase, setPhase] = useState<Phase>('loading')
  const completedRef = useRef(false)

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }, [onComplete])

  const skip = useCallback(() => {
    setPhase('exit')
    window.setTimeout(finish, prefersReducedMotion() ? 0 : MS_EXIT)
  }, [finish])

  useEffect(() => {
    document.body.classList.add('intro-active')
    return () => {
      document.body.classList.remove('intro-active')
    }
  }, [])

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      if (prefersReducedMotion()) {
        finish()
        return
      }
      setPhase('appear')
    }
    img.onerror = () => finish()
    img.src = cardUrl
  }, [cardUrl, finish])

  useEffect(() => {
    if (phase !== 'appear') return

    const t1 = window.setTimeout(() => setPhase('sparkle'), MS_APPEAR)
    const t2 = window.setTimeout(() => setPhase('exit'), MS_APPEAR + MS_SPARKLE)
    const t3 = window.setTimeout(finish, MS_APPEAR + MS_SPARKLE + MS_EXIT)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [phase, finish])

  if (phase === 'loading') {
    return (
      <div className="intro-overlay intro-overlay-loading" aria-busy="true">
        <p className="intro-loading-text">กำลังเปิดการ์ดเชิญ…</p>
      </div>
    )
  }

  const alt = `การ์ดเชิญงานแต่ง ${siteContent.couple} — ${siteContent.weddingDate}`

  return (
    <div
      className={`intro-overlay${phase === 'exit' ? ' intro-overlay-exit' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="การ์ดเชิญ"
    >
      <div className="intro-stage">
        <div className={`intro-card-wrap intro-phase-${phase}`}>
          <div className="intro-sparkles" aria-hidden="true">
            {SPARKLE_POSITIONS.map((pos, i) => (
              <span
                key={i}
                className="intro-spark"
                style={
                  {
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    '--i': i,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <img className="intro-card-img" src={cardUrl} alt={alt} width={800} height={1200} />
        </div>
      </div>

      <button type="button" className="intro-skip" onClick={skip}>
        ข้าม
      </button>
    </div>
  )
}
