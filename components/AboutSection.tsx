import { forwardRef } from "react"
import type { SiteConfig } from "@/lib/types"
import { Dot } from "./ui/Dot"
import { Identity } from "./Identity"
import { Reveal } from "./ui/Reveal"
import { Strip } from "./ui/Strip"

const TIMELINE = [
  ["2026.07", "BUILDMETRICS AI", "FULL STACK / CONTRACT"],
  ["2026.01", "ZAWRAQ", "FULL STACK"],
  ["2024.10", "B.SC. COMPUTER SCIENCE", "TANTA UNIVERSITY"],
  ["2022.12", "DADBOD", "FRONTEND / FREELANCE"],
]

export const AboutSection = forwardRef<HTMLElement, { site: SiteConfig }>(function AboutSection({ site }, ref) {
  return (
    <section id="about" ref={ref} className="osk-section osk-about">
      <div className="osk-container">
        <Strip number="05" title="ABOUT · OPERATOR" extra="CAIRO, EGYPT / 30.04° N 31.24° E" />
        <div className="osk-about-layout">
          <Reveal>
            <Identity image={site.portrait} alt={site.portraitAlt} sharp />
            <div className="osk-about-id">
              <Dot /> OSAMA KHALIFA / FULL STACK ENGINEER
            </div>
          </Reveal>
          <Reveal>
            <h2>
              One engineer.
              <br />
              The whole picture<span className="osk-heading-dot">.</span>
            </h2>
            <p>
              I’m Osama, a full stack engineer in Cairo. Computer Science at Tanta University, two years shipping production web apps. I like the unglamorous parts: data models, auth flows, the query that makes a page fast. Currently building at Zawraq and on BuildMetrics AI.
            </p>
            <div className="osk-timeline">
              {TIMELINE.map(([date, name, role]) => (
                <div key={name}>
                  <time>{date}</time>
                  <span>
                    {name}
                    <small>{role}</small>
                  </span>
                  <span aria-hidden="true">+</span>
                </div>
              ))}
            </div>
            <span className="osk-label">
              MILITARY SERVICE: COMPLETED
              <br />
              AVAILABLE: EGYPT / KSA / REMOTE
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  )
})
