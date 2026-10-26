import type { PublicTablePosition } from '../types/seating'

type GuestTableMapMarkerProps = {
  table: PublicTablePosition
  isActive: boolean
  onClick: (tableNo: number) => void
}

export function GuestTableMapMarker({ table, isActive, onClick }: GuestTableMapMarkerProps) {
  return (
    <button
      type="button"
      className={`guest-table-marker${isActive ? ' guest-table-marker-active' : ''}${table.isVip ? ' guest-table-marker-vip' : ''}`}
      style={{ left: `${table.posX}%`, top: `${table.posY}%` }}
      onClick={() => onClick(table.tableNo)}
      aria-label={`โต๊ะ ${table.tableNo}`}
    >
      <span className="guest-table-marker-num">{table.tableNo}</span>
      {table.isVip ? <span className="guest-table-marker-vip-tag">VIP</span> : null}
    </button>
  )
}
