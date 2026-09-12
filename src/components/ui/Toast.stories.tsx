import { useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toast } from './Toast'
import { Button } from './button'
import { useUIStore } from '@/store/uiStore'
import type { FeedbackTone } from './feedback'

const meta = { title: 'Feedback/Toast', parameters: { layout: 'padded' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

/**
 * ## Acceptance criteria
 *
 * - **It says which KIND of message it is.** Three tones — Success, Warning, Info — each on
 *   its own tint (`bg/*-subtle`) with its own glyph. One channel was carrying a confirmation
 *   and a validation that blocks your save in the same grey pill.
 * - **The text is `fg/default`, never the tone.** `fg/success` on `bg/success-subtle`
 *   measures 3.32:1, under the 4.5:1 body text needs; `fg/default` on that tint measures
 *   15.74. The tone lives in the surface and the glyph, where 3:1 applies.
 * - **The glyph is required, not decoration.** `circle-check`, `triangle-alert`, `info` —
 *   three shapes that stay apart in greyscale, so the message still says which kind it is
 *   without colour (WCAG 1.4.1).
 * - **`tone` has no default.** Every call site states it. A default would let one stay
 *   silent about which kind it is, which is the defect this fixed.
 * - **There is no Danger tone.** Nothing in the app emits a true error through this channel;
 *   every red-sounding message is a validation the user can correct, which is Warning.
 * - **Centred at the bottom, above the mobile nav AND above any open sheet.** Confirming
 *   something that happened inside a sheet is useless if the sheet covers it.
 * - **No actions and no close button.** It leaves on its own after 2200ms. A message that
 *   waits for an answer is `SystemMessage`.
 */
export const Tones: Story = {
  render: () => {
    const showToast = useUIStore(s => s.showToast)
    const samples: [string, FeedbackTone][] = [
      ['Ingreso registrado', 'success'],
      ['Ingresa descripción y monto', 'warning'],
      ['Sincronizado', 'info'],
    ]
    // The store holds one at a time and clears it after ~2.2s, so the story cycles through
    // the three rather than showing them stacked — which is also how they really arrive.
    useEffect(() => {
      let i = 0
      const fire = () => { const [msg, tone] = samples[i++ % samples.length]; showToast(msg, tone) }
      fire()
      const t = setInterval(fire, 1800)
      return () => clearInterval(t)
    }, [showToast])
    return (
      <div style={{ height: 160 }}>
        <p className="ts-body-small text-muted-foreground">
          Anclado al borde inferior de la ventana, no de este bloque. Los tres tonos se turnan.
        </p>
        <Toast />
      </div>
    )
  },
}

/** Fired by hand, which is how it really appears: after an action, or instead of one. */
export const AfterAnAction: Story = {
  render: () => {
    const showToast = useUIStore(s => s.showToast)
    return (
      <div style={{ height: 160 }}>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => showToast('Egreso registrado', 'success')}>Registrar gasto</Button>
          <Button size="sm" variant="outline" onClick={() => showToast('Escribe una descripción', 'warning')}>Guardar vacío</Button>
        </div>
        <Toast />
      </div>
    )
  },
}
