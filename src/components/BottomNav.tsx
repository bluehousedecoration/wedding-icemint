import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type NavItem = {
  to: string
  label: string
  end?: boolean
  icon: ReactNode
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" />
    </svg>
  )
}

function IconPhotos() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect
        x="4"
        y="6"
        width="16"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="9" cy="11" r="1.5" fill="currentColor" />
      <path
        d="M4 16l4.5-4 3 2.5L14 12l6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconEntrance() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M6 20V9.5a6 6 0 0 1 12 0V20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 20v-5.5a2 2 0 0 1 4 0V20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect
        x="4"
        y="5"
        width="16"
        height="16"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M4 10h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconSeat() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="8" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 20v-2a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconBlessing() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 19s-6.5-4.1-6.5-8.2A3.4 3.4 0 0 1 12 8.2a3.4 3.4 0 0 1 6.5 2.6C18.5 14.9 12 19 12 19Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconShare() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 5v10M8 9l4-4 4 4M6 19h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const items: NavItem[] = [
  { to: '/', label: 'หน้าแรก', end: true, icon: <IconHome /> },
  { to: '/video', label: 'VDO', icon: <IconPlay /> },
  { to: '/photos', label: 'รูปภาพ', icon: <IconPhotos /> },
  { to: '/backdrop', label: 'ทางเข้า', icon: <IconEntrance /> },
  { to: '/schedule', label: 'กำหนดการ', icon: <IconCalendar /> },
  { to: '/seat', label: 'โต๊ะ', icon: <IconSeat /> },
  { to: '/share', label: 'แชร์', icon: <IconShare /> },
  { to: '/blessing', label: 'อวยพร', icon: <IconBlessing /> },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="เมนูล่าง">
      <div className="bottom-nav-inner">
        {items.map(({ to, label, end, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `bottom-nav-link${isActive ? ' is-active' : ''}`}
          >
            <span className="bottom-nav-icon">{icon}</span>
            <span className="bottom-nav-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
