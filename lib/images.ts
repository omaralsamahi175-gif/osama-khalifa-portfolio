import manifest from "./generated/images.json"
import type { ProcessedImage } from "./types"

const images = manifest as Record<string, ProcessedImage>

/** Reads the manifest written by scripts/dither.mjs (build time, never at runtime). */
export function getProcessedImage(name: string): ProcessedImage | undefined {
  return images[name]
}

/** All processed images named `<slug>` or `<slug>-<n>`, in file-name order. */
export function getImagesFor(slug: string): { name: string; image: ProcessedImage }[] {
  const pattern = new RegExp(`^${slug}(-\\d+)?$`)
  return Object.keys(images)
    .filter((name) => pattern.test(name))
    .sort()
    .map((name) => ({ name, image: images[name] }))
}
