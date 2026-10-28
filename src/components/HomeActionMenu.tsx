import { Link } from 'react-router-dom'
import { siteContent } from '../config/siteContent'

function ActionContent({ label, detail }: { label: string; detail?: string }) {
  return (
    <>
      <span className="action-title">{label}</span>
      {detail ? <span className="action-detail">{detail}</span> : null}
    </>
  )
}

export function HomeActionMenu() {
  const mapUrl = siteContent.venueMapUrl?.trim() ?? ''

  return (
    <nav className="actions" aria-label="เมนูหลัก">
      {siteContent.homeMenu.map((item) => {
        const className = `action${item.primary ? ' primary' : ''}`

        if (item.mapLink) {
          if (!mapUrl) {
            return (
              <span key={item.id} className="action disabled" aria-disabled="true">
                <ActionContent label={`${item.label} — เร็ว ๆ นี้`} detail={item.detail} />
              </span>
            )
          }
          return (
            <a key={item.id} className={className} href={mapUrl} target="_blank" rel="noreferrer">
              <ActionContent label={item.label} detail={item.detail} />
            </a>
          )
        }

        if (!item.to) return null

        return (
          <Link key={item.id} className={className} to={item.to}>
            <ActionContent label={item.label} detail={item.detail} />
          </Link>
        )
      })}
    </nav>
  )
}
