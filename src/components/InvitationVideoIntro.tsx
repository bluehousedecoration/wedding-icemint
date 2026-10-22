import { useCallback, useEffect, useRef, useState } from 'react'
import { publicAssetUrl } from '../lib/assetUrl'
import { prefersReducedMotion } from '../lib/introSession'

const LOAD_TIMEOUT_MS = 20_000
const FADE_OUT_MS = 500

type InvitationVideoIntroProps = {
  videoPath: string
  onComplete: () => void
}

export function InvitationVideoIntro({ videoPath, onComplete }: InvitationVideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const completedRef = useRef(false)
  const [phase, setPhase] = useState<'loading' | 'playing' | 'exit'>('loading')
  const [isMuted, setIsMuted] = useState(false)
  const [needsTapToStart, setNeedsTapToStart] = useState(false)

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }, [onComplete])

  const exitThenFinish = useCallback(() => {
    setPhase('exit')
    window.setTimeout(finish, prefersReducedMotion() ? 0 : FADE_OUT_MS)
  }, [finish])

  const skip = useCallback(() => {
    videoRef.current?.pause()
    exitThenFinish()
  }, [exitThenFinish])

  const startPlayback = useCallback(
    async (withSound: boolean) => {
      const v = videoRef.current
      if (!v) return false
      v.muted = !withSound
      try {
        await v.play()
        setNeedsTapToStart(false)
        setIsMuted(!withSound)
        setPhase('playing')
        return true
      } catch {
        return false
      }
    },
    [],
  )

  const onTapStart = useCallback(async () => {
    if (await startPlayback(true)) return
    if (await startPlayback(false)) return
    finish()
  }, [startPlayback, finish])

  const toggleSound = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    const nextMuted = !v.muted
    v.muted = nextMuted
    setIsMuted(nextMuted)
    if (!nextMuted) {
      void v.play().catch(() => {})
    }
  }, [])

  useEffect(() => {
    document.body.classList.add('intro-active')
    return () => document.body.classList.remove('intro-active')
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) {
      finish()
      return
    }

    const v = videoRef.current
    if (!v) return

    v.muted = false

    let cancelled = false
    const timeoutId = window.setTimeout(() => {
      if (!cancelled) finish()
    }, LOAD_TIMEOUT_MS)

    const tryAutoplay = async () => {
      if (cancelled) return
      if (await startPlayback(true)) {
        window.clearTimeout(timeoutId)
        return
      }
      if (await startPlayback(false)) {
        window.clearTimeout(timeoutId)
        return
      }
      setNeedsTapToStart(true)
    }

    const onCanPlay = () => {
      void tryAutoplay()
    }
    const onEnded = () => exitThenFinish()

    if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      void tryAutoplay()
    } else {
      v.addEventListener('canplay', onCanPlay, { once: true })
    }
    v.addEventListener('ended', onEnded)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
      v.removeEventListener('canplay', onCanPlay)
      v.removeEventListener('ended', onEnded)
    }
  }, [videoPath, finish, exitThenFinish, startPlayback])

  const src = publicAssetUrl(videoPath)

  return (
    <div
      className={`intro-overlay intro-video-overlay intro-video-phase-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-label="เปิดการ์ดเชิญ"
    >
      <video
        ref={videoRef}
        className="intro-video"
        src={src}
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {phase === 'loading' && needsTapToStart ? (
        <button type="button" className="intro-video-start" onClick={() => void onTapStart()}>
          แตะเพื่อเริ่ม (พร้อมเสียง)
        </button>
      ) : null}

      {phase === 'loading' && !needsTapToStart ? (
        <p className="intro-loading-text intro-video-loading">กำลังโหลดวิดีโอ…</p>
      ) : null}

      {phase === 'playing' ? (
        <button
          type="button"
          className="intro-video-sound"
          onClick={toggleSound}
          aria-pressed={isMuted}
        >
          {isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
        </button>
      ) : null}

      <button type="button" className="intro-skip" onClick={skip}>
        ข้าม
      </button>
    </div>
  )
}
