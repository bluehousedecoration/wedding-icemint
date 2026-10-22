import { useCallback, useEffect, useState } from 'react'
import { siteContent } from '../config/siteContent'
import {
  fetchMediaList,
  isMediaApiConfigured,
  type MediaAlbumKey,
  type MediaListItem,
} from '../config/mediaApi'
import { getDemoMediaItems } from '../lib/demoMediaAlbum'

function useDemoMode(): boolean {
  return (
    siteContent.mediaDemoUntilDriveReady !== false && !isMediaApiConfigured()
  )
}

export function useMediaAlbum(albumKey: MediaAlbumKey | undefined, pageSize = 10) {
  const demoMode = useDemoMode()
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<MediaListItem[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const enabled = Boolean(albumKey) && (isMediaApiConfigured() || demoMode)

  const loadPage = useCallback(
    async (pageNum: number, append: boolean) => {
      if (!albumKey) return

      if (demoMode) {
        if (append) return
        setLoading(true)
        setError(null)
        setItems(getDemoMediaItems(albumKey))
        setHasMore(false)
        setPage(1)
        setLoading(false)
        return
      }

      if (!isMediaApiConfigured()) return
      if (append) setLoadingMore(true)
      else setLoading(true)
      setError(null)
      try {
        const data = await fetchMediaList(albumKey, pageNum, pageSize)
        setItems((prev) => (append ? [...prev, ...data.items] : data.items))
        setHasMore(data.hasMore)
        setPage(pageNum)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'โหลดไม่สำเร็จ')
        if (!append) setItems([])
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [albumKey, pageSize, demoMode],
  )

  useEffect(() => {
    if (!enabled) {
      setItems([])
      setError(null)
      return
    }
    void loadPage(1, false)
  }, [enabled, albumKey, loadPage, demoMode])

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return
    void loadPage(page + 1, true)
  }, [hasMore, loading, loadingMore, loadPage, page])

  return { items, loading, loadingMore, error, hasMore, loadMore, enabled, demoMode }
}
