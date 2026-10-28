import type { PublicTablePosition } from '../types/seating'

type GuestTableMapMarkerProps = {
  table: PublicTablePosition
  isActive: boolean
  onClick: (tableNo: number) => void
}

export function GuestTableMapMarker({ table, isActive, onClick }: GuestTableMapMarkerProps) {
  const tableName = table.tableName?.trim() ?? ''
  const label = tableName
    ? `โต๊ะ ${table.tableNo} ${tableName}${table.isVip ? ' VIP' : ''}`
    : `โต๊ะ ${table.tableNo}${table.isVip ? ' VIP' : ''}`

  return (
    <button
      type="button"
      className={`guest-table-marker${isActive ? ' guest-table-marker-active' : ''}${table.isVip ? ' guest-table-marker-vip' : ''}`}
      style={{ left: `${table.posX}%`, top: `${table.posY}%` }}
      onClick={() => onClick(table.tableNo)}
      aria-label={label}
      title={tableName || undefined}
    >
      {table.isVip ? (
        <span className="guest-table-marker-vip-badge" aria-hidden>
          <span className="guest-table-marker-vip-star">★</span>
          <span className="guest-table-marker-vip-label">VIP</span>
        </span>
      ) : null}
      <span className="guest-table-marker-disc">
        <span className="guest-table-marker-num">{table.tableNo}</span>
      </span>
      {tableName ? (
        <span className="guest-table-marker-plaque">{tableName}</span>
      ) : null}
    </button>
  )
}
