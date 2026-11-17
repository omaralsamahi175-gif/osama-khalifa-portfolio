"use client"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, type ReactNode } from "react"
import { EASE } from "@/lib/layers"
import type { CaseAsset, CaseMeta } from "@/lib/types"
import { TypeIn } from "./ui/TypeIn"

type Props = {
  file: CaseMeta
  asset?: CaseAsset
  /** Compiled MDX for sections 02–06 (identical in the overlay and the standalone page). */
  body: ReactNode
  email: string
  onClose: () => void
  onMove: (direction: number) => void
  standalone?: boolean
}

/** Case-study reader: sticky toolbar, summary readout, MDX body, prev/next. */
export function CaseView({ file, asset, body, email, onClose, onMove, standalone = false }: Props) {
  const reduced = useReducedMotion()
  const scroller = useRef<HTMLElement>(null)
  // Spec §5: the overlay's top bar types in when it opens. Standalone pages and reduced motion render it at once.
  const play = !standalone && !reduced
  const counter = `CASE ${file.number} / 04`
  const heading = `${file.title.toUpperCase()} \u00a0 / \u00a0 FIELD NOTES`
  const close = "CLOSE [ESC] ×"
  useEffect(() => {
    scroller.current?.scrollTo(0, 0)
  }, [file.slug])
  return (
    <motion.article
      className={`osk-case-view ${standalone ? "osk-case-standalone" : ""}`}
      layoutId={standalone ? undefined : `osk-case-${file.slug}`}
      transition={{ duration: reduced ? 0.15 : 0.45, ease: EASE }}
      ref={scroller}
    >
      <div className="osk-case-toolbar">
        <span>
          <TypeIn text={counter} play={play} />
        </span>
        <span>
          <TypeIn text={heading} play={play} delay={counter.length * 20} />
        </span>
        {standalone ? (
          <a href="/#work">{close}</a>
        ) : (
          <button onClick={onClose}>
            <TypeIn text={close} play={play} delay={(counter.length + heading.length) * 20} />
          </button>
        )}
      </div>
      <div className="osk-case-inner">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={file.slug}
            initial={{ opacity: 0, transform: reduced ? "none" : "translateX(16px)" }}
            animate={{ opacity: 1, transform: "translateX(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <div className="osk-case-intro">
              <span className="osk-label">{"// 01"} &nbsp; SUMMARY READOUT</span>
              <h1>{file.title}</h1>
              <p className="osk-case-summary">{file.summary}</p>
              <div className={`osk-case-readout ${file.team ? "has-team" : ""}`}>
                <div>
                  <span>ROLE</span>
                  {file.role}
                </div>
                <div>
                  <span>DATES / ENGAGEMENT</span>
                  {file.meta}
                </div>
                {file.team && (
                  <div>
                    <span>TEAM</span>
                    {file.team}
                  </div>
                )}
                <div>
                  <span>STACK</span>
                  {file.stack}
                </div>
              </div>
              <div className="osk-actions">
                {asset?.live && (
                  <a href={asset.live} target="_blank" rel="noopener noreferrer" className="osk-button">
                    LIVE PROJECT ↗
                  </a>
                )}
                {asset?.repo && (
                  <a href={asset.repo} target="_blank" rel="noopener noreferrer" className="osk-button secondary">
                    SOURCE CODE ↗
                  </a>
                )}
              </div>
            </div>
            {body}
          </motion.div>
        </AnimatePresence>
        <div className="osk-case-bottom">
          <button className="osk-button secondary" onClick={() => onMove(-1)}>
            ← PREVIOUS CASE
          </button>
          <a href={`mailto:${email}`} className="osk-text-link">
            DISCUSS A PROJECT ↗
          </a>
          <button className="osk-button" onClick={() => onMove(1)}>
            NEXT CASE →
          </button>
        </div>
      </div>
      <button className="osk-case-edge previous" aria-label="Previous case study" onClick={() => onMove(-1)}>
        ←
      </button>
      <button className="osk-case-edge next" aria-label="Next case study" onClick={() => onMove(1)}>
        →
      </button>
    </motion.article>
  )
}
