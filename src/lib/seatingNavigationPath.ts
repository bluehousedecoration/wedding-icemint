import type { FloorLayoutConfig } from '../types/seating'

type Point = { x: number; y: number }

/** เส้นนำทางจากทางเข้า → ทางเดินกลาง → แถวโต๊ะ → โต๊ะ (พิกัด % บนผัง) */
export function buildNavigationWaypoints(
  tablePos: { posX: number; posY: number },
  layout: FloorLayoutConfig,
): Point[] {
  const { entrance, aisleX } = layout
  const { posX: tx, posY: ty } = tablePos
  const { x: ex, y: ey } = entrance

  return [
    { x: ex, y: ey },
    { x: aisleX, y: ey },
    { x: aisleX, y: ty },
    { x: tx, y: ty },
  ]
}

export function navigationPathD(
  tablePos: { posX: number; posY: number },
  layout: FloorLayoutConfig,
): string | null {
  const pts = buildNavigationWaypoints(tablePos, layout)
  if (pts.length < 2) return null
  const [first, ...rest] = pts
  return `M ${first.x} ${first.y} ${rest.map((p) => `L ${p.x} ${p.y}`).join(' ')}`
}
