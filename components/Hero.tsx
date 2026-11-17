import type { SiteConfig } from "@/lib/types"
import { Dot } from "./ui/Dot"
import { Identity } from "./Identity"
import { Ruler } from "./Ruler"

type Props = {
  site: SiteConfig
  boot: boolean
  progress: number
  hover: number | null
  onHover: (deg: number | null) => void
  onNavigate: (id: string) => void
}

export function Hero({ site, boot, progress, hover, onHover, onNavigate }: Props) {
  return (
    <section id="top" className={`osk-hero ${boot ? "osk-boot" : ""}`}>
      <div className="osk-hero-meta">
        <span>LAYERS: 4 &nbsp; / &nbsp; DIRECTIONS: 360°</span>
        <span>
          <Dot /> STATUS: OPEN TO WORK
        </span>
      </div>
      <div className="osk-hero-content">
        <div className="osk-hero-copy">
          <span className="osk-label">{"// FRONT TO BACK. ONE ENGINEER."}</span>
          <h1>
            Built through
            <br />
            every layer<span className="osk-heading-dot">.</span>
          </h1>
          <p>I build web products end to end: the interface, the API behind it, the data under it and the AI on top. Next.js, .NET, PostgreSQL.</p>
          <div className="osk-actions">
            <a
              className="osk-button"
              href="#work"
              onClick={(e) => {
                e.preventDefault()
                onNavigate("work")
              }}
            >
              VIEW CASE STUDIES <span>→</span>
            </a>
            {site.cv ? (
              <a className="osk-button secondary" href={site.cv} download="Osama-Khalifa-CV.pdf">
                DOWNLOAD CV ↓
              </a>
            ) : (
              <a className="osk-button secondary" href={`mailto:${site.email}`}>
                OPEN A CHANNEL ↗
              </a>
            )}
          </div>
          <span className="osk-label osk-hero-note">CAIRO, EGYPT &nbsp; / &nbsp; EGYPT · KSA · REMOTE</span>
        </div>
        <Identity image={site.portrait} alt={site.portraitAlt} />
      </div>
      <Ruler progress={progress} hover={hover} onHover={onHover} />
    </section>
  )
}
