#!/usr/bin/env node
/**
 * Converts a landing image to webp, because this machine has no converter.
 *
 * No cwebp, no ImageMagick, no sharp, no PIL, and macOS `sips` cannot write webp. What the
 * repo does have is Playwright's Chromium, which encodes webp natively through a canvas —
 * so the browser already installed for visual regression is the image pipeline too.
 *
 * The point is that the person generating the images does not have a converter either. A
 * README asking for webp without shipping a way to make one is a README asking for PNG.
 *
 * Usage:
 *   node scripts/landing-image.mjs <input> <output-name> [--width 1600] [--quality 0.82]
 *   node scripts/landing-image.mjs raw.png como-trabajas.webp
 *
 * Writes into public/landing/images/ and prints the size, which is the number that matters:
 * this page ships no bundle, and that argument dies at the first 2 MB photograph.
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(root, 'public/landing/images')
const BUDGET = 250 * 1024

const [input, outName] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const flag = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : Number(process.argv[i + 1])
}
const maxWidth = flag('width', 1600)
const quality = flag('quality', 0.82)

if (!input || !outName) {
  console.error('usage: node scripts/landing-image.mjs <input> <output.webp> [--width N] [--quality 0-1]')
  process.exit(1)
}
if (extname(outName) !== '.webp') {
  console.error('the output name must end in .webp')
  process.exit(1)
}

const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }[
  extname(input).toLowerCase()
]
if (!mime) {
  console.error(`unsupported input type: ${extname(input)}`)
  process.exit(1)
}

const dataUrl = `data:${mime};base64,${readFileSync(input).toString('base64')}`

const browser = await chromium.launch()
const page = await browser.newPage()
const result = await page.evaluate(
  async ({ dataUrl, maxWidth, quality }) => {
    const img = new Image()
    img.src = dataUrl
    await img.decode()
    const scale = Math.min(1, maxWidth / img.naturalWidth)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return {
      data: canvas.toDataURL('image/webp', quality).split(',')[1],
      width: canvas.width,
      height: canvas.height,
      sourceWidth: img.naturalWidth,
      sourceHeight: img.naturalHeight,
    }
  },
  { dataUrl, maxWidth, quality }
)
await browser.close()

const out = join(OUT_DIR, outName)
writeFileSync(out, Buffer.from(result.data, 'base64'))

const before = statSync(input).size
const after = statSync(out).size
const kb = (n) => `${Math.round(n / 1024)} kB`
console.log(
  `${result.sourceWidth}×${result.sourceHeight} ${kb(before)} → ${result.width}×${result.height} ${kb(after)} · public/landing/images/${outName}`
)
if (after > BUDGET) {
  console.error(`over the 250 kB budget — lower --quality or --width and run again`)
  process.exit(1)
}
