import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

/** เรนเดอร์หน้า PDF เป็น data URL (JPEG) — ใช้ใน browser เท่านั้น */
export async function renderPdfPageImages(pdfUrl: string, maxPages = 2): Promise<string[]> {
  const doc = await getDocument({ url: pdfUrl, withCredentials: false }).promise
  const out: string[] = []
  const count = Math.min(maxPages, doc.numPages)

  for (let pageNum = 1; pageNum <= count; pageNum++) {
    const page = await doc.getPage(pageNum)
    const base = page.getViewport({ scale: 1 })
    const scale = Math.min(2.5, 1400 / base.width)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)
    const ctx = canvas.getContext('2d')
    if (!ctx) continue
    await page.render({ canvasContext: ctx, viewport, canvas }).promise
    out.push(canvas.toDataURL('image/jpeg', 0.9))
  }

  return out
}
