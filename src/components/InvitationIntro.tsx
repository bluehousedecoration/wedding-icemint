import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { siteContent } from '../config/siteContent'
import { publicAssetUrl } from '../lib/assetUrl'
import { prefersReducedMotion } from '../lib/introSession'

const LOAD_TIMEOUT_MS = 12_000
const BUTTERFLY_COUNT = 32

const MS_CLOSED = 700
const MS_OPEN = 1100
const MS_BURST = 2400
const MS_EXIT = 650

type Phase = 'loading' | 'closed' | 'open' | 'burst' | 'exit'

type InvitationIntroProps = {
  cardUrl: string
  onComplete: () => void
}

type ButterflySpec = {
  tx: string
  ty: string
  rot: string
  scale: number
  size: number
  delay: number
}

function buildButterflies(count: number): ButterflySpec[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + ((i * 17) % 11) * 0.22
    const dist = 36 + (i % 7) * 11
    const tx = Math.cos(angle) * dist
    const ty = Math.sin(angle) * dist - 8
    return {
      tx: `${tx.toFixed(1)}vmin`,
      ty: `${ty.toFixed(1)}vmin`,
      rot: `${((angle * 180) / Math.PI + (i % 2 ? 40 : -25)).toFixed(0)}deg`,
      scale: 0.65 + (i % 5) * 0.12,
      size: 12 + (i % 6) * 3,
      delay: (i % 12) * 0.045,
    }
  })
}

export function InvitationIntro({ cardUrl, onComplete }: InvitationIntroProps) {
  const [phase, setPhase] = useState<Phase>('loading')
  const completedRef = useRef(false)
  const timersRef = useRef<number[]>([])
  const butterflies = useMemo(() => buildButterflies(BUTTERFLY_COUNT), [])

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
    const resolved = publicAssetUrl(cardUrl)
    const img = new Image()
    let settled = false

    const bail = () => {
      if (settled) return
      settled = true
      finish()
    }

    const timeoutId = window.setTimeout(bail, LOAD_TIMEOUT_MS)

    img.onload = () => {
      window.clearTimeout(timeoutId)
      if (settled) return
      if (img.naturalWidth < 16) {
        bail()
        return
      }
      settled = true
      if (prefersReducedMotion()) {
        finish()
        return
      }
      setPhase('closed')
    }
    img.onerror = () => {
      window.clearTimeout(timeoutId)
      bail()
    }
    img.src = resolved

    return () => {
      window.clearTimeout(timeoutId)
      settled = true
    }
  }, [cardUrl, finish])

  useEffect(() => {
    if (phase === 'loading') return

    clearTimers()
    const schedule = (fn: () => void, ms: number) => {
      timersRef.current.push(window.setTimeout(fn, ms))
    }

    if (phase === 'closed') {
      schedule(() => setPhase('open'), MS_CLOSED)
    } else if (phase === 'open') {
      schedule(() => setPhase('burst'), MS_OPEN)
    } else if (phase === 'burst') {
      schedule(() => setPhase('exit'), MS_BURST)
      schedule(finish, MS_BURST + MS_EXIT)
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
  const resolvedUrl = publicAssetUrl(cardUrl)
  const rootClass = `intro-overlay intro-phase-root-${phase}${phase === 'exit' ? ' intro-overlay-exit' : ''}`

  return (
    <div className={rootClass} role="dialog" aria-modal="true" aria-label="การ์ดเชิญ">
      <div className="intro-curtain" aria-hidden="true" />
      <div className="intro-glow" aria-hidden="true" />

      <div className="intro-butterfly-field" aria-hidden="true">
        {butterflies.map((bf, i) => (
          <span
            key={i}
            className="intro-butterfly"
            style={
              {
                '--tx': bf.tx,
                '--ty': bf.ty,
                '--rot': bf.rot,
                '--scale': bf.scale,
                '--bf-size': `${bf.size}px`,
                '--delay': `${bf.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="intro-stage">
        <div className={`intro-book intro-book-phase-${phase}`}>
          <div className="intro-book-inner-light" aria-hidden="true" />
          <div className="intro-book-covers">
            <div className="intro-book-cover intro-book-cover--left">
              <div className="intro-book-cover-face">
                <img src={resolvedUrl} alt="" draggable={false} aria-hidden="true" />
              </div>
            </div>
            <div className="intro-book-cover intro-book-cover--right">
              <div className="intro-book-cover-face">
                <img src={resolvedUrl} alt="" draggable={false} aria-hidden="true" />
              </div>
            </div>
          </div>
          <div
            className={`intro-book-whole${phase === 'closed' ? '' : ' intro-book-whole--hide'}`}
            aria-hidden="true"
          >
            <img src={resolvedUrl} alt="" draggable={false} />
          </div>
          <p className="visually-hidden">{alt}</p>
        </div>
      </div>

      <button type="button" className="intro-skip" onClick={skip}>
        ข้าม
      </button>
    </div>
  )
}
