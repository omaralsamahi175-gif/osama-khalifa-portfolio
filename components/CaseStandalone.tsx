"use client"
import type { ReactNode } from "react"
import { useShortcuts } from "@/lib/keyboard"
import type { CaseAsset, CaseMeta } from "@/lib/types"
import { CaseView } from "./CaseView"

type Props = { file: CaseMeta; asset?: CaseAsset; body: ReactNode; email: string; slugs: string[] }

/** /work/[slug]: the same reader, full page. Esc returns home, arrows move between cases. */
export function CaseStandalone({ file, asset, body, email, slugs }: Props) {
  const index = Math.max(0, slugs.indexOf(file.slug))
  const close = () => window.location.assign("/#work")
  const move = (d: number) => window.location.assign(`/work/${slugs[(index + d + slugs.length) % slugs.length]}`)
  useShortcuts((e) => {
    if (e.key === "Escape") {
      e.preventDefault()
      close()
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault()
      move(e.key === "ArrowLeft" ? -1 : 1)
    }
  })
  return (
    <div className="osk">
      <main>
        <CaseView file={file} asset={asset} body={body} email={email} onClose={close} onMove={move} standalone />
      </main>
    </div>
  )
}
