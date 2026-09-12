import { useUIStore } from '@/store/uiStore'
import { SystemMessage } from '@/components/ui/SystemMessage'

/**
 * The offer to take a new build.
 *
 * It exists because `registerType: 'prompt'` installs a new worker and then WAITS — it does
 * not apply on the next launch, which is what the registration used to claim. Without
 * something to accept, every build after the first was downloaded and never served.
 *
 * Applying reloads the page, and that reload is the reason this is a button rather than
 * automatic — a user gesture cannot land in the middle of an OAuth callback, which is what
 * broke mobile login when the worker updated itself.
 */
export function UpdatePrompt() {
  const { updateReady, applyUpdate } = useUIStore()
  if (!updateReady || !applyUpdate) return null

  return (
    <SystemMessage action={{ label: 'Actualizar', onClick: applyUpdate }}>
      Hay una versión nueva
    </SystemMessage>
  )
}
