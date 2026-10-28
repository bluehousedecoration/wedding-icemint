import { useMemo, useState } from 'react'
import { navigationPathD } from '../lib/seatingNavigationPath'
import { assignmentsForTable } from '../lib/seatingSnapshot'
import type { PublicSeatingSnapshot } from '../types/seating'
import { GuestFloorPlanCanvas } from './GuestFloorPlanCanvas'
import { GuestTableDetailView } from './GuestTableDetailView'
import { GuestTableMapMarker } from './GuestTableMapMarker'

type GuestInteractiveFloorPlanProps = {
  snapshot: PublicSeatingSnapshot
  highlightTableNo: number | null
  showNavigation?: boolean
}

export function GuestInteractiveFloorPlan({
  snapshot,
  highlightTableNo,
  showNavigation = true,
}: GuestInteractiveFloorPlanProps) {
  const [detailTableNo, setDetailTableNo] = useState<number | null>(null)

  const pathD = useMemo(() => {
    if (!showNavigation || !highlightTableNo || detailTableNo) return null
    const pos = snapshot.tables.find((t) => t.tableNo === highlightTableNo)
    if (!pos) return null
    return navigationPathD({ posX: pos.posX, posY: pos.posY }, snapshot.layout)
  }, [showNavigation, highlightTableNo, detailTableNo, snapshot])

  if (detailTableNo) {
    const table = snapshot.tables.find((t) => t.tableNo === detailTableNo)
    if (table) {
      return (
        <GuestTableDetailView
          table={table}
          assignments={assignmentsForTable(snapshot, detailTableNo)}
          onBack={() => setDetailTableNo(null)}
        />
      )
    }
  }

  return (
    <section className="floor-plan" aria-label="ผังโต๊ะ">
      <p className="floor-title">ผังที่นั่ง</p>
      {pathD ? (
        <p className="floor-nav-hint">เส้นสีแดงนำทางจากทางเข้า · แตะโต๊ะเพื่อดูที่นั่งในโต๊ะ</p>
      ) : highlightTableNo ? (
        <p className="floor-nav-hint">แตะโต๊ะเพื่อดูที่นั่งในโต๊ะ</p>
      ) : (
        <p className="floor-nav-hint">เลือกชื่อจากช่องค้นหา — เส้นแดงจะชี้ไปโต๊ะของคุณ · แตะโต๊ะดูรายชื่อ</p>
      )}
      <div className="wedding-floor-wrap">
        <GuestFloorPlanCanvas imagePath={snapshot.layout.floorPlanImage}>
          {pathD ? (
            <svg
              className="guest-floor-nav-svg"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path d={pathD} className="seat-nav-path seat-nav-path-glow" />
              <path d={pathD} className="seat-nav-path" />
            </svg>
          ) : null}
          {snapshot.tables.map((t) => (
            <GuestTableMapMarker
              key={t.tableNo}
              table={t}
              isActive={highlightTableNo === t.tableNo}
              onClick={setDetailTableNo}
            />
          ))}
        </GuestFloorPlanCanvas>
      </div>
      {highlightTableNo ? (
        <p className="floor-note">
          โต๊ะของคุณ: <strong>Table {highlightTableNo}</strong>
        </p>
      ) : null}
    </section>
  )
}
