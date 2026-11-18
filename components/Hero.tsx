import type { SiteConfig } from "@/lib/types"
import { Dot } from "./ui/Dot"
import { Identity } from "./Identity"
import { Ruler } from "./Ruler"
import { TitleIntro } from "./ui/TitleIntro"

type Props = {
  site: SiteConfig
  progress: number
  hover: number | null
  onHover: (deg: number | null) => void
  onNavigate: (id: string) => void
}

export function Hero({ site, progress, hover, onHover, onNavigate }: Props) {
  return (
    <section id="top" className="osk-hero">
      <div className="osk-hero-meta">
        <span>LAYERS: 4 &nbsp; / &nbsp; DIRECTIONS: 360°</span>
        <span>
          <Dot /> STATUS: OPEN TO WORK
        </span>
      </div>
      <div className="osk-hero-content">
        <div className="osk-hero-copy">
          <span className="osk-label">{"// FRONT TO BACK. ONE ENGINEER."}</span>
          <TitleIntro
            as="h1"
            title="I build and ship AI-powered products"
            accent="."
            intro="From the interface to the API, the database and the AI on top. Next.js, .NET, PostgreSQL."
          />
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
        <Identity />
      </div>
      <Ruler progress={progress} hover={hover} onHover={onHover} />
    </section>
  )
}
