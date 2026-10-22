import { useEffect, useState } from 'react'
import { siteContent } from '../config/siteContent'

type Remaining = {
  days: number
  hours: number
  minutes: number
}

function getRemaining(targetIso: string): Remaining | null {
  const target = new Date(targetIso).getTime()
  if (Number.isNaN(target)) return null
  const diff = target - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return { days, hours, minutes }
}

export function WeddingCountdown() {
  const target = siteContent.countdownTarget?.trim() ?? ''
  const [remaining, setRemaining] = useState<Remaining | null>(() =>
    target ? getRemaining(target) : null,
  )

  useEffect(() => {
    if (!target) return
    setRemaining(getRemaining(target))
    const id = window.setInterval(() => setRemaining(getRemaining(target)), 60_000)
    return () => window.clearInterval(id)
  }, [target])

  if (!remaining) return null

  return (
    <section className="countdown" aria-live="polite">
      <p className="countdown-label">อีกไม่นานถึงวันงาน</p>
      <div className="countdown-grid">
        <div className="countdown-cell">
          <span className="countdown-num">{remaining.days}</span>
          <span className="countdown-unit">วัน</span>
        </div>
        <div className="countdown-cell">
          <span className="countdown-num">{remaining.hours}</span>
          <span className="countdown-unit">ชม.</span>
        </div>
        <div className="countdown-cell">
          <span className="countdown-num">{remaining.minutes}</span>
          <span className="countdown-unit">นาที</span>
        </div>
      </div>
    </section>
  )
}
