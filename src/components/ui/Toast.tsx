import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'

export function Toast() {
  const toastMsg = useUIStore(s => s.toastMsg)

  return (
    <div
      className={cn(
        'fixed left-1/2 -translate-x-1/2 bg-[var(--foreground)] text-[var(--card)] px-5 py-2 rounded-full ts-body-small',
        // z above the drawer (overlay z-100 / content z-101) so toasts stay visible over an open sheet
        'opacity-0 translate-y-2 pointer-events-none transition-[opacity,transform] duration-slow z-[110]',
        // Mobile: above bottom nav
        // Above the tab bar's band on mobile. This used to hang off a `.has-mobile-nav`
        // class that nothing ever set, so the offset never applied and the bar could cover
        // the message it was confirming.
        'bottom-[calc(58px+42px+env(safe-area-inset-bottom))] sm:bottom-6',
        toastMsg && 'opacity-100 translate-y-0',
      )}
    >
      {toastMsg}
    </div>
  )
}
