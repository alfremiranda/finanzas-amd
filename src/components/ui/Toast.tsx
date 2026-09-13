import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import { FeedbackGlyph, feedbackSurface, FEEDBACK_SHADOW, FEEDBACK_BOTTOM, FEEDBACK_POSITION } from './feedback'

/**
 * A transient confirmation that says WHICH kind it is.
 *
 * The channel used to carry three different sorts of message with one appearance: «Ingreso
 * registrado» and «Ingresa descripción y monto» — a confirmation and a validation that
 * blocks your save — arrived in the same grey pill. It did not need colour so much as it
 * needed to say which one it was, which is why `tone` is required at every call site rather
 * than defaulting: a default would quietly re-create the thing being fixed.
 */
export function Toast() {
  const toast = useUIStore(s => s.toast)

  return (
    <div
      role="status"
      aria-live="polite"
      style={{ boxShadow: FEEDBACK_SHADOW }}
      className={cn(
        feedbackSurface(toast?.tone ?? 'info'),
        FEEDBACK_POSITION,
        'py-2 pl-3 pr-4',
        // z above the drawer (overlay z-100 / content z-101) so toasts stay visible over an open sheet
        'opacity-0 translate-y-2 pointer-events-none transition-[opacity,transform] duration-slow z-[110]',
        FEEDBACK_BOTTOM,
        toast && 'opacity-100 translate-y-0',
      )}
    >
      <FeedbackGlyph tone={toast?.tone ?? 'info'} />
      <span className="ts-body-small text-[var(--foreground)]">{toast?.msg}</span>
    </div>
  )
}
