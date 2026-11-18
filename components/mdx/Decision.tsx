import type { ReactNode } from "react"
import { LAYERS } from "@/lib/layers"
import { ScrambleText } from "../ui/ScrambleText"

export function Decisions({ children }: { children: ReactNode }) {
  return <div className="osk-decisions">{children}</div>
}

/**
 * One technical decision card. `n` is "01"…; its colour cycles through the four layers.
 * Children are the Markdown paragraph followed by a fenced code block, which MDX
 * renders as the card's `<pre><code>` diagram. No JS expressions are needed, so the
 * content compiles with next-mdx-remote's default `blockJS`.
 */
export function Decision({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  const index = Number(n) - 1
  return (
    <div className="osk-decision">
      <span className="osk-label" style={{ color: LAYERS[index % 4].color }}>
        {n} / TECHNICAL DECISION
      </span>
      <h3><ScrambleText text={title} /></h3>
      {children}
    </div>
  )
}
