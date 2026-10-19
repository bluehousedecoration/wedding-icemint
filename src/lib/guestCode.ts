/** ทำให้รหัสจาก QR / การ์ด (ICE-0284) ตรงกับ id ใน JSON (ICE0284) */
export function normalizeGuestCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/-/g, '')
}

export function guestQueryParam(): string | null {
  const params = new URLSearchParams(window.location.search)
  const g = params.get('g') ?? params.get('guest')
  if (!g) return null
  const normalized = normalizeGuestCode(g)
  return normalized.length > 0 ? normalized : null
}

/** URL สำหรับพิมพ์ QR — เปลี่ยนแค่ origin/base เมื่อ deploy */
export function guestInviteUrl(guestId: string, siteOrigin = window.location.origin): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const path = base === '' ? '/' : base
  return `${siteOrigin}${path}?g=${encodeURIComponent(guestId)}`
}
