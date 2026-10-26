import { CHAIRS_PER_TABLE, chairOffsetPercent } from '../config/weddingFloorLayout'
import type { PublicTablePosition, SeatAssignment } from '../types/seating'

function formatSeatLabel(tableNo: number, seatNo: number) {
  return `โต๊ะ:${tableNo}-ที่นั่ง${seatNo}`
}

type GuestTableDetailViewProps = {
  table: PublicTablePosition
  assignments: SeatAssignment[]
  onBack: () => void
}

export function GuestTableDetailView({
  table,
  assignments,
  onBack,
}: GuestTableDetailViewProps) {
  const slotBySeat = new Map(assignments.map((a) => [a.seatNo, a]))
  const occupied = assignments.length
  const remaining = Math.max(0, table.capacity - occupied)

  return (
    <section className="guest-table-detail" aria-label={`รายละเอียดโต๊ะ ${table.tableNo}`}>
      <div className="guest-table-detail-bar">
        <button type="button" className="guest-table-detail-back" onClick={onBack}>
          ← กลับผัง
        </button>
        <h2 className="guest-table-detail-title">
          โต๊ะ {table.tableNo}
          {table.tableName ? ` · ${table.tableName}` : ''}
        </h2>
      </div>

      <div className="guest-table-detail-visual">
        <div className="guest-table-detail-ring">
          <div
            className={`guest-table-detail-center${table.isVip ? ' guest-table-detail-center-vip' : ''}`}
          >
            <span>{table.tableNo}</span>
            <small>{remaining} ว่าง</small>
          </div>
          {Array.from({ length: CHAIRS_PER_TABLE }, (_, i) => {
            const seatNo = i + 1
            const off = chairOffsetPercent(seatNo, 38)
            const slot = slotBySeat.get(seatNo)
            return (
              <div
                key={seatNo}
                className={`guest-table-chair${slot ? ' guest-table-chair-filled' : ''}`}
                style={{
                  left: `calc(50% + ${off.x}%)`,
                  top: `calc(50% + ${off.y}%)`,
                }}
                title={slot?.displayName ?? `ที่นั่ง ${seatNo}`}
              >
                <span className="guest-table-chair-label">
                  {slot ? slot.displayName.slice(0, 8) : seatNo}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="guest-table-detail-list">
        <h3>รายชื่อที่นั่ง</h3>
        <ul>
          {Array.from({ length: table.capacity }, (_, i) => {
            const seatNo = i + 1
            const slot = slotBySeat.get(seatNo)
            return (
              <li key={seatNo}>
                <span className="guest-table-seat-id">[{formatSeatLabel(table.tableNo, seatNo)}]</span>
                <span className="guest-table-seat-name">
                  {slot ? (
                    <>
                      {slot.displayName}
                      {slot.guestSource ? (
                        <small>ที่มา: {slot.guestSource}</small>
                      ) : null}
                    </>
                  ) : (
                    'ว่าง'
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
