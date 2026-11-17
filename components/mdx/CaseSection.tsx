import type { ReactNode } from "react"
import { Strip } from "../ui/Strip"

/** A numbered case-study section ("// 02  THE PROBLEM"). Markdown paragraphs inside pick up `.osk-case-section>p`. */
export function CaseSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <section className="osk-case-section">
      <Strip number={number} title={title} level={2} />
      {children}
    </section>
  )
}
