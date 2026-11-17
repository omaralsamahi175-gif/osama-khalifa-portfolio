#!/usr/bin/env node
// Build-time image pipeline. Runs automatically before `next dev` and `next build`.
//
//   assets/source/<slug>.(png|jpg|jpeg|webp)  → case screenshot
//   assets/source/portrait.(png|jpg|jpeg|webp) → identity portrait
//
// Writes processed files to public/generated/ and a manifest to
// lib/generated/images.json that the app imports. Nothing is dithered at runtime.
import sharp from "sharp"
import { mkdir, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { orderedDither, thermal, luminance } from "../lib/dither.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SOURCE = path.join(root, "assets/source")
const OUT = path.join(root, "public/generated")
const MANIFEST = path.join(root, "lib/generated/images.json")
const BG = "#0e0f11"
const PORTRAIT = { width: 400, height: 480 }

const entry = async (file) => {
  const { width, height } = await sharp(file).metadata()
  return { src: `/generated/${path.basename(file)}`, width, height }
}

/** Case screenshot: 1-bit silver preview (lossless, so the pattern survives) + colour original. */
async function processScreenshot(input, name) {
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .flatten({ background: BG })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const gray = info.channels === 1 ? data : data.filter((_, i) => i % info.channels === 0)
  const pixels = orderedDither(gray, info.width, info.height, { on: 226, off: 15 })
  const silver = path.join(OUT, `${name}-silver.webp`)
  const color = path.join(OUT, `${name}-color.webp`)
  await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 3 } })
    .webp({ lossless: true })
    .toFile(silver)
  await sharp(input).rotate().resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 85 }).toFile(color)
  return { silver: await entry(silver), color: await entry(color) }
}

/** Portrait: 400×480 cover crop → ordered dither + false-colour scan layer + sharp colour copy. */
async function processPortrait(input) {
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ ...PORTRAIT, fit: "cover" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const gray = Buffer.alloc(width * height)
  for (let p = 0; p < width * height; p++) gray[p] = luminance(data[p * 4], data[p * 4 + 1], data[p * 4 + 2])
  const silver = path.join(OUT, "portrait-silver.webp")
  const heat = path.join(OUT, "portrait-thermal.webp")
  const color = path.join(OUT, "portrait-color.webp")
  await sharp(orderedDither(gray, width, height, { on: 220, off: 22 }), { raw: { width, height, channels: 3 } })
    .webp({ lossless: true })
    .toFile(silver)
  await sharp(thermal(data, width, height), { raw: { width, height, channels: 4 } }).webp({ quality: 85 }).toFile(heat)
  await sharp(input).rotate().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 85 }).toFile(color)
  return { silver: await entry(silver), thermal: await entry(heat), color: await entry(color) }
}

await mkdir(SOURCE, { recursive: true })
await rm(OUT, { recursive: true, force: true })
await mkdir(OUT, { recursive: true })
await writeFile(path.join(OUT, ".gitkeep"), "")
await mkdir(path.dirname(MANIFEST), { recursive: true })

const manifest = {}
const files = (await readdir(SOURCE)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort()
for (const file of files) {
  const name = path.parse(file).name.toLowerCase()
  const input = path.join(SOURCE, file)
  manifest[name] = name === "portrait" ? await processPortrait(input) : await processScreenshot(input, name)
  console.log(`dither: ${file} → ${Object.keys(manifest[name]).join(", ")}`)
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n")
console.log(`dither: ${files.length} source image(s) processed`)
