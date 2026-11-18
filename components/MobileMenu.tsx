import { NAV } from "@/lib/layers"
import { PixelMark } from "./ui/PixelMark"

type Props = { onClose: () => void; onNavigate?: (id: string) => void }

export function MobileMenu({ onClose, onNavigate }: Props) {
  return (
    <div className="osk-mobile-menu">
      <div>
        <PixelMark small />
        <button onClick={onClose}>CLOSE [ESC] ×</button>
      </div>
      <nav aria-label="Mobile navigation">
        {NAV.map(([id, label, key]) => (
          <a
            key={id}
            href={`${onNavigate ? "" : "/"}#${id}`}
            onClick={(e) => {
              if (!onNavigate || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
              e.preventDefault()
              onNavigate(id)
            }}
          >
            <span>0{key} /</span>
            {label}
            <span>↗</span>
          </a>
        ))}
      </nav>
      <span className="osk-label">OSAMA KHALIFA / FOUR LAYERS, ONE ENGINEER</span>
    </div>
  )
}
