"use client"
import { useReducedMotion } from "framer-motion"
import { forwardRef, useEffect, useRef, useState } from "react"
import { localTime } from "@/lib/clock"
import { LAYERS, MESSAGES } from "@/lib/layers"
import { startRadar } from "@/lib/radar"
import { Dot } from "./ui/Dot"
import { Glyph } from "./ui/Glyph"
import { PixelMark } from "./ui/PixelMark"
import { Reveal } from "./ui/Reveal"
import { Strip } from "./ui/Strip"

type LogRow = { id: number; layer: number; text: string; time: string }
const ANNOUNCE_EVERY_MS = 30000
const FLASH_MS = 1500

const initialRows = (): LogRow[] => [0, 3, 2, 1, 0].map((layer, i) => ({ id: -i - 1, layer, text: MESSAGES[layer][i === 4 ? 1 : 0], time: "—" }))

function RadarLog({ github }: { github?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const lastAnnounce = useRef(0)
  const counter = useRef([0, 0, 0, 0])
  const reduced = useReducedMotion()
  const [flash, setFlash] = useState(-1)
  const [announcement, setAnnouncement] = useState("")
  const [rows, setRows] = useState<LogRow[]>(initialRows)

  // Seed rows render "—" on the server; stamp them with the visitor's clock after mount.
  useEffect(() => {
    setRows((r) => r.map((row) => ({ ...row, time: localTime() })))
  }, [])

  useEffect(() => {
    const c = canvas.current
    const el = root.current
    if (!c || !el || reduced) return
    let flashTimer = 0
    const stop = startRadar({
      canvas: c,
      root: el,
      onQuarter: (layer, quarter) => {
        setFlash(layer)
        window.clearTimeout(flashTimer)
        flashTimer = window.setTimeout(() => setFlash(-1), FLASH_MS)
        const text = MESSAGES[layer][counter.current[layer]++ % 2]
        const time = localTime()
        setRows((r) => [{ id: quarter, layer, text, time }, ...r].slice(0, 5))
        if (Date.now() - lastAnnounce.current >= ANNOUNCE_EVERY_MS) {
          lastAnnounce.current = Date.now()
          setAnnouncement(`${LAYERS[layer].name}: ${text}. OK.`)
        }
      },
    })
    return () => {
      stop()
      window.clearTimeout(flashTimer)
    }
  }, [reduced])

  return (
    <div className="osk-log-layout" ref={root}>
      <div className="osk-log-copy">
        <Reveal>
          <h2>
            Always
            <br />
            shipping<span className="osk-heading-dot">.</span>
          </h2>
          <p>Every few seconds the sweep passes a layer and logs something real I’ve built. No filler.</p>
          <div className="osk-actions">
            <a href="#work" className="osk-button">
              READ THE CASE STUDIES <span>→</span>
            </a>
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="osk-text-link">
                VIEW GITHUB ↗
              </a>
            )}
          </div>
        </Reveal>
        <div className="osk-log-table" aria-label="Engineering activity log">
          <div className="osk-log-head">
            <span>LOCAL TIME</span>
            <span>LAYER / EVENT</span>
            <span>STATE</span>
          </div>
          {rows.map((r, i) => {
            const layer = LAYERS[r.layer]
            return (
              <div className={`osk-log-row ${i === 0 ? "osk-new-row" : ""}`} key={r.id}>
                <time>{r.time}</time>
                <div>
                  <span className="osk-log-direction" style={{ color: layer.color }}>
                    {layer.dir} {layer.deg}° / {layer.name.toUpperCase()}
                  </span>
                  <span>{r.text}</span>
                </div>
                <span style={{ color: layer.color }}>
                  OK <Dot color={layer.color} />
                </span>
              </div>
            )
          })}
        </div>
        <div aria-live="polite" aria-atomic="true" className="osk-sr">
          {announcement}
        </div>
      </div>
      <div className="osk-radar">
        <div className="osk-radar-caption">
          <span>FIG. 03 — LAYER COVERAGE</span>
          <span>8.00 SEC / REV</span>
        </div>
        <div className="osk-radar-disc">
          <svg viewBox="0 0 600 600" fill="none" aria-hidden="true">
            <g stroke="currentColor" opacity=".2">
              {[55, 110, 165, 221].map((r) => (
                <circle key={r} cx="300" cy="300" r={r} />
              ))}
              <path d="M300 60v480M60 300h480M130 130l340 340M130 470l340-340" />
              {Array.from({ length: 72 }, (_, i) => {
                const a = (i * Math.PI) / 36
                const outer = i % 9 === 0 ? 246 : 238
                return <line key={i} x1={300 + Math.cos(a) * 231} y1={300 + Math.sin(a) * 231} x2={300 + Math.cos(a) * outer} y2={300 + Math.sin(a) * outer} />
              })}
            </g>
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4 - Math.PI / 2
              return (
                <text key={i} x={300 + Math.cos(a) * 268} y={304 + Math.sin(a) * 268} fill="currentColor" textAnchor="middle" fontSize="10" fontFamily="monospace">
                  {String(i * 45).padStart(3, "0")}°
                </text>
              )
            })}
            <circle cx="300" cy="300" r="4" fill="#EDEDEB" />
          </svg>
          <canvas ref={canvas} aria-hidden="true" />
          {LAYERS.map((l, i) => (
            <div key={l.name} className={`osk-radar-node osk-radar-node-${i}`} style={{ color: flash === i ? l.color : "#A4A4A0" }}>
              <Glyph index={i} />
              <span>{l.name.toUpperCase()}</span>
            </div>
          ))}
          <div className="osk-radar-center">
            <PixelMark small />
            <span>04 / 04</span>
          </div>
        </div>
        <div className="osk-radar-caption">
          <span>
            <Dot /> ALL LAYERS COVERED
          </span>
          <span>BLIND SPOTS: 0</span>
        </div>
      </div>
    </div>
  )
}

/** 03 — radar sweep + activity log. */
export const LogSection = forwardRef<HTMLElement, { github?: string }>(function LogSection({ github }, ref) {
  return (
    <section id="log" ref={ref} className="osk-section osk-live">
      <div className="osk-container">
        <Strip number="03" title="LIVE LOG · SWEEP 360° · EVERY 8 SEC" extra="OSK-00 // ALL LAYERS COVERED" />
        <RadarLog github={github} />
      </div>
    </section>
  )
})
