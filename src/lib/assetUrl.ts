/** ไฟล์ใน public/ — รองรับ base path ของ GitHub Pages / โดเมน */
export function publicAssetUrl(pathFromRoot: string): string {
  const trimmed = pathFromRoot.trim()
  if (!trimmed) return ''
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  const path = trimmed.replace(/^\//, '')
  return `${base}${path}`
}
