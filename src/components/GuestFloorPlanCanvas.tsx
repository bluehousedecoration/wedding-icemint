import { useCallback, useState, type ReactNode } from 'react'
import { FLOOR_PLAN_ASPECT } from '../config/weddingFloorLayout'
import { resolveFloorPlanImageUrl } from '../lib/floorPlanImageUrl'

type GuestFloorPlanCanvasProps = {
  imagePath: string
  children?: ReactNode
  innerRef?: React.RefObject<HTMLDivElement | null>
  onAspectRatio?: (ratio: number) => void
}

export function GuestFloorPlanCanvas({
  imagePath,
  children,
  innerRef,
  onAspectRatio,
}: GuestFloorPlanCanvasProps) {
  const src = resolveFloorPlanImageUrl(imagePath)
  const [aspectRatio, setAspectRatio] = useState(FLOOR_PLAN_ASPECT)

  const onLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        const ratio = img.naturalWidth / img.naturalHeight
        setAspectRatio(ratio)
        onAspectRatio?.(ratio)
      }
    },
    [onAspectRatio],
  )

  return (
    <div className="guest-floor-canvas">
      <div
        ref={innerRef}
        className="guest-floor-canvas-inner"
        style={{ aspectRatio: String(aspectRatio) }}
      >
        <img
          className="guest-floor-canvas-img"
          src={src}
          alt="ผังจัดโต๊ะ"
          draggable={false}
          onLoad={onLoad}
        />
        <div className="guest-floor-canvas-layer">{children}</div>
      </div>
    </div>
  )
}
