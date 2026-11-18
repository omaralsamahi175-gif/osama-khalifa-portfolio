import { forwardRef } from "react"
import type { CaseAsset, CaseMeta } from "@/lib/types"
import { CaseCard } from "./CaseCard"
import { Reveal } from "./ui/Reveal"
import { Strip } from "./ui/Strip"
import { ScrambleText } from "./ui/ScrambleText"

type Props = { cases: CaseMeta[]; assets: CaseAsset[]; onOpen: (slug: string) => boolean }

/** 02 — the first case is featured, the rest follow in a wrapping row (Framer: 1fr items, min 280px, 18px gap). */
export const WorkSection = forwardRef<HTMLElement, Props>(function WorkSection({ cases, assets, onOpen }, ref) {
  const [featured, ...rest] = cases
  const assetFor = (slug: string) => assets.find((a) => a.slug === slug)
  return (
    <section id="work" ref={ref} className="osk-section osk-work">
      <div className="osk-container">
        <Strip number="02" title="SELECTED WORK · 4 CASE FILES" extra="SHIPPED, NOT STAGED." />
        <Reveal className="osk-work-heading">
          <h2><ScrambleText text={"Evidence,\nacross the stack"} accent="." /></h2>
          <span className="osk-label">
            SELECT A CASE FILE
            <br />↓ READ THE DECISIONS BEHIND THE BUILD
          </span>
        </Reveal>
        <div className="osk-featured-slot">
          <CaseCard file={featured} index={0} asset={assetFor(featured.slug)} featured onOpen={onOpen} />
        </div>
        <div className="osk-work-slot">
          <div className="osk-work-list">
            {rest.map((file, i) => (
              <div className="osk-work-item" key={file.slug}>
                <CaseCard file={file} index={i + 1} asset={assetFor(file.slug)} onOpen={onOpen} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
})
