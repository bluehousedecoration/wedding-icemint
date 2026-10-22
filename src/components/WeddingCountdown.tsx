import { useEffect, useState } from 'react'
import { siteContent } from '../config/siteContent'

type Remaining = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getRemaining(targetIso: string): Remaining | null {
  const target = new Date(targetIso).getTime()
  if (Number.isNaN(target)) return null
  const diff = target - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

const SEGMENTS: {
  key: keyof Remaining
  label: string
  format: (n: number) => string
}[] = [
  { key: 'days', label: 'วัน', format: (n) => String(n) },
  { key: 'hours', label: 'ชม.', format: pad2 },
  { key: 'minutes', label: 'นาที', format: pad2 },
  { key: 'seconds', label: 'วิ', format: pad2 },
]

export function WeddingCountdown() {
  const target = siteContent.countdownTarget?.trim() ?? ''
  const [remaining, setRemaining] = useState<Remaining | null>(() =>
    target ? getRemaining(target) : null,
  )

  useEffect(() => {
    if (!target) return
    const tick = () => setRemaining(getRemaining(target))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [target])

  if (!remaining) return null

  return (
    <section className="countdown" aria-live="polite">
      <p className="countdown-label">อีกไม่นานถึงวันงาน</p>
      <div className="countdown-grid">
        {SEGMENTS.map(({ key, label, format }) => (
          <div key={key} className="countdown-cell">
            <span className="countdown-num">{format(remaining[key])}</span>
            <span className="countdown-unit">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
