import { floorPlanConfig, getTableMarker } from '../config/floorPlan'
import { hallMeta } from '../config/hallLayout'
import { HallFloorPlan } from './HallFloorPlan'

type FloorPlanViewProps = {
  table: number
}

export function FloorPlanView({ table }: FloorPlanViewProps) {
  const { imageUrl, imageAlt } = floorPlanConfig
  const hasImage = Boolean(imageUrl.trim())
  const marker = hasImage ? getTableMarker(table) : undefined
  const useHallSvg = table >= 1 && table <= hallMeta.tableCount

  if (hasImage) {
    return (
      <section className="floor-plan" aria-label="ผังโต๊ะ">
        <p className="floor-title">ผังที่นั่ง</p>
        <div className="floor-image-wrap">
          <img className="floor-image" src={imageUrl} alt={imageAlt} />
          {marker ? (
            <span
              className="floor-marker"
              style={{
                left: `${marker.xPercent}%`,
                top: `${marker.yPercent}%`,
              }}
              aria-label={`โต๊ะ ${table}`}
            >
              {table}
            </span>
          ) : null}
        </div>
        {!marker && useHallSvg ? (
          <p className="floor-note">
            โต๊ะของคุณ: <strong>Table {table}</strong>
          </p>
        ) : null}
      </section>
    )
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
