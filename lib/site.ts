import type { CaseAsset, SiteConfig } from "./types"
import { getImagesFor, getProcessedImage } from "./images"

/**
 * Everything the Framer version exposed as property controls lives here.
 * Leave a value empty and its link/button is omitted, exactly as in Framer.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const site: SiteConfig = {
  email: "osamakhalifa333@gmail.com",
  github: "", // PLACEHOLDER: add https://github.com/<user>
  linkedin: "", // PLACEHOLDER: add https://www.linkedin.com/in/<user>
  cv: "", // PLACEHOLDER: drop the PDF in /public and set "/Osama-Khalifa-CV.pdf"
  sourceRepo: "https://github.com/omaralsamahi175-gif/osama-khalifa-portfolio", // shown as "SITE SOURCE ↗" in Contact
  // Put the original at assets/source/portrait.(jpg|png) and run `npm run dither`.
  portrait: getProcessedImage("portrait"),
  portraitAlt: "Osama Khalifa",
}

type ScreenText = Record<string, { caption?: string; alt?: string }>

/**
 * Per-case links and screenshot text. Screenshots are discovered automatically:
 * assets/source/<slug>.png, or <slug>-01.png, <slug>-02.png … for several screens.
 * Key `screens` by that file name to set the caption and alt text.
 */
const CASES: { slug: string; live: string; repo: string; screens: ScreenText }[] = [
  { slug: "buildmetrics", live: "", repo: "", screens: {} }, // e.g. "buildmetrics-01": { caption: "BOQ TABLE, 10K ROWS", alt: "…" }
  { slug: "kacademia", live: "", repo: "", screens: {} },
  { slug: "dadbod", live: "", repo: "", screens: {} },
  { slug: "pos-system", live: "", repo: "", screens: {} }, // PLACEHOLDER: live link and repo (spec §4)
]

export const caseAssets: CaseAsset[] = CASES.map(({ screens, ...links }) => ({
  ...links,
  screens: getImagesFor(links.slug).map(({ name, image }) => ({ image, ...screens[name] })),
}))

export function getCaseAsset(slug: string): CaseAsset | undefined {
  return caseAssets.find((asset) => asset.slug === slug)
}
