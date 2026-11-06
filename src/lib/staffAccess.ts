const STORAGE_KEY = 'ice-mint-staff-ok'

/** รหัสเข้าส่วนตั้งค่าและหน้าที่แขกไม่ควรเปิดเอง */
export const STAFF_CODE = 'icemint201226'

export function isStaffUnlocked(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function unlockStaff(code: string): boolean {
  if (code.trim() !== STAFF_CODE) return false
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* private mode */
  }
  return true
}

export function lockStaff(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* private mode */
  }
}
