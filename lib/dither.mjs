// Pure pixel functions used by scripts/dither.mjs at build time.
// Nothing here runs in the browser.

/** 4×4 Bayer threshold matrix (values 0–15). */
export const BAYER_4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

/** Rec. 709 luminance of an RGB pixel, 0–255. */
export const luminance = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b

/**
 * Ordered dither: each pixel becomes `on` or `off` depending on whether its
 * grey level beats the Bayer threshold for its (x mod 4, y mod 4) cell.
 * @param {Uint8Array|Buffer} gray one byte per pixel
 * @returns {Buffer} RGB, three bytes per pixel
 */
export function orderedDither(gray, width, height, { on = 226, off = 15 } = {}) {
  const out = Buffer.alloc(width * height * 3)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      const v = gray[i] > BAYER_4[(y % 4) * 4 + (x % 4)] * 16 ? on : off
      out[i * 3] = out[i * 3 + 1] = out[i * 3 + 2] = v
    }
  }
  return out
}

/**
 * False-colour "thermal" ramp: blue → amber → red by luminance.
 * @param {Uint8Array|Buffer} rgba four bytes per pixel
 * @returns {Buffer} RGBA
 */
export function thermal(rgba, width, height) {
  const out = Buffer.alloc(width * height * 4)
  const blue = [38, 77, 163], amber = [232, 151, 56], red = [214, 48, 44]
  for (let p = 0; p < width * height; p++) {
    const i = p * 4
    const f = luminance(rgba[i], rgba[i + 1], rgba[i + 2]) / 255
    const low = f < 0.5 ? blue : amber
    const high = f < 0.5 ? amber : red
    const mix = f < 0.5 ? f * 2 : (f - 0.5) * 2
    for (let k = 0; k < 3; k++) out[i + k] = Math.round(low[k] + (high[k] - low[k]) * mix)
    out[i + 3] = rgba[i + 3]
  }
  return out
}
