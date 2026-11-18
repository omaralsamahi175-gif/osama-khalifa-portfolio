import { LAYERS } from "@/lib/layers"
import { Glyph } from "./ui/Glyph"

type Props = { progress: number; hover: number | null; onHover: (deg: number | null) => void }

/** Layer chips + 0–360° ruler whose red marker tracks page scroll (or the hovered layer). */
export function Ruler({ progress, onHover, hover }: Props) {
  const value = hover ?? progress * 360
  return (
    <div className="osk-layer-strip">
      <div className="osk-chips">
        {LAYERS.map((l, i) => (
          <a
            key={l.name}
            href="#stack"
            onMouseEnter={() => onHover(i * 90)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(i * 90)}
            onBlur={() => onHover(null)}
          >
            <span style={{ color: l.color }}>
              <Glyph index={i} />
            </span>
            <span>
              {l.dir} {l.deg}° &nbsp;{l.name.toUpperCase()}
            </span>
            <span className="osk-chip-plus">+</span>
          </a>
        ))}
      </div>
      <div className="osk-ruler" aria-label={`Page progress ${Math.round(progress * 100)} percent`}>
        <div className="osk-ruler-ticks">
          {Array.from({ length: 37 }, (_, i) => (
            <i key={i} className={i % 9 === 0 ? "major" : ""}>
              {i % 9 === 0 && <span>{String(i * 10).padStart(3, "0")}°</span>}
            </i>
          ))}
        </div>
        <div className="osk-ruler-marker" data-edge={value >= 330 ? "end" : value <= 30 ? "start" : undefined}
          style={{ left: `clamp(3px, ${(value / 360) * 100}%, 100% - 3px)` }}>
          <span>{String(Math.round(value)).padStart(3, "0")}°</span>
        </div>
      </div>
    </div>
  )
}
