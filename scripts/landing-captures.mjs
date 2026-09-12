#!/usr/bin/env node
/**
 * Photographs the app with the demo persona, for the landing's feature blocks.
 *
 * Why a script and not six manual screenshots: the app changes. A hand-taken set cannot be
 * re-taken after a UI fix without someone remembering which six views, at which width, in
 * which theme, with which tab open. This is that memory.
 *
 * It drives the running dev server at ?preview=demo, which mounts the authenticated app
 * with the invented persona and NO Supabase session (src/lib/demoSeed.ts). Nothing here
 * touches real data, and the fixture is dropped from production builds by tree-shaking.
 *
 * Usage:
 *   npm run dev                    # in another terminal
 *   node scripts/landing-captures.mjs [--theme dark] [--port 5173]
 *
 * Writes webp straight into public/landing/images/ through the same encoder as
 * scripts/landing-image.mjs.
 */
import { writeFileSync, statSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'public/landing/images')
const BUDGET = 250 * 1024

const flag = (n, d) => {
  const i = process.argv.indexOf(`--${n}`)
  return i === -1 ? d : process.argv[i + 1]
}
const PORT = flag('port', '5173')
const THEME = flag('theme', 'light')
const BASE = `http://localhost:${PORT}/panel/?preview=demo`

/** The six blocks, in the order they appear on the landing.
 *
 *  Framing is by CARD, not by viewport. The first version shot whatever `main` happened to
 *  show and cut the trend chart through the middle of a bar — an arbitrary edge that reads
 *  as a broken screenshot. Naming the cards also makes this list say what each image is
 *  supposed to contain, which is the memory the script exists to hold: after a UI change,
 *  whoever re-runs it does not have to know which six views at which width with which tab.
 *
 *  `cards`  — union of the cards with these headings, in order.
 *  `height` — clip `main` from its top down this many CSS px (for views with no card
 *             heading at the top, like the month's KPI strip).
 */
const SHOTS = [
  { name: 'feature-kpis', view: 'mes', tab: 'Ingresos', height: 352,
    label: 'KPIs y barra de distribución' },
  { name: 'feature-deducciones', view: 'mes', tab: 'Tributarias', height: 640,
    label: 'obligaciones tributarias del mes' },
  { name: 'feature-obligaciones', view: 'tributarias', height: 620,
    label: 'página de Obligaciones' },
  { name: 'feature-cuentas', view: 'cuentas', height: 560,
    label: 'cuentas' },
  { name: 'feature-analitica', view: 'dashboard', cards: ['Resumen anual', 'Tendencia (últimos 8 meses)'],
    label: 'resumen anual y tendencia' },
  { name: 'feature-movimientos', view: 'mes', tab: 'Movimientos', height: 620,
    label: 'movimientos y TRM efectiva' },
]

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1440, height: 980 },
  deviceScaleFactor: 2, // retina: the landing scales these down, and a 1x capture looks soft
  colorScheme: THEME === 'dark' ? 'dark' : 'light',
})

page.on('pageerror', e => { console.error('page error:', e.message); process.exitCode = 1 })

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.evaluate(t => {
  localStorage.setItem('neto-theme', t)
  document.documentElement.classList.toggle('dark', t === 'dark')
}, THEME)
await page.waitForSelector('main', { timeout: 15000 })

