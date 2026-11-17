"use client"
import { useReducedMotion } from "framer-motion"
import { forwardRef, useRef, useState } from "react"
import { LAYERS } from "@/lib/layers"
import { Dot } from "./ui/Dot"
import { Glyph } from "./ui/Glyph"
import { Reveal } from "./ui/Reveal"
import { Strip } from "./ui/Strip"

/** 01 — four layer cards; on mobile a snap-scrolling pager. */
export const StackSection = forwardRef<HTMLElement>(function StackSection(_, ref) {
  const reduced = useReducedMotion()
  const grid = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  return (
    <section id="stack" ref={ref} className="osk-section osk-light">
      <div className="osk-container">
        <Strip number="01" title="THE STACK · FOUR LAYERS, ONE VIEW" extra="OSK-01 / 02 / 03 / 04 // COVERAGE 360°" />
        <Reveal className="osk-section-intro">
          <h2>
            Frontend,
            <br />
            API, data, AI<span className="osk-heading-dot">.</span>
          </h2>
          <p>Most bugs don’t live where they show up. They live in the layer nobody owned. I work across all four, so nothing falls between them.</p>
        </Reveal>
        <div
          className="osk-stack-grid"
          ref={grid}
          onScroll={() => {
            const el = grid.current
            if (el) setPage(Math.min(3, Math.round(el.scrollLeft / (el.clientWidth * 0.82))))
          }}
        >
          {LAYERS.map((l, i) => (
            <Reveal className="osk-stack-card" key={l.name}>
              <div className="osk-card-coordinates">
                <span>
                  {l.dir} {l.deg}°
                </span>
                <span>{l.code}</span>
              </div>
              <div className="osk-glyph-scene">
                <div className="osk-glyph">
                  <Glyph index={i} />
                </div>
                <span className="osk-tag">{l.tag}</span>
                <svg viewBox="0 0 300 150" aria-hidden="true">
                  <path d="M235 30H210L177 74" />
                </svg>
                <span className="osk-plus" style={{ color: l.color }}>
                  +
                </span>
              </div>
              <span className="osk-label">{l.tech}</span>
              <h3>{l.name}</h3>
              <p>{l.copy}</p>
              <div className="osk-card-footer">
                <span>{l.metric}</span>
                <Dot color={l.color} />
              </div>
            </Reveal>
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
