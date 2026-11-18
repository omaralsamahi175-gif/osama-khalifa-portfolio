"use client"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { getShortcutSection, useShortcuts } from "@/lib/keyboard"
import type { CaseAsset, CaseMeta } from "@/lib/types"
import { CaseView } from "./CaseView"
import { MobileMenu } from "./MobileMenu"
import { Topbar } from "./Topbar"

type Props = { file: CaseMeta; asset?: CaseAsset; body: ReactNode; email: string; slugs: string[] }

/** /work/[slug]: the same reader, full page. Esc returns home, arrows move between cases. */
export function CaseStandalone({ file, asset, body, email, slugs }: Props) {
  const menu = useRef<HTMLDialogElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const dialog = menu.current
    if (!menuOpen || !dialog) return
    dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  const index = Math.max(0, slugs.indexOf(file.slug))
  const close = () => window.location.assign("/#work")
  const move = (d: number) => window.location.assign(`/work/${slugs[(index + d + slugs.length) % slugs.length]}`)
  useShortcuts((e) => {
    const section = getShortcutSection(e.key)
    if (section) {
      e.preventDefault()
      window.location.assign(`/#${section}`)
    } else if (e.key === "=" || e.key === "+") {
      e.preventDefault()
      setMenuOpen((open) => !open)
    } else if (menuOpen) {
      if (e.key === "Escape") {
        e.preventDefault()
        setMenuOpen(false)
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      close()
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault()
      move(e.key === "ArrowLeft" ? -1 : 1)
    }
  })
  return (
    <div className="osk">
      <Topbar onOpenMenu={() => setMenuOpen(true)} />
      <main>
        <CaseView file={file} asset={asset} body={body} email={email} onClose={close} onMove={move} standalone />
      </main>
      <dialog
        className="osk-dialog osk-menu-dialog"
        ref={menu}
        aria-label="Main navigation"
        onCancel={(event) => {
          event.preventDefault()
          setMenuOpen(false)
        }}
      >
        {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
      </dialog>
    </div>
  )
}
