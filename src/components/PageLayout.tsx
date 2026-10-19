import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { siteContent } from '../config/siteContent'

type PageLayoutProps = {
  title?: string
  children: ReactNode
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="layout">
      <header className="site-bar">
        <Link to="/" className="site-brand">
          {siteContent.couple}
        </Link>
        {title ? <span className="site-page-title">{title}</span> : null}
      </header>
      <main className="page">{children}</main>
      <nav className="bottom-nav" aria-label="เมนูล่าง">
        <Link to="/">หน้าแรก</Link>
        <Link to="/video">VDO</Link>
        <Link to="/photos">รูปภาพ</Link>
        <Link to="/schedule">กำหนดการ</Link>
        <Link to="/seat">โต๊ะ</Link>
        <Link to="/share">แชร์</Link>
      </nav>
    </div>
  )
}

export function ComingSoon({ message }: { message: string }) {
  return (
    <p className="coming-soon" role="status">
      {message}
    </p>
  )
}

export function ExternalButton({
  href,
  label,
  disabled,
}: {
  href: string
  label: string
  disabled?: boolean
}) {
  if (disabled || !href.trim()) {
    return (
      <span className="action disabled" aria-disabled="true">
        {label} — เร็ว ๆ นี้
      </span>
    )
  }
  return (
    <a className="action primary" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}