async function encode(buffer) {
  const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`
  return page.evaluate(async url => {
    const img = new Image()
    img.src = url
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    c.getContext('2d').drawImage(img, 0, 0)
    return c.toDataURL('image/webp', 0.85).split(',')[1]
  }, dataUrl)
}

mkdirSync(OUT, { recursive: true })
const suffix = THEME === 'dark' ? '-dark' : ''

for (const shot of SHOTS) {
  // uiStore drives navigation — there is no router, so a view plus an id is the whole of
  // what a route would have carried (src/types/index.ts).
  await page.evaluate(v => {
    const btn = [...document.querySelectorAll('button, a')].find(
      b => b.textContent?.trim().toLowerCase() === v,
    )
    btn?.click()
  }, { mes: 'mes', dashboard: 'resumen', cuentas: 'cuentas', tributarias: 'obligaciones' }[shot.view])
  await page.waitForTimeout(500)

  if (shot.tab) {
    await page.evaluate(t => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent?.trim() === t)
      btn?.click()
    }, shot.tab)
    await page.waitForTimeout(600)
  }

  // Charts animate in. Waiting for the network is not waiting for d3.
  await page.waitForTimeout(900)

  const clip = await page.evaluate(({ cards, height }) => {
    const main = document.querySelector('main')
    const PAD = 16
    if (cards) {
      // Card titles are a <span class="ts-heading-group">, not a heading tag — the design
      // system's text styles carry the level, and the markup does not. Matching on the text
      // of a leaf element is what actually finds them.
      const found = cards.map(name =>
        [...main.querySelectorAll('*')]
          .find(e => e.children.length === 0 && e.textContent.trim() === name)
          ?.closest('[class*="rounded-xl"]'),
      )
      if (found.some(f => !f)) return { error: `card not found: ${cards.join(' / ')}` }
      found[0].scrollIntoView({ block: 'start' })
      const rects = found.map(f => f.getBoundingClientRect())
      return {
        x: Math.min(...rects.map(r => r.left)) - PAD,
        y: Math.min(...rects.map(r => r.top)) - PAD,
        width: Math.max(...rects.map(r => r.right)) - Math.min(...rects.map(r => r.left)) + PAD * 2,
        height: Math.max(...rects.map(r => r.bottom)) - Math.min(...rects.map(r => r.top)) + PAD * 2,
      }
    }
    main.scrollTop = 0
    const r = main.getBoundingClientRect()
    let h = Math.min(height ?? r.height, r.height)

    // Snap the bottom edge up so it never cuts through a line. `height` is a MAXIMUM, not a
    // measurement: tuning it by hand per shot is the thing that breaks the first time a row
    // changes height, and a screenshot sliced through the middle of "Julio" reads as broken
    // rather than as cropped. Only leaves and short boxes count — a container always
    // straddles the edge, that is what containers do.
    const edge = r.top + h
    const straddling = [...main.querySelectorAll('*')]
      .filter(e => {
        const b = e.getBoundingClientRect()
        if (b.height === 0 || b.height > 120) return false
        if (e.children.length > 2) return false
        return b.top < edge - 2 && b.bottom > edge + 2
      })
      .map(e => e.getBoundingClientRect().top)
    if (straddling.length) h = Math.max(Math.min(...straddling) - r.top - 8, 120)

    return { x: r.left, y: r.top, width: r.width, height: h }
  }, shot)

  if (clip.error) {
    console.error(`✗ ${shot.name}: ${clip.error}`)
    process.exitCode = 1
    continue
  }

  const png = await page.screenshot({ type: 'png', clip })
  const webp = await encode(png)
  const file = join(OUT, `${shot.name}${suffix}.webp`)
  writeFileSync(file, Buffer.from(webp, 'base64'))
  const size = statSync(file).size
  console.log(
    `${size > BUDGET ? '⚠ ' : '  '}${shot.name}${suffix}.webp  ${Math.round(size / 1024)} kB  ` +
    `${Math.round(clip.width)}×${Math.round(clip.height)} — ${shot.label}`,
  )
}

/* ── Phone shots ─────────────────────────────────────────────────────────────────────
   Screens shown inside a phone frame on the landing rather than as a desktop card. They get
   their own viewport and their own URL, because the screen that makes the privacy section's
   point — the Ley 1581 authorisation — is a gate, reachable only through ?preview=consent.

   `clipHeight` crops the IMAGE, not the layout. The landing lets the frame run off the bottom
   of its panel the way the reference does; if that crop were done with the panel's height it
   would move at every width as the phone scales, and land somewhere different each time — at
   one size through the middle of a button. Cropped here, it ends in the same place always:
   just past "No acepto", before the small print. */
const PHONE_SHOTS = [
  { name: 'privacy-consent', url: '/panel/?preview=consent', clipHeight: 780,
    label: 'pantalla de autorización (Ley 1581)' },
]

for (const shot of PHONE_SHOTS) {
  const phone = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    colorScheme: THEME === 'dark' ? 'dark' : 'light',
  })
  await phone.addInitScript(t => { try { localStorage.setItem('neto-theme', t) } catch (e) {} }, THEME)
  await phone.goto(`http://localhost:${PORT}${shot.url}`, { waitUntil: 'networkidle' })
  await phone.evaluate(t => document.documentElement.classList.toggle('dark', t === 'dark'), THEME)
  await phone.waitForTimeout(1200)
  const png = await phone.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 390, height: shot.clipHeight } })
  await phone.close()
  const webp = await encode(png)
  const file = join(OUT, `${shot.name}${suffix}.webp`)
  writeFileSync(file, Buffer.from(webp, 'base64'))
  const size = statSync(file).size
  console.log(`${size > BUDGET ? '⚠ ' : '  '}${shot.name}${suffix}.webp  ${Math.round(size / 1024)} kB  390×${shot.clipHeight} — ${shot.label}`)
}

await browser.close()
console.log(`\n${SHOTS.length + PHONE_SHOTS.length} capturas · tema ${THEME} · public/landing/images/`)
