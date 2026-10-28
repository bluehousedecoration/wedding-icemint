import { FLOOR_PLAN_IMAGE } from '../config/weddingFloorLayout'
import { publicAssetUrl } from './assetUrl'

const ERP_ORIGIN = 'https://erp.bluehousedecoration.com'

/** Map ERP /wedding/* paths to guest public assets */
const ERP_TO_GUEST: Record<string, string> = {
  '/wedding/floor-plan-v3.png': '/floor-plan-v3.png',
  '/wedding/floor-plan-ava.png': '/floor-plan-ava.png',
}

export function resolveFloorPlanImageUrl(pathFromSnapshot: string): string {
  const trimmed = pathFromSnapshot?.trim() || FLOOR_PLAN_IMAGE
  const mapped = ERP_TO_GUEST[trimmed]
  if (mapped) return publicAssetUrl(mapped.replace(/^\//, ''))

  if (trimmed.startsWith('/wedding/')) {
    return `${ERP_ORIGIN}${trimmed}`
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  return publicAssetUrl(trimmed.replace(/^\//, ''))
}
