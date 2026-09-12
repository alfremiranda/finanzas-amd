import type { Meta, StoryObj } from '@storybook/react-vite'
import { SystemMessage } from './SystemMessage'

const meta = { title: 'Feedback/SystemMessage', parameters: { layout: 'padded' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

/**
 * ## Acceptance criteria
 *
 * - **Same pill as `Toast`.** Same shape, same tints, same glyph set — they share
 *   `feedback.tsx` so the tint table cannot drift between them.
 * - **What separates it from a toast is that it WAITS.** A toast lasts 2200ms and leaves;
 *   this stays until its action is taken. Nothing about the appearance says so, which is
 *   correct: the difference is behavioural.
 * - **It stacks above the toast** (z 120 against 110), because a message still waiting for
 *   an answer must not be covered by one that is only reporting.
 * - **The action is a real filled button**, not a link or a dismiss. It is the thing being
 *   waited on.
 * - **No tone axis yet, on purpose.** An axis with one value is not an axis: every message
 *   that waits is currently Info. The prop exists so the second one does not reshape this.
 */
export const Update: Story = {
  render: () => (
    <div style={{ height: 160 }}>
      <p className="ts-body-small text-muted-foreground">
        Anclado al borde inferior de la ventana. Es lo que `UpdatePrompt` renderiza.
      </p>
      <SystemMessage action={{ label: 'Actualizar', onClick: () => {} }}>
        Hay una versión nueva
      </SystemMessage>
    </div>
  ),
}
