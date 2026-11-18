"use client"
import { useReducedMotion } from "framer-motion"
import { forwardRef, useRef, useState } from "react"
import { LAYERS } from "@/lib/layers"
import { Dot } from "./ui/Dot"
import { Glyph } from "./ui/Glyph"
import { MatrixCard, MatrixCopy, MatrixText } from "./ui/MatrixCard"
import { Strip } from "./ui/Strip"
import { TitleIntro } from "./ui/TitleIntro"

/** 01 — four layer cards; on mobile a snap-scrolling pager. */
export const StackSection = forwardRef<HTMLElement>(function StackSection(_, ref) {
  const reduced = useReducedMotion()
  const grid = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  return (
    <section id="stack" ref={ref} className="osk-section osk-light">
      <div className="osk-container">
        <Strip number="01" title="THE STACK · FOUR LAYERS, ONE VIEW" extra="OSK-01 / 02 / 03 / 04 // COVERAGE 360°" />
        <div className="osk-section-intro">
          <TitleIntro
            title={"Frontend,\nAPI, data, AI"}
            accent="."
            intro="Most bugs don’t live where they show up. They live in the layer nobody owned. I work across all four, so nothing falls between them."
          />
        </div>
        <div
          className="osk-stack-grid"
          ref={grid}
          onScroll={() => {
            const el = grid.current
            if (el) setPage(Math.min(3, Math.round(el.scrollLeft / (el.clientWidth * 0.82))))
          }}
        >
          {LAYERS.map((l, i) => (
            <MatrixCard className="osk-stack-card" color={l.color} key={l.name}>
              <div className="osk-card-coordinates">
                <MatrixText text={`${l.dir} ${l.deg}°`} />
                <MatrixText text={l.code} delay={640} />
              </div>
              <div className="osk-glyph-scene">
                <div className="osk-glyph">
                  <Glyph index={i} />
                </div>
                <span className="osk-tag"><MatrixText text={l.tag} delay={1040} /></span>
                <svg viewBox="0 0 300 150" aria-hidden="true">
                  <path d="M235 30H210L177 74" />
                </svg>
                <span className="osk-plus" style={{ color: l.color }}>
                  +
                </span>
              </div>
              <span className="osk-label"><MatrixText text={l.tech} delay={690} /></span>
              <h3><MatrixText text={l.name} delay={675} title /></h3>
              <MatrixCopy text={l.copy} />
              <div className="osk-card-footer">
                <MatrixText text={l.metric} delay={995} />
                <Dot color={l.color} />
              </div>
            </MatrixCard>
          ))}
        </div>
        <div className="osk-stack-pager" aria-label="Stack layer pager">
          {LAYERS.map((l, i) => (
            <button
              key={l.dir}
              aria-label={`Show ${l.name} layer`}
              aria-current={page === i ? "true" : undefined}
              onClick={() => {
                setPage(i)
                const el = grid.current
                if (el) el.scrollTo({ left: el.clientWidth * 0.82 * i, behavior: reduced ? "auto" : "smooth" })
              }}
            >
              {l.deg}°<i style={{ background: page === i ? l.color : undefined }} />
            </button>
          ))}
        </div>
        <div className="osk-stack-foot">
          <span>ONE ENGINEER / FOUR DIRECTIONS</span>
          <span>NO LAYER LEFT UNOWNED ↗</span>
        </div>
      </div>
    </section>
  )
})
