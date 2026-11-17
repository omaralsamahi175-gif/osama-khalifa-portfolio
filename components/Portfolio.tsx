"use client"
import { LayoutGroup, useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { useShortcuts } from "@/lib/keyboard"
import { NAV } from "@/lib/layers"
import type { CaseAsset, CaseMeta, Post, SiteConfig } from "@/lib/types"
import { AboutSection } from "./AboutSection"
import { CaseView } from "./CaseView"
import { ContactSection } from "./ContactSection"
import { Footer } from "./Footer"
import { Hero } from "./Hero"
import { LogSection } from "./LogSection"
import { MobileMenu } from "./MobileMenu"
import { StackSection } from "./StackSection"
import { Topbar } from "./Topbar"
import { WorkSection } from "./WorkSection"
import { WritingSection } from "./WritingSection"

type Props = {
  cases: CaseMeta[]
  /** Compiled MDX bodies keyed by slug: the exact nodes /work/[slug] renders. */
  bodies: Record<string, ReactNode>
  posts: Post[]
  assets: CaseAsset[]
  site: SiteConfig
}

const MOBILE = "(max-width:767px)"

/** Home page shell: owns navigation state, scroll progress, the case overlay and shortcuts. */
export function Portfolio({ cases, bodies, posts, assets, site }: Props) {
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const sections = useRef<Record<string, HTMLElement | null>>({})
  const priorFocus = useRef<HTMLElement | null>(null)
  const copyTimer = useRef(0)
  const [progress, setProgress] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const [active, setActive] = useState("work")
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [menu, setMenu] = useState(false)
  const [caseIndex, setCaseIndex] = useState<number | null>(null)
  const [boot, setBoot] = useState(false)
  const count = cases.length

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setCopyError(false)
      window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError(true)
    }
  }, [site.email])
  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

  const go = useCallback(
    (id: string) => {
      setMenu(false)
      sections.current[id]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
      setActive(id)
    },
    [reduced],
  )

  const closeCase = useCallback(() => {
    if (caseIndex !== null) window.history.back()
  }, [caseIndex])

  const moveCase = useCallback(
    (d: number) => {
      setCaseIndex((prev) => {
        const next = ((prev ?? 0) + d + count) % count
        window.history.replaceState({ ...window.history.state, oskCase: true }, "", `/work/${cases[next].slug}`)
        return next
      })
    },
    [cases, count],
  )

  /** Desktop: open the overlay and push /work/<slug>. Mobile: let the link navigate to the standalone page. */
  const openCase = useCallback(
    (slug: string) => {
      const n = cases.findIndex((c) => c.slug === slug)
      if (n < 0 || window.matchMedia(MOBILE).matches) return false
      priorFocus.current = document.activeElement as HTMLElement
      setCaseIndex(n)
      window.history.pushState({ ...window.history.state, oskCase: true }, "", `/work/${slug}`)
      return true
    },
    [cases],
  )

  // Boot sequence: once per session, skipped by any input, never with reduced motion.
  useEffect(() => {
    if (reduced) return
    try {
      if (sessionStorage.getItem("osk-boot")) return
      sessionStorage.setItem("osk-boot", "1")
    } catch {}
    setBoot(true)
    const skip = () => setBoot(false)
    const t = window.setTimeout(skip, 1100)
    window.addEventListener("keydown", skip, { once: true })
    window.addEventListener("scroll", skip, { once: true, passive: true })
    window.addEventListener("pointerdown", skip, { once: true })
    return () => {
      window.clearTimeout(t)
      window.removeEventListener("keydown", skip)
      window.removeEventListener("scroll", skip)
      window.removeEventListener("pointerdown", skip)
    }
  }, [reduced])

  // Scroll progress (drives the hero ruler) and active-section tracking.
  useEffect(() => {
    let pending = 0
    const update = () => {
      if (pending) return
      pending = requestAnimationFrame(() => {
        pending = 0
        const el = root.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const total = el.offsetHeight - window.innerHeight
        setProgress(total > 0 ? Math.max(0, Math.min(1, -r.top / total)) : 0)
      })
    }
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    update()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id !== "about") setActive(e.target.id)
        })
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
    )
    Object.values(sections.current).forEach((el) => el && observer.observe(el))
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      cancelAnimationFrame(pending)
      observer.disconnect()
    }
  }, [])

  // Back/forward between "/" and "/work/<slug>" opens or closes the overlay.
  useEffect(() => {
    const pop = () => {
      const slug = window.location.pathname.split("/")[2]
      const n = cases.findIndex((c) => c.slug === slug)
      setCaseIndex(n < 0 ? null : n)
    }
    window.addEventListener("popstate", pop)
    return () => window.removeEventListener("popstate", pop)
  }, [cases])

  // One native <dialog> hosts both the case reader and the mobile menu.
  const dialogOpen = caseIndex !== null || menu
  useEffect(() => {
    const d = dialog.current
    if (!d || !dialogOpen) return
    if (!d.open) d.showModal()
    const saved = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = saved
      if (d.open) d.close()
      priorFocus.current?.focus({ preventScroll: true })
    }
  }, [dialogOpen])

  useShortcuts((e) => {
    if (e.key === "Escape") {
      if (menu) {
        setMenu(false)
        return
      }
      if (caseIndex !== null) {
        e.preventDefault()
        closeCase()
      }
      return
    }
    if (caseIndex !== null) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault()
        moveCase(e.key === "ArrowLeft" ? -1 : 1)
      }
      return
    }
    if (e.key.toLowerCase() === "c") {
      e.preventDefault()
      copyEmail()
    }
    if (e.key === "=" || e.key === "+") {
      e.preventDefault()
      setMenu((m) => !m)
    }
    const match = NAV.find((n) => n[2] === e.key)
    if (match) {
      e.preventDefault()
      go(match[0])
    }
  })

  const bind = (id: string) => (el: HTMLElement | null) => {
    sections.current[id] = el
  }
  const openFile = caseIndex !== null ? cases[caseIndex] : null

  return (
    <div className="osk" ref={root}>
      <LayoutGroup id="osk-portfolio">
        <a className="osk-skip" href="#work">
          Skip to selected work
        </a>
        <Topbar
          active={active}
          boot={boot}
          onNavigate={go}
          onOpenMenu={() => {
            priorFocus.current = document.activeElement as HTMLElement
            setMenu(true)
          }}
        />
        <main>
          <Hero site={site} boot={boot} progress={progress} hover={hover} onHover={setHover} onNavigate={go} />
          <StackSection ref={bind("stack")} />
          <WorkSection ref={bind("work")} cases={cases} assets={assets} onOpen={openCase} />
          <LogSection ref={bind("log")} github={site.github} />
          <WritingSection ref={bind("writing")} posts={posts} />
          <AboutSection ref={bind("about")} site={site} />
          <ContactSection ref={bind("contact")} site={site} copied={copied} copyError={copyError} onCopy={copyEmail} />
        </main>
        <Footer />
        <dialog
          className={`osk-dialog ${menu ? "osk-menu-dialog" : ""}`}
          ref={dialog}
          aria-label={menu ? "Main navigation" : openFile ? `${openFile.title} case study` : "Case study"}
          onCancel={(e) => {
            e.preventDefault()
            if (menu) setMenu(false)
            else closeCase()
          }}
        >
          {menu ? (
            <MobileMenu onClose={() => setMenu(false)} onNavigate={go} />
          ) : (
            openFile && (
              <CaseView
                file={openFile}
                asset={assets.find((a) => a.slug === openFile.slug)}
                body={bodies[openFile.slug]}
                email={site.email}
                onClose={closeCase}
                onMove={moveCase}
              />
            )
          )}
        </dialog>
      </LayoutGroup>
    </div>
  )
}
