import { useState, type FormEvent, type ReactNode } from 'react'
import { isStaffUnlocked, unlockStaff } from '../lib/staffAccess'

export function StaffGate({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(() => isStaffUnlocked())
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!unlockStaff(code)) {
      setError(true)
      return
    }
    setError(false)
    setOpen(true)
  }

  if (open) return children

  return (
    <form className="staff-gate" onSubmit={onSubmit}>
      <header className="hero compact">
        <p className="eyebrow">Settings</p>
        <h1>ตั้งค่า</h1>
        <p className="sub">ส่วนนี้สำหรับเจ้าภาพและทีมงาน แขกทั่วไปใช้รหัสนี้ไม่ได้</p>
      </header>
      <label className="field-label" htmlFor="staff-code">
        รหัสเข้าส่วนตั้งค่า
      </label>
      <input
        id="staff-code"
        className="field-input"
        type="password"
        autoComplete="current-password"
        inputMode="text"
        value={code}
        onChange={(event) => {
          setCode(event.target.value)
          setError(false)
        }}
      />
      {error ? (
        <p className="status error" role="alert">
          รหัสไม่ถูกต้อง
        </p>
      ) : null}
      <button className="action primary staff-gate-submit" type="submit">
        เข้าสู่การตั้งค่า
      </button>
    </form>
  )
}
