import { CalendarDays, LayoutDashboard, WalletCards, Landmark } from 'lucide-react'
import { useState, useEffect, type RefObject } from 'react'
import { cn } from '@/lib/utils'
import { useUIStore, isSectionActive } from '@/store/uiStore'
import {
  Sidebar,
  SidebarContent,
  useSidebar,
} from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { ViewType } from '@/types'

const NAV_ITEMS: Array<{ id: ViewType; label: string; mobileLabel: string; Icon: typeof CalendarDays }> = [
  { id: 'dashboard', label: 'Resumen',       mobileLabel: 'Resumen',       Icon: LayoutDashboard },
  { id: 'mes',     label: 'Mes',           mobileLabel: 'Mes',           Icon: CalendarDays },
  { id: 'tributarias', label: 'Obligaciones', mobileLabel: 'Oblig.', Icon: Landmark },
  { id: 'cuentas', label: 'Cuentas',       mobileLabel: 'Cuentas',       Icon: WalletCards },
]

function NavButton({ id, label, Icon }: { id: ViewType; label: string; Icon: typeof CalendarDays }) {
  const { view, setView } = useUIStore()
  const { state } = useSidebar()
  const collapsed = state === 'collapsed'
  const active = isSectionActive(view, id)

  const btn = (
    <button
      onClick={() => setView(id)}
      className={cn(
        'flex w-full items-center h-10 rounded-xl overflow-hidden transition-colors cursor-pointer border-0 bg-transparent font-[inherit]',
        collapsed ? 'p-[12px] gap-0 justify-start' : 'px-3 py-2 gap-2',
        active
          ? 'bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] hover:bg-[var(--sidebar-primary)] hover:text-[var(--sidebar-primary-foreground)]'
          : 'text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]',
      )}
    >
      <Icon size={16} className="shrink-0" />
      {!collapsed && <span className="ts-body-base-emphasis truncate">{label}</span>}
    </button>
  )

  if (!collapsed) return btn

  return (
    <Tooltip>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-3">
        <div className="flex flex-col gap-2 px-3">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <NavButton key={id} id={id} label={label} Icon={Icon} />
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

/**
 * The mobile tab bar: a floating capsule, inset 21 from the left, right and bottom edges.
 *
 * Four rules here are decisions rather than styling:
 *
 * The inset on three sides is what makes it read as floating OVER the content instead of
 * as the edge of the screen. Content scrolls underneath; nothing else fixed lives in that
 * band.
 *
 * Colour is the entire selected state — no pill, no underline, nothing behind the active
 * tab. That is why `fg/brand` had to exist: the bar was painting the active tab with a
 * sidebar token that resolved to nearly the same grey as the inactive ones, so the one
 * thing carrying the selection was not carrying it.
 *
 * Two to five tabs, never an action. A tab is a destination you come back to; the plus
 * lives in the FAB above the bar, not in it.
 *
 * It MINIMIZES on scroll down: 58×58, the current tab alone as a round button, label and
 * siblings gone. Same fill, same elevation, same inset — the same object shrinking, not a
 * different control appearing. iOS gives this away as `tabBarMinimizeBehavior`; in a PWA
 * it is the scroll listener below.
 */
export function Sidebar_MobileNav({ scrollRef }: { scrollRef?: RefObject<HTMLElement | null> }) {
  const { view, setView } = useUIStore()
  const [minimized, setMinimized] = useState(false)

  useEffect(() => {
    // The page does not scroll — <main> does. Listening on window here would have been a
    // bar that never minimized, and nothing would have said so.
    const el = scrollRef?.current
    if (!el) return
    // Minimize going down, expand at the top — not on every upward scroll, which makes the
    // bar flicker on the small corrective scrolls a thumb makes while reading.
    let last = el.scrollTop
    const onScroll = () => {
      const y = el.scrollTop
      if (y <= 8) setMinimized(false)
      else if (y > last + 4) setMinimized(true)
      last = y
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [scrollRef])

  const current = NAV_ITEMS.find(i => isSectionActive(view, i.id)) ?? NAV_ITEMS[0]
  const shown = minimized ? [current] : NAV_ITEMS

  return (
    <nav
      aria-label="Navegación principal"
      onClick={() => { if (minimized) setMinimized(false) }}
      className={cn(
        'sm:hidden fixed left-1/2 -translate-x-1/2 z-40 flex items-center',
        'rounded-full bg-[var(--card)] border border-[var(--border)]',
        'transition-[width] duration-moderate ease-move overflow-hidden',
        minimized ? 'w-[58px] justify-center' : 'w-[370px] max-w-[calc(100vw-42px)]',
      )}
      style={{
        height: 58,
        bottom: 'calc(21px + env(safe-area-inset-bottom))',
        boxShadow: [
          '0 var(--elevation-floating-key-offset-y) var(--elevation-floating-key-blur) var(--elevation-floating-key-spread) var(--shadow-key)',
          '0 var(--elevation-floating-ambient-offset-y) var(--elevation-floating-ambient-blur) var(--elevation-floating-ambient-spread) var(--shadow-ambient)',
        ].join(', '),
      }}
    >
      {shown.map(({ id, mobileLabel, Icon }) => {
        const active = isSectionActive(view, id)
        return (
          <button
            key={id}
            onClick={() => setView(id)}
            aria-label={mobileLabel}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 h-full',
              'border-none bg-transparent cursor-pointer font-[inherit] transition-colors',
              minimized ? 'w-full' : 'flex-1',
              active ? 'text-[var(--fg-brand)]' : 'text-[var(--fg-subtle)]',
            )}
          >
            <Icon size={24} strokeWidth={active ? 2 : 1.75} />
            {!minimized && <span className="ts-control-xs select-none">{mobileLabel}</span>}
          </button>
        )
      })}
    </nav>
  )
}
