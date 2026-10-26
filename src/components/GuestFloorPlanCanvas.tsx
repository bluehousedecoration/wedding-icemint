import type { ReactNode } from 'react'
import { FLOOR_PLAN_ASPECT } from '../config/weddingFloorLayout'
import { publicAssetUrl } from '../lib/assetUrl'

type GuestFloorPlanCanvasProps = {
  imagePath: string
  children?: ReactNode
}

export function GuestFloorPlanCanvas({ imagePath, children }: GuestFloorPlanCanvasProps) {
  const src = publicAssetUrl(imagePath.replace(/^\//, ''))

  return (
    <div className="guest-floor-canvas">
      <div
        className="guest-floor-canvas-inner"
        style={{ aspectRatio: String(FLOOR_PLAN_ASPECT) }}
      >
        <img className="guest-floor-canvas-img" src={src} alt="ผังจัดโต๊ะ" draggable={false} />
        <div className="guest-floor-canvas-layer">{children}</div>
      </div>
    </div>
  )
}
