import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * The scaffolding every chart in the app repeats.
 *
 * It is deliberately NOT a chart abstraction. The three charts here draw different things
 * — a stacked bar, an area over time, a horizontal category bar — and the moment a shared
 * layer tries to own the drawing it starts growing options for each of them, which is how
 * an internal charting library is born and how it ends up costing more than the duplication
 * it replaced.
 *
 * What is shared is what has no opinion: reading a token, knowing the container's width,
 * and starting from a clean SVG.
 */

/**
 * Resolve a CSS custom property to its computed value.
 *
 * d3 writes attributes, not classes, so a chart cannot hand it `var(--x)` inside an
 * attribute that expects a colour string in every browser it has to work in. This existed
 * three times, under three names (`get`, `getCSSVar`, `cssVar`).
 */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * The container's current width, tracked with a ResizeObserver.
 *
 * Returns 0 before the first measurement — a chart that draws at 0 draws nothing, which is
 * the correct thing to do for one frame and the reason effects gate on it.
 */
export function useChartWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(entries => setWidth(entries[0].contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return width
}

/**
 * A stable ref pair for the container and its SVG, so a chart declares both in one line
 * rather than two that can drift apart.
 */
export function useChartRefs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  return { containerRef, svgRef }
}

/**
 * A bar whose TOP two corners are rounded and whose bottom two are square.
 *
 * `rx` cannot express this — SVG rounds all four corners or none — which is why a stacked
 * bar needs a path for its topmost segment. And it needs one: rounding every segment turns
 * a bar into a stack of loose pills and the eye stops adding them up. Rounded only at the
 * top, the bar says "this is one quantity, and it ends here".
 *
 * The radius is clamped to half the width and to the height, so a segment shorter than the
 * radius degrades into a shallower curve instead of an inverted one.
 */
export function topRoundedBarPath(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.max(0, Math.min(r, w / 2, h))
  if (rr === 0) return `M${x},${y}h${w}v${h}h${-w}Z`
  return `M${x},${y + h}V${y + rr}A${rr},${rr} 0 0 1 ${x + rr},${y}H${x + w - rr}A${rr},${rr} 0 0 1 ${x + w},${y + rr}V${y + h}Z`
}

/** A design-system radius token as a number, for the d3 code that needs one. */
export function radiusVar(name: string): number {
  return parseFloat(cssVar(name)) || 0
}
