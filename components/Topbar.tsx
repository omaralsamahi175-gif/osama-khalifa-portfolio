import { NAV } from "@/lib/layers"
import { useCairoClock } from "@/lib/clock"
import { Dot } from "./ui/Dot"
import { PixelMark } from "./ui/PixelMark"

type Props = { active: string; boot: boolean; onNavigate: (id: string) => void; onOpenMenu: () => void }

export function Topbar({ active, boot, onNavigate, onOpenMenu }: Props) {
  const clock = useCairoClock()
  return (
    <header className={`osk-topbar ${boot ? "osk-boot" : ""}`}>
      <a className="osk-brand" href="#top" aria-label="Osama Khalifa home">
        <PixelMark small />
        <span>
          OSAMA KHALIFA
          <br />
          <em>FULL STACK ENGINEER</em>
        </span>
      </a>
      <nav aria-label="Main navigation">
        {NAV.map(([id, label, key]) => (
          <a
            href={`#${id}`}
            className={active === id ? "active" : ""}
            aria-current={active === id ? "location" : undefined}
            key={id}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(id)
            }}
          >
            {active === id && <Dot />}
            {label} <kbd>[{key}]</kbd>
          </a>
        ))}
      </nav>
      <div className="osk-clock">
        <span>OSK-00 {"//"} {clock}</span>
        <span>30.04°N &nbsp;31.24°E</span>
      </div>
      <button className="osk-menu-toggle" aria-haspopup="dialog" onClick={onOpenMenu}>
        MENU [=]
      </button>
    </header>
  )
}
