import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FeedbackGlyph, feedbackSurface, FEEDBACK_SHADOW, FEEDBACK_BOTTOM, type FeedbackTone } from './feedback'

/**
 * A message that WAITS. Same pill as `Toast`, same tints, same glyphs — the difference is
 * not how it looks but whether it expects an answer: a toast lasts 2200ms and leaves, this
 * one stays until the action is taken. That is also why it stacks above the toast.
 *
 * No tone axis yet. An axis with one value is not an axis — every message that waits is
 * currently Info, and the prop exists so the second one does not have to reshape this.
 */
export function SystemMessage({ tone = 'info', children, action }: {
  tone?: FeedbackTone
  children: ReactNode
  /** The thing being waited on. Rendered as a filled button at the pill's trailing edge. */
  action: { label: string; onClick: () => void }
}) {
  return (
    <div
      role="status"
      style={{ boxShadow: FEEDBACK_SHADOW }}
      className={cn(
        feedbackSurface(tone),
        'fixed left-1/2 -translate-x-1/2 z-[120] py-2 pl-4 pr-2',
        FEEDBACK_BOTTOM,
      )}
    >
      <FeedbackGlyph tone={tone} />
      <span className="ts-body-small text-[var(--foreground)]">{children}</span>
      <Button size="sm" onClick={action.onClick}>{action.label}</Button>
    </div>
  )
}
