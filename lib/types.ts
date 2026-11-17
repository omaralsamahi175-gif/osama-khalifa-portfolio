export type CaseMeta = {
  slug: string
  title: string
  number: string
  meta: string
  role: string
  stack: string
  summary: string
  /** Long-form card metrics shown in the case reader (value, label). */
  metrics: [string, string][]
  /** Short chips shown on the home-page card (from the Framer "Case Files" CMS). */
  cardMetrics: string[]
  diagram: string[]
  /** <title> for the standalone page. */
  seoTitle: string
  /** Optional readout field (spec §4). Hidden until set. */
  team?: string
}

export type Post = {
  slug: string
  number: string
  title: string
  topic: string
  /** External post URL. Rows render as plain text until this is set. */
  url: string
  /** e.g. "4 MIN". Derived from the MDX body; absent while the body is empty. */
  readTime?: string
}

export type ImageEntry = { src: string; width: number; height: number }

/** Output of scripts/dither.mjs for one source image. */
export type ProcessedImage = {
  color: ImageEntry
  silver: ImageEntry
  /** Portrait only: the false-colour scan layer. */
  thermal?: ImageEntry
}

export type CaseScreen = {
  image: ProcessedImage
  /** Caption after "SCREEN 01 / 03 ·". Falls back to the case title. */
  caption?: string
  /** Describe the actual product screen. */
  alt?: string
}

export type CaseAsset = {
  slug: string
  /** Ordered screenshots; the first one is also the home-page card image. */
  screens: CaseScreen[]
  live?: string
  repo?: string
}

export type SiteConfig = {
  email: string
  github?: string
  linkedin?: string
  cv?: string
  portrait?: ProcessedImage
  portraitAlt?: string
  /** Public repository of this site (the spec links it as a work sample). */
  sourceRepo?: string
}
