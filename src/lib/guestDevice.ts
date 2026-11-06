const STORAGE_KEY = 'ice-mint-guest-device'

const DEVICE_KEY = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** รหัสประจำเครื่องในเบราว์เซอร์ ไม่ต้องสมัครสมาชิก */
export function getGuestDeviceKey(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY)?.trim().toLowerCase() ?? ''
    if (DEVICE_KEY.test(existing)) return existing
    const created = crypto.randomUUID().toLowerCase()
    localStorage.setItem(STORAGE_KEY, created)
    return created
  } catch {
    return crypto.randomUUID().toLowerCase()
  }
}
