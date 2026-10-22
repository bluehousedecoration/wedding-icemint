import { useEffect, useState } from 'react'
import { siteContent } from '../config/siteContent'
import { publicAssetUrl } from '../lib/assetUrl'
import { renderPdfPageImages } from '../lib/renderInvitationPdf'

export function useInvitationPdf(pdfPath: string | undefined) {
  const [frontUrl, setFrontUrl] = useState<string | null>(null)
  const [backUrl, setBackUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(Boolean(pdfPath?.trim()))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const path = pdfPath?.trim()
    if (!path) {
      setFrontUrl(null)
      setBackUrl(null)
      setLoading(false)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    const frontPage = Math.max(1, siteContent.invitationPdfFrontPage ?? 1)
    const backPage = Math.max(1, siteContent.invitationPdfBackPage ?? 2)
    const maxPages = Math.max(frontPage, backPage)

    renderPdfPageImages(publicAssetUrl(path), maxPages)
      .then((pages) => {
        if (cancelled) return
        setFrontUrl(pages[frontPage - 1] ?? null)
        setBackUrl(pages[backPage - 1] ?? null)
      })
      .catch(() => {
        if (!cancelled) {
          setError('pdf_load_failed')
          setFrontUrl(null)
          setBackUrl(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [pdfPath])

  return { frontUrl, backUrl, loading, error }
}
