import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { siteContent } from '../config/siteContent'

type PageLayoutProps = {
  title?: string
  contentClassName?: string
  children: ReactNode
}

function SiteMapButton() {
  const href = siteContent.venueMapUrl?.trim() ?? ''
  if (!href) {
    return (
      <span className="site-map-btn site-map-btn--disabled" aria-disabled="true">
        แผนที่
      </span>
    )
  }
  return (
    <a className="site-map-btn" href={href} target="_blank" rel="noreferrer">
      แผนที่
    </a>
  )
}

export function PageLayout({ title, contentClassName, children }: PageLayoutProps) {
  const menuLogo = siteContent.menuBarLogoUrl?.trim() ?? ''

  return (
    <div className="layout">
      <header className="site-bar">
        <Link to="/" className="site-brand">
          {menuLogo ? (
            <img
              className="site-brand-logo"
              src={menuLogo}
              alt={`${siteContent.couple} — ${siteContent.coupleFullNames}`}
              width={320}
              height={80}
              decoding="async"
            />
          ) : (
            <>
              <span className="site-brand-title">{siteContent.couple}</span>
              <span className="site-brand-date">{siteContent.headerDateLine}</span>
            </>
          )}
        </Link>
        <div className="site-bar-end">
          {title ? <span className="site-page-title">{title}</span> : null}
          <Link to="/settings" className="site-settings-btn" aria-label="ตั้งค่า">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <SiteMapButton />
        </div>
      </header>
      <main className={contentClassName ?? 'page'}>{children}</main>
      <BottomNav />
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
    const text = /เร็ว\s*ๆ\s*นี้/.test(label) ? label : `${label} — เร็ว ๆ นี้`
    return (
      <span className="action disabled" aria-disabled="true">
        {text}
      </span>
    )
  }
  return (
    <a className="action primary" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  )
}
