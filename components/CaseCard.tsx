"use client"
import Image from "next/image"
import { MatrixCard, MatrixCopy, MatrixText } from "./ui/MatrixCard"
import { useState, type MouseEvent } from "react"
import { CARD_COLORS } from "@/lib/layers"
import type { CaseAsset, CaseMeta } from "@/lib/types"

const MAP_LABELS = [
  ["APP ROUTER", "API BOUNDARY", "SERVER DATA"],
  ["COURSES", "RETRIEVAL", "GROUNDED AI"],
  ["INPUTS", "TDEE", "DIET PLAN"],
  ["CASHIER", "INVENTORY", "DASHBOARD"],
]

type Props = {
  file: CaseMeta
  index: number
  asset?: CaseAsset
  featured?: boolean
  /** Return true when the overlay handled the click (desktop); otherwise the link navigates. */
  onOpen: (slug: string) => boolean
}

export function CaseCard({ file, index, asset, featured = false, onOpen }: Props) {
  const [intent, setIntent] = useState(false)
  const [ready, setReady] = useState(false)
  const { slug, title, summary, meta, number } = file
  const screen = asset?.screens[0]
  const image = screen?.image
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (onOpen(slug)) e.preventDefault()
  }
  return (
    <MatrixCard className={`osk-case-card ${featured ? "osk-case-featured" : ""}`} color={CARD_COLORS[index]} layoutId={`osk-case-${slug}`}>
      <a href={`/work/${slug}`} onClick={click} onPointerEnter={() => setIntent(true)} onFocus={() => setIntent(true)} aria-label={`Read ${title} case study`}>
        <div className="case-visual">
          {image ? (
            <>
              <Image src={image.silver.src} width={image.silver.width} height={image.silver.height} unoptimized alt={screen?.alt || `${title} product interface`} />
              {intent && (
                <Image
                  className={`case-color ${ready ? "ready" : ""}`}
                  src={image.color.src}
                  width={image.color.width}
                  height={image.color.height}
                  sizes={featured ? "(max-width: 767px) 100vw, 55vw" : "(max-width: 767px) 100vw, 33vw"}
                  alt=""
                  onLoad={() => setReady(true)}
                />
              )}
            </>
          ) : (
            <>
              <div className="case-map-caption">
                <span><MatrixText text={`FIG. ${number} / SYSTEM MAP`} /></span>
                <span><MatrixText text={`OSK—0${index + 1}`} delay={640} /></span>
              </div>
              <div className="case-diagram">
                {MAP_LABELS[index].map((label, i) => (
                  <div key={label}>
                    <small>0{i + 1} /</small>
                    <div className="case-diagram-code" />
                    {label}
                    <i style={{ background: CARD_COLORS[(i + index) % 4] }} />
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="case-scanline" />
        </div>
        <div className="case-body">
          <span className="case-meta">
            <MatrixText text={`CASE ${number} · ${meta}`} delay={650} />
          </span>
          <h3><MatrixText text={title} title delay={675} /></h3>
          <MatrixCopy text={summary} />
          <div className="case-metrics">
            {file.cardMetrics.map((m) => (
              <span key={m}><MatrixText text={m} delay={995} /></span>
            ))}
          </div>
          <div className="case-open">
            <span><MatrixText text="OPEN CASE FILE" delay={1040} /></span>
            <b aria-hidden="true">→</b>
          </div>
        </div>
      </a>
    </MatrixCard>
  )
}
