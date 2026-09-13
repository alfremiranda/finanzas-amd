import { CircleCheck, TriangleAlert, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The vocabulary `Toast` and `SystemMessage` share.
 *
 * They are the same pill on purpose: same shape, same tints, same glyph set. What separates
 * them is not appearance but whether the message WAITS — a toast leaves after 2200ms, a
 * system message stays until it is answered. Forking the pill would have put the tint table
 * in two places and let them drift.
 */
export type FeedbackTone = 'success' | 'warning' | 'info'

/**
 * The glyph is not decoration. It is what keeps the meaning off colour alone (WCAG 1.4.1):
 * three shapes that stay distinguishable in greyscale, so the message still says which kind
 * it is to someone who cannot tell the three tints apart.
 */
const TONE_GLYPH: Record<FeedbackTone, typeof CircleCheck> = {
  success: CircleCheck,
  warning: TriangleAlert,
  info:    Info,
}

const TONE_SURFACE: Record<FeedbackTone, string> = {
  success: 'bg-[var(--bg-success-subtle)]',
  warning: 'bg-[var(--bg-warning-subtle)]',
  info:    'bg-[var(--bg-info-subtle)]',
}

/**
 * Warning takes `fg/warning-strong`, a rung minted for this: `fg/warning` on its own tint
 * measures 2.86:1, under even the 3:1 a graphic needs. It was the one tone whose icon could
 * not be seen on its own surface.
 */
const TONE_GLYPH_COLOR: Record<FeedbackTone, string> = {
  success: 'text-[var(--fg-success)]',
  warning: 'text-[var(--fg-warning-strong)]',
  info:    'text-[var(--fg-info)]',
}

/** The floating elevation, same pair of layers the tab bar uses. */
export const FEEDBACK_SHADOW = [
  '0 var(--elevation-floating-key-offset-y) var(--elevation-floating-key-blur) var(--elevation-floating-key-spread) var(--shadow-key)',
  '0 var(--elevation-floating-ambient-offset-y) var(--elevation-floating-ambient-blur) var(--elevation-floating-ambient-spread) var(--shadow-ambient)',
].join(', ')

/**
 * Sits above the tab bar's band on mobile. This used to hang off a `.has-mobile-nav` class
 * that nothing ever set, so the offset never applied and the bar could cover the message it
 * was confirming.
 */
export const FEEDBACK_BOTTOM = 'bottom-[calc(58px+42px+env(safe-area-inset-bottom))] sm:bottom-6'

/**
 * Centred at the bottom, and sized to its own content.
 *
 * `w-max` is the part that is not decoration. A fixed box with `left: 50%` shrinks to fit
 * against its containing block measured FROM that offset — so its widest possible size is half
 * the viewport, and «Hay una versión nueva» broke into three lines on a phone inside a pill
 * about 200px wide. `w-max` sizes it to the content instead, and the translate still centres it.
 *
 * `max-w` then puts the ceiling back where it belongs: the viewport minus a margin, so a long
 * message wraps like a sentence rather than running off the screen.
 */
export const FEEDBACK_POSITION =
  'fixed left-1/2 -translate-x-1/2 w-max max-w-[calc(100vw-32px)]'

export function feedbackSurface(tone: FeedbackTone) {
  return cn('inline-flex items-center gap-2.5 rounded-full', TONE_SURFACE[tone])
}

/**
 * The text is `fg/default`, NOT the tone. `fg/success` on `bg/success-subtle` measures
 * 3.32:1 in light, under the 4.5:1 body text needs; `fg/default` on that same tint measures
 * 15.74. So the tone lives in the surface and the glyph, where 3:1 applies, and the words
 * stay readable.
 */
export function FeedbackGlyph({ tone }: { tone: FeedbackTone }) {
  const Glyph = TONE_GLYPH[tone]
  return <Glyph aria-hidden="true" size={18} className={cn('shrink-0', TONE_GLYPH_COLOR[tone])} />
}
