import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { siteContent } from '../config/siteContent'
import { prefersReducedMotion } from '../lib/introSession'

const SPARKLE_POSITIONS: { x: number; y: number }[] = [
  { x: 50, y: 6 },
  { x: 82, y: 12 },
  { x: 94, y: 32 },
  { x: 90, y: 52 },
  { x: 78, y: 74 },
  { x: 58, y: 90 },
  { x: 32, y: 94 },
  { x: 14, y: 76 },
  { x: 6, y: 52 },
  { x: 10, y: 28 },
  { x: 24, y: 14 },
  { x: 38, y: 4 },
  { x: 62, y: 38 },
  { x: 42, y: 44 },
  { x: 68, y: 22 },
  { x: 20, y: 58 },
  { x: 50, y: 50 },
  { x: 72, y: 62 },
  { x: 28, y: 36 },
  { x: 85, y: 42 },
]

const MS_CURTAIN = 550
const MS_APPEAR = 750
const MS_OPEN = 900
const MS_SPARKLE = 1400
const MS_EXIT = 650

type Phase = 'loading' | 'curtain' | 'appear' | 'open' | 'sparkle' | 'exit'

type InvitationIntroProps = {
  cardUrl: string
  onComplete: () => void
}

export function InvitationIntro({ cardUrl, onComplete }: InvitationIntroProps) {
  const [phase, setPhase] = useState<Phase>('loading')
  const completedRef = useRef(false)
  const timersRef = useRef<number[]>([])

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }, [onComplete])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const skip = useCallback(() => {
    clearTimers()
    setPhase('exit')
    window.setTimeout(finish, prefersReducedMotion() ? 0 : MS_EXIT)
  }, [finish, clearTimers])

  useEffect(() => {
    document.body.classList.add('intro-active')
    return () => {
      document.body.classList.remove('intro-active')
      clearTimers()
    }
  }, [clearTimers])

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      if (prefersReducedMotion()) {
        finish()
        return
      }
      setPhase('curtain')
    }
    img.onerror = () => finish()
    img.src = cardUrl
  }, [cardUrl, finish])

  useEffect(() => {
    if (phase === 'loading') return

    clearTimers()
    const schedule = (fn: () => void, ms: number) => {
      timersRef.current.push(window.setTimeout(fn, ms))
    }

    if (phase === 'curtain') {
      schedule(() => setPhase('appear'), MS_CURTAIN)
    } else if (phase === 'appear') {
      schedule(() => setPhase('open'), MS_APPEAR)
    } else if (phase === 'open') {
      schedule(() => setPhase('sparkle'), MS_OPEN)
    } else if (phase === 'sparkle') {
      schedule(() => setPhase('exit'), MS_SPARKLE)
      schedule(finish, MS_SPARKLE + MS_EXIT)
    }

    return clearTimers
  }, [phase, finish, clearTimers])

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
      className={`intro-overlay intro-phase-root-${phase}${phase === 'exit' ? ' intro-overlay-exit' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="การ์ดเชิญ"
    >
      <div className="intro-curtain" aria-hidden="true" />
      <div className="intro-glow" aria-hidden="true" />

      <div className="intro-stage">
        <div className={`intro-card-3d intro-phase-${phase}`}>
          <div className="intro-card-wrap">
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
      </div>

      <button type="button" className="intro-skip" onClick={skip}>
        ข้าม
      </button>
    </div>
  )
}
