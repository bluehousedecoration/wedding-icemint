import { useEffect, useState } from 'react'
import { fetchMediaHealth, isMediaApiConfigured } from '../config/mediaApi'
import { isFirebaseConfigured } from '../config/uploadConfig'

export type GuestShareUploadStatus = 'loading' | 'ready' | 'oauth_pending' | 'unavailable'

/** รองรับกรณี Media API list ได้ แต่ OAuth ยังไม่ deploy — ไม่โชว์ฟอร์มที่อัปโหลดแล้วล้ม */
export function useGuestShareUploadReady(): GuestShareUploadStatus {
  const mediaApi = isMediaApiConfigured()
  const firebase = isFirebaseConfigured()

  const [resolved, setResolved] = useState<boolean | null>(() =>
    mediaApi ? null : firebase,
  )

  useEffect(() => {
    if (!mediaApi) {
      setResolved(firebase)
      return
    }

    let cancelled = false
    fetchMediaHealth()
      .then((health) => {
        if (cancelled) return
        if (health.shareUploadReady) {
          setResolved(true)
          return
        }
        setResolved(firebase)
      })
      .catch(() => {
        if (!cancelled) setResolved(firebase)
      })

    return () => {
      cancelled = true
    }
  }, [mediaApi, firebase])

  if (!mediaApi && !firebase) return 'unavailable'
  if (mediaApi && resolved === null) return 'loading'
  if (resolved) return 'ready'
  if (mediaApi) return 'oauth_pending'
  return 'unavailable'
}
