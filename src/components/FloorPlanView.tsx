import { hallMeta } from '../config/hallLayout'
import { getFloorTablePosition } from '../config/weddingFloorLayout'
import type { PublicSeatingSnapshot } from '../types/seating'
import { GuestInteractiveFloorPlan } from './GuestInteractiveFloorPlan'
import { HallFloorPlan } from './HallFloorPlan'

type FloorPlanViewProps = {
  table: number
  snapshot: PublicSeatingSnapshot
}

export function FloorPlanView({ table, snapshot }: FloorPlanViewProps) {
  const hasLiveTables = snapshot.tables.length > 0
  const useHallSvg = table >= 1 && table <= hallMeta.tableCount

  if (hasLiveTables) {
    return (
      <GuestInteractiveFloorPlan
        snapshot={snapshot}
        highlightTableNo={table}
        showNavigation
      />
    )
  }

  if (useHallSvg && getFloorTablePosition(table)) {
    return <HallFloorPlan activeTable={table} />
  }

  if (useHallSvg) {
    return <HallFloorPlan activeTable={table} />
  }

  return (
    <section className="floor-plan" aria-label="ผังโต๊ะ">
      <p className="floor-title">ผังโต๊ะ</p>
      <p className="floor-note">ไม่พบหมายเลขโต๊ะในผัง — ติดต่อเจ้าภาพ</p>
    </section>
  )
}
