import { hallMeta, hallTables } from '../config/hallLayout'

type HallFloorPlanProps = {
  activeTable: number
}

export function HallFloorPlan({ activeTable }: HallFloorPlanProps) {
  return (
    <section className="floor-plan" aria-label="ผังโต๊ะ">
      <p className="floor-title">ผังที่นั่ง (40 โต๊ะ · AVA)</p>
      <div className="hall-plan-wrap">
        <svg
          className="hall-plan-svg"
          viewBox="0 0 100 145"
          role="img"
          aria-label={`ผังห้อง โต๊ะของคุณคือ ${activeTable}`}
        >
          <defs>
            <linearGradient id="hallFloor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#faf6f0" />
              <stop offset="100%" stopColor="#f3ebe3" />
            </linearGradient>
          </defs>

          <rect x="8" y="10" width="84" height="128" rx="2" fill="url(#hallFloor)" stroke="#d7c9bd" strokeWidth="0.6" />

          {/* Stage */}
          <path
            d="M 28 14 Q 50 8 72 14 L 68 22 Q 50 18 32 22 Z"
            fill="#e0ba85"
            stroke="#2a4872"
            strokeWidth="0.4"
            opacity="0.85"
          />
          <text x="50" y="19" textAnchor="middle" className="hall-label">
            STAGE
          </text>

          {/* Aisle */}
          <rect x="46" y="22" width="8" height="108" fill="#fffcf8" opacity="0.7" />

          {/* Bar area hint */}
          <text x="14" y="138" className="hall-label-sm">
            Bar+Food
          </text>

          {Object.entries(hallTables).map(([num, pos]) => {
            const n = Number(num)
            const isActive = n === activeTable
            const isVip = pos.vip
            return (
              <g key={n}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 3.2 : 2.6}
                  className={`hall-table${isActive ? ' hall-table-active' : ''}${isVip ? ' hall-table-vip' : ''}`}
                />
                <text x={pos.x} y={pos.y + 0.9} textAnchor="middle" className="hall-table-num">
                  {n}
                </text>
                {isVip ? (
                  <text x={pos.x} y={pos.y - 3.8} textAnchor="middle" className="hall-vip-tag">
                    VIP
                  </text>
                ) : null}
              </g>
            )
          })}
        </svg>
      </div>
      <p className="floor-note">
        โต๊ะของคุณ: <strong>Table {activeTable}</strong>
        {hallMeta.vipTables.includes(activeTable) ? ' · VIP' : ''}
      </p>
    </section>
  )
}
