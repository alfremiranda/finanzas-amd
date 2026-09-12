# Design System — Neto

> **Authoritative reference for all design and UI decisions.**
> This document overrides personal preferences and library defaults.
>
> **Re-verified against Figma and the repo on 2026-09-12** after 42 days without a pass. What was
> stale is listed in the changelog (v6) — eleven claims, and every one of them measured rather
> than remembered. Two sections described a state that had already changed: the token imports are
> wired up, and `Badge` no longer has per-account variants.

---

## Figma — Source of Truth for Visual Design

**Figma is the single source of truth for all visual specifications.**

- File: `https://www.figma.com/design/Q2R72oH6MYxYr1VKAe5nOx/Neto`
- When there is a conflict between code and Figma, Figma wins.
- When implementing UI changes, always inspect the relevant Figma node first.

### Key component nodes

These are the **library components** — the thing to inspect before implementing. The previous
version of this table pointed at frames on `Screens & exploration` (`2:34` is *Neto - Desktop
(Light)*, not a collapsed layout) and at instances inside them, so a spec read off it was a spec
read off one screenshot.

| Component | Node ID | Variants |
|-----------|---------|----------|
| `Sidebar` | `127:5113` | `isExpanded=True` · `isExpanded=false` |
| `topnav` | `121:4674` | `Device=Mobile` · `Device=Desktop` |
| `bottom-nav` | `1122:8` | `State=Expanded` · `State=Minimized` |
| `KPI-Card` | `60:253` | — |
| `SectionCard` | `324:1300` | `Action=False` · `Action=True` |
| `AccountSummaryCard` | `379:12631` | `Type` × `Device`, 8 |

The whole registry — 90 components with their node IDs, variant axes and descriptions — is
generated into `design-system/_build/components.json` and rendered at
`design-system/components/*.html`. Read that before hunting through the canvas.

### Derived specs (measured against Figma, 2026-09-12)

| Element | Spec |
|---------|------|
| Sidebar expanded width | 255px |
| Sidebar collapsed width | 65px |
| TopNav height | 54px |
| Sidebar item height | 40px (h-10) |
| Sidebar item border-radius | **16px** (`rounded-2xl`) — decía 12 |
| Sidebar item padding (expanded) | `px-3 py-2` |
| Sidebar item padding (collapsed) | `p-[12px]` centered |
| Sidebar list padding | `px-[12px]` |
| Sidebar list gap | `gap-2` (8px) |
| KPI card padding | **16px** (`p-4`) — decía 17 |
| KPI label | text style `Label/Micro` — 10px SemiBold, uppercase, tracking 0.5px |
| KPI value | text style `Amount/Hero` — **28px** SemiBold — decía 20 |
| SectionCard title | text style `Heading/Group` — **16px** SemiBold — decía 14 |
| IBC chip | `border border-[var(--border)] rounded-lg px-2 py-1` |

Text styles are named in Figma and listed in `design-system/foundations/typography.html`.
They are no longer described by family + weight here, because the family changed once
and every hardcoded mention of it went stale at the same time.

---

## Component Library: shadcn/ui

**All UI components must be based on shadcn/ui** as the primary source.

- Before building a new component, check if it exists at [ui.shadcn.com/docs](https://ui.shadcn.com/docs).
- If it exists: install with `npx shadcn@latest add <component>` and extend as needed.
- If it doesn't exist in shadcn: build using **Radix UI** primitives and apply system tokens.
- Never replace a shadcn component with a custom implementation without documenting the reason.

Custom components in `src/components/ui/` that extend shadcn:
- `Badge` — `tone` × `variant` (see *Account badges* below; the per-account variants are gone)
- `SectionCard` — card with a standardized header and a `Content` slot
- `DatePicker` — Popover + Calendar wrapper
- `MoneyInput` — input with automatic locale formatting
- `Empty` — composed empty state

> `DatePicker` and `MoneyInput` still ship in code but were **retired from the Figma library**, so
> there is no drawn spec to check them against. Anything you change there is a code decision;
> raise it with Design if it should come back into the library.

---

## Token architecture

**Values live in Figma and are generated into this repo. They are not written here.**

```
design-system/tokens/tokens.json      raw export, both modes
design-system/tokens/tokens.css       CSS custom properties
design-system/tokens/tokens.map.css   bridge to the names src/index.css uses
```

This document describes *how to use* tokens in this codebase. It deliberately contains no
colour values: a second copy of the values is a second source of truth, and that is exactly
the drift this system spent a full audit removing.

### Three collections, not three layers

Figma holds four variable collections. Three of them carry colour and spacing:

```
Primitives  ──►  Semantic  ──►  Component
raw ramps        general design    internal to one component
```

- **Primitives** — `color/slate/500`, `spacing/12`. Raw, complete, and **never referenced directly**.
- **Semantic** — `surface/wrap/card`, `foreground/subtle`, `interactive/primary`, `spacing/16`, `radius/xl`.
  This is the layer you design and build with. It carries Light and Dark modes.
- **Component** — `button/filled/background/default`, `input/color/border/focus`.
  Private to the component that names them. **These may alias Primitives directly** — that is
  correct, not a layering violation.

The rule that matters: **a node must never bind to a Primitive.** A Component token aliasing a
Primitive is fine. A component's background reaching past two layers to grab `color/cyan/600`
is not — it will not follow the theme.

Full explanation: `design-system/docs/01-token-layers.md`.

**Open handoff:** values still pending in `src/index.css` are tracked in
`design-system/docs/05-handoff-tokens.md`. That file is the executable list — this one is
the reasoning behind it.

### How the app consumes them

**This is wired up.** `src/index.css` imports both generated files at the top (lines 8–9):

```css
@import "../design-system/tokens/tokens.css";
@import "../design-system/tokens/tokens.map.css";
```

So the app reads Figma's values through the bridge, and `index.css` no longer declares colour of
its own — `R4` in `validate-repo.mjs` fails the build if it starts again.

Four variables still have **no counterpart** and are listed under `NO EQUIVALENT` at the end of
`tokens.map.css`: `--font-sans`, `--font-mono`, `--font-heading` and `--radius`. Each needs a
decision rather than a mapping — the fonts because the app still ships Inter Variable while Figma
resolves to Rethink Sans, and `--radius` because the app derives every radius from one base with
`calc()` while Figma has a named scale.

### Domain token shape

The three-slot pattern still holds for financial and category tokens. **These `--color-*` names
are not Figma's** — they are the app's older vocabulary, kept alive by `tokens.map.css`, which
points each one at the generated token (`--color-income: var(--kpi-income-default)`). Use them in
`src/**` as documented; do not look for them in `tokens.css`, and never add a new one to the
bridge without a Figma token behind it.

```
--color-{role}      saturated: icons, chart fills, dots
--color-{role}-bg   tinted: badge and chip backgrounds
--color-{role}-txt  accessible text on that bg
```

| Suffix | Use for | Required contrast |
|--------|---------|-------------------|
| (none) | Chart fills, bars, icons | ≥ 3:1 against background (WCAG UI) |
| `-bg` | Badge/chip backgrounds | none (decorative) |
| `-txt` | Text on that background | ≥ 4.5:1 (WCAG AA) |

Expense categories use `--cat-{id}` / `--cat-{id}-bg` and map 1:1 with `EGRESO_CATEGORIAS`.
There are **14** of them — the document said 15. Figma carries a fifteenth ramp,
`category/savings/*`, which is **not** an expense category: it belongs to the savings domain and
has no entry in `EGRESO_CATEGORIAS`. Do not reach for it from a category lookup. In dark mode every category surface is the `-950` tint and its text
the `-300`, with two documented exceptions: `connectivity` and `other` stay lighter, because
their neutral `-950` is indistinguishable from the page background.

**Dark mode is not an inversion.** Domain tokens are re-declared under `.dark {}`; components
need no dark-mode logic. Anything bound to a raw value will simply not follow.

### The `cv()` bridge function

```js
// tailwind.config.js
const cv = (v) => ({ opacityValue }) =>
  opacityValue !== undefined
    ? `color-mix(in oklch, var(${v}) ${Math.round(opacityValue * 100)}%, transparent)`
    : `var(${v})`
```

Tailwind v3 wraps colour values in `hsl()`, which breaks anything that is not HSL. `cv()`
bypasses it by returning `var(--token)` directly. Use `cv()` for **any** token registered in
`tailwind.config.js`.

> Historical note: this helper was written when the palette was oklch. The palette is hex now,
> but the wrapper problem is the same and `color-mix` still resolves correctly, so it stays.

---

## Principles

1. **Semantics over appearance** — tokens describe *purpose*, not colour. `--color-expense`,
   never `--n-pink`. A palette change must not touch a component.

2. **Never skip a layer** — components consume Semantic or their own Component tokens. Never a
   Primitive, never a literal.

3. **Tailwind as shorthand** — classes are fine as long as they resolve to a token
   (`bg-muted`, `text-foreground`). Never `text-[#0e7490]`.

4. **Cyan is reserved for selected state and focus ring.** Hover is neutral. Two cyan states
   side by side read as two selections.

---

## Typography

**One family: Rethink Sans.** It replaced the Inter + Geist Mono pair in August 2026.

| Variable | Value |
|----------|-------|
| `--font-sans` | Rethink Sans |
| `--font-mono` | *(retired — see below)* |
| `--font-heading` | *(retired — was an alias of `--font-mono`)* |

### Why the monospace face is gone

Monetary figures used Geist Mono so they would not jitter as values changed. Measured at 20px,
ten digits wide:

| Family | `1111111111` | `0000000000` | `8888888888` | Tabular |
|---|---|---|---|---|
| **Rethink Sans** | 118 | 118 | 118 | **yes, by default** |
| Geist Mono | 120 | 120 | 120 | yes |
| Inter | 97 | 134 | 130 | **no** |

Rethink Sans is already tabular, so the second family was doing nothing the first does not.

**Keep `tabular-nums` in the class list.** It is a no-op today and it is the guard if the family
ever changes again. What changes is the rule's *reason*, not its shape:

> All monetary values use `tabular-nums`. The `font-heading` half of the old rule no longer
> applies — there is nothing to switch to.

Monetary figures are ~17% narrower than before (119px vs 144px for `$4.012.550,75`). Dense
tables and KPI strips have more room, not less.

### Type scale

**27** text styles in 6 semantic groups, named by *what the text is* rather than how large it is:

| Group | For |
|---|---|
| `Heading/` | Display · Section · Subsection · Card · Group |
| `Body/` | running text, ±Emphasis at two sizes |
| `Detail/` | metadata: Large 12 · Large-Strong 12 · Base 11 · Emphasis 11 · Nano 10 |
| `Label/` | Base · Micro (the KPI label) · Badge |
| `Amount/` | Hero · Large · Base · Small · Micro — monetary figures |
| `Control/` | XS–XL, line height 100% for single-line control labels |

Two rules that keep the scale from doubling in size:

- **Emphasis in running text is Medium, never SemiBold.** SemiBold belongs to headers and figures.
  One rung above Medium exists and is called **`-Strong`**, not `-Emphasis`: `Detail/Large-Strong`
  (12/18 Bold) is the account meta row. The word *Emphasis* means Medium everywhere in this scale,
  so a heavier rung needed a different word rather than a second meaning.
- **There are no input text styles.** Text inside a field *is* body text.

`Amount/` exists as its own group even where its metrics repeat `Body/` and `Heading/`, because
in a finance app the figures must be able to change without dragging the rest of the system.

Full reference: `design-system/docs/03-typography.md` and `design-system/foundations/typography.html`.

### Tailwind size classes

| Class | rem | Computed | Use for |
|-------|-----|----------|---------|
| `text-2xs` | 0.625rem | 10px | Timestamps, collapsed labels |
| `text-xs` | 0.75rem | 12px | Badges, metadata, filter labels |
| `text-sm` | 0.875rem | **14px** | **Default body text** |
| `text-base` | 1rem | 16px | Card headers, section titles |
| `text-lg`+ | ≥1.125rem | ≥18px | View titles only |

> `body` is set to `font-size: 14px`, but `rem` resolves against `html`, not `body`. The root
> stays at the browser default of 16px, so `text-sm` computes to **14px** — not 12.25px as an
> earlier version of this document claimed.

---

## Spacing & Sizing Scale

### Form elements (always consistent within a row)

| Context | Height class | px | When to use |
|---------|--------------|----|-------------|
| Standard | `h-9` | 36px | All form inputs (default) |
| Compact | `h-7` | 28px | Filter bars, inline selects |
| Icon | `h-8` | 32px | Icon-only buttons, small actions |

**Rule:** All form elements within the same row must share the same height class. `h-9` aligns `field-input`, `SelectTrigger`, `DatePicker`, and `MoneyInput`.

### Component spacing

| Pattern | Value | Use for |
|---------|-------|---------|
| Card padding | `p-4` / `p-5` | SectionCard content area |
| Row padding | `py-2` / `py-[9px]` | List rows (income, expense, transfers) |
| Gap between rows | `gap-2` or `border-b` | Use `border-b` for scannable lists |
| Filter bar | `px-4 py-2` | Filter/sort bars |

### Z-index scale (these values only)

```
z-10    Sidebar, dropdowns within page context
z-50    Modals, sheets, overlays
z-[100] Toast notifications
```

---

## Tailwind + shadcn Integration Rules

### Rule 1: shadcn component heights use `size` prop, not `h-*`

`SelectTrigger`, `Button`, and other shadcn components control height via `data-[size=...]` CSS attributes, not Tailwind classes. Passing `h-7` in `className` creates a conflict that `tailwind-merge` cannot resolve because data-attribute conditionals have higher specificity.

```tsx
// ❌ Wrong — h-7 may not apply
<SelectTrigger className="h-7 text-xs">

// ✅ Correct — uses the component's size system
<SelectTrigger size="sm">

// ✅ Also correct — bypasses data-[size] entirely
<SelectTrigger data-size="none" className="h-7 text-xs">
```

Use `data-size="none"` when you need a custom height that differs from the component's predefined sizes.

**Note:** `size="sm"` also changes border-radius (applies `data-[size=sm]:rounded-[min(var(--radius-md),10px)]`). If only the height needs to change, use `data-size="none"`.

### Rule 2: Domain tokens use `var()` in arbitrary classes

Domain tokens are intentionally NOT in `tailwind.config.js`. This makes domain token usage explicit and visually distinct in code from design system tokens.

```tsx
// ✅ Domain token — explicit, readable
<div className="bg-[var(--color-income-bg)] text-[var(--color-income-txt)]">

// ✅ Shadcn base token — via Tailwind utility
<div className="bg-muted text-muted-foreground">

// ❌ Never hardcode a colour inline
<div style={{ backgroundColor: '#0e7490' }}>
```

### Rule 3: shadcn v4 components require conversion for Tailwind v3

shadcn components are increasingly published with Tailwind v4 syntax. When installing, audit and convert:

| v4 syntax | v3 equivalent |
|-----------|---------------|
| `w-(--sidebar-width)` | `w-[var(--sidebar-width)]` |
| `h-(--var)` | `h-[var(--var)]` |
| `(--spacing(4))` | `1rem` |
| `max-w-(--var)` | `max-w-[var(--var)]` |

Run after any `npx shadcn@latest add`:
```bash
grep -r "w-(\|h-(" src/components/ui/
```

### Rule 4: Never override shadcn internals via CSS cascade

If a shadcn component isn't composable enough, extend it with a wrapper component rather than forcing overrides with `!important` or specificity hacks.

```tsx
// ✅ Extend with a wrapper
function CompactSelect(props) {
  return <SelectTrigger data-size="none" className="h-7" {...props} />
}
```

### Rule 5: One TooltipProvider in App.tsx

`TooltipProvider` lives once in `App.tsx`. Never instantiate it inside a component. `SidebarMenuButton` receives `tooltip` only when `state === 'collapsed'` — never pass `tooltip` when expanded because the `hidden` prop on `TooltipContent` doesn't reliably suppress the Radix portal. Correct pattern: sub-components that call `useSidebar()` and conditionally pass `tooltip`:

```tsx
function NavButton({ label, ... }) {
  const { state } = useSidebar()
  return (
    <SidebarMenuButton tooltip={state === 'collapsed' ? label : undefined}>
      ...
    </SidebarMenuButton>
  )
}
```

---

## Component Patterns

### List rows (income, expense, transfers)

```
flex items-center gap-2 py-2 border-b border-[var(--border)] last:border-0
│ icon (16px, shrink-0) │ content (flex-1 min-w-0) │ amount (shrink-0) │ actions (shrink-0) │
```

- **Actions:** always visible, never hidden on hover. `Button variant="ghost" size="icon-sm"` for edit/delete.
- **Delete:** two-tap confirm (first tap → `¿Eliminar?`, second tap → deletes). Never instant delete.

### Destructive confirmation pattern

```tsx
<Button
  variant={isPending ? 'destructive' : 'ghost'}
  size={isPending ? 'sm' : 'icon-sm'}
  className={!isPending ? 'hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)]' : ''}
>
  {isPending ? '¿Eliminar?' : <Trash2 size={12} />}
</Button>
```

### Monetary amounts

`font-heading` is **retired** — it aliased `--font-mono`, which no longer exists. Zero components
still use it; the old rule in this document was the last place it survived. Use the generated
`.ts-amount-*` class, which carries size, weight and `tabular-nums` together:

```tsx
// The figure
<span className="ts-amount-base">{COP(amount)}</span>
// USD converted to COP as the secondary line under it
<div className="ts-amount-micro text-muted-foreground">{COP(amount * trm)}</div>
```

`Amount/` runs Hero 28 · Large 22 · Base 16 · Small 14 · Micro 12. `tabular-nums` is already in
every one of those classes — keep it there rather than at the call site.

### Account badges

**The per-account variants are gone.** `arq`, `toptal`, `bancol`, `ss` were a variant per real
account, so adding an account meant editing the design system. `--color-account-{type}-bg` and
`-txt` do not exist either.

What replaces them:

- `Badge` takes **`tone`** (what the thing is) × **`variant`** (`filled` | `outline`). Neither
  names an account.
- The account's own colour lives **on the account**, from the `account/{color}/*` ramps, and is
  rendered by `AccountAvatar` — one of purple · sky · emerald · lime · amber · pink, chosen by the
  user in the colour picker.
- Currency is its own component, `CurrencyBadge`, not a tone.

### Sheet forms

All fields use `.field-label` + `.field-input` CSS classes or shadcn equivalents at `h-9`.
`DatePicker` base is `h-9`. Override with `className="h-7 text-xs"` in compact contexts.

---

## Filter Bars

Consistent pattern across all cards with filterable lists:

```
px-4 py-2 flex items-center gap-2 border-b border-[var(--border)]
│ account Select (data-size="none" h-7) │ DatePicker (h-7) │ sort Select (data-size="none" h-7) │
```

All three elements must be `h-7`. `SelectTrigger` with `data-size="none"` when built-in sizes don't match.

### Compact sort select with text

```tsx
<SelectTrigger data-size="none" className="h-7 w-auto px-2 gap-1.5 text-xs border-transparent bg-transparent hover:bg-[var(--accent)]">
  <ArrowUpDown size={12} className="text-muted-foreground shrink-0" />
  <SelectValue />
</SelectTrigger>
```

---

## Sidebar

shadcn Sidebar with `collapsible="icon"`. Critical constraints:

1. **Tailwind v3 compatibility**: The installed `sidebar.tsx` uses v4 CSS variable shorthand. Always convert after install (see Rule 3).
2. **Tooltip on collapse**: `SidebarMenuButton` receives `tooltip` only when `state === 'collapsed'`. Do not pass tooltip when expanded — the `hidden` prop on `TooltipContent` doesn't reliably suppress the Radix portal.
3. **Fixed → Absolute**: The sidebar container is modified to `absolute inset-y-0` (instead of `fixed`) to respect the app layout with a header above. `SidebarProvider` needs a `relative h-full` ancestor.
4. **Mobile**: Sidebar is `hidden md:block`. Mobile navigation is `Sidebar_MobileNav`, not the
   shadcn mobile Sheet. Its Figma spec is `bottom-nav` (`1122:8`) — see below; it is **not** a
   fixed edge-to-edge bar.

---

## Mobile tab bar

`bottom-nav` (`1122:8`), two states. It is a **floating capsule**, not the edge of the screen —
the iOS 26 shape, per Apple's HIG for tab bars.

| | `State=Expanded` | `State=Minimized` |
|---|---|---|
| size | 370 × 58 | 58 × 58 |
| inset | 21 from left, right and bottom | the same 21 |
| content | four tabs, 86.5 each | only the current tab, as a round button |

Five rules that get implemented wrong when they are not written down:

1. **Two to five tabs, and a tab is a destination, never an action.** There are four. The `+`
   lives in the FAB above the bar, not in it.
2. **Colour is the whole selected state** — `fg/brand` on icon and label, `fg/subtle` on the rest.
   No pill, no underline, no background behind the active tab. In the minimized state colour is
   the only thing left saying where you are.
3. **The 21 band at the bottom belongs to the bar.** No other fixed element lives there; content
   scrolls under the capsule rather than stopping against it.
4. **It minimizes on scroll down** (`tabBarMinimizeBehavior(.onScrollDown)` on iOS; by hand in the
   PWA) and expands on return to top or on tap. Long-press and swipe moves between tabs without
   expanding.
5. **Labels are `Control/XS` at 10.** Apple specifies 11; this is the one point where the bar
   departs from the HIG on purpose.

Elevation is `elevation/floating`, the system's own pair — never a hand-written shadow.

---

## Motion & Animation

Transitions are functional, never decorative.

**Durations and curves are tokens, and `R5` in `validate-repo.mjs` fails on a literal.** Never
write `150ms` or `cubic-bezier(...)` in a component.

| Property | Token | Value | Where |
|----------|-------|-------|-------|
| colors | `--motion-duration-fast` · `--motion-easing-move` | 150ms · `cubic-bezier(.4,0,.2,1)` | Hover, active states |
| width/height | `--motion-duration-moderate` · `--motion-easing-move` | 200ms | Sidebar collapse, row expand |
| enter (popover, tooltip, sheet) | `--motion-duration-fast` · `--motion-easing-enter` | 150ms · `cubic-bezier(.16,1,.3,1)` | Radix enter |
| exit | `--motion-duration-fast` · `--motion-easing-exit` | 150ms · `cubic-bezier(.4,0,1,1)` | Radix exit |
| transform | `--motion-duration-instant` | 100ms | `active:scale-95` on buttons |
| spinner | `--motion-duration-spin` · `--motion-easing-spin` | 1000ms · linear | `Spinner` |

`--motion-duration-slow` (300ms) exists and has no consumer; it is the rung above `moderate`, not
a default.

`tw-animate-css` provides `animate-in`/`animate-out` for Radix popover/tooltip enter/exit.

---

## Correct vs. Incorrect Usage

### ✅ Correct

```tsx
// Domain token
<span className="text-[var(--color-expense)]">...</span>
<div className="bg-[var(--color-provision-bg)]">...</div>

// Shadcn base token via Tailwind utility
<p className="text-muted-foreground">...</p>
<div className="bg-card border border-border">...</div>

// Placeholder / tertiary text
<span className="text-[var(--fg-placeholder)]">...</span>
```

### ❌ Incorrect

```tsx
// Hardcoded primitive value
<span style={{ color: '#dc2626' }}>...</span>

// Non-semantic color token
<span className="text-[var(--n-pink)]">...</span>

// Hardcoded Tailwind color without token
<div className="bg-rose-100 text-rose-700">...</div>

// h-* on SelectTrigger without data-size="none"
<SelectTrigger className="h-7">  {/* won't apply */}

// Nested var() — invalid CSS
<div style={{ color: 'var(var(--color-income))' }}>
```

---

## Anti-patterns

| Anti-pattern | Why | Instead |
|--------------|-----|---------|
| `style={{ color: '#...' }}` inline | Breaks dark mode, not themeable | Use a CSS token |
| `opacity-0 group-hover:opacity-100` on actions | Actions invisible by default | Always visible with `size="icon-sm"` |
| `h-*` override on shadcn SelectTrigger | Lost to data-attribute specificity | `size="sm"` or `data-size="none"` |
| shadcn v4 syntax (`w-(--var)`) without conversion | Compiles to nothing in Tailwind v3 | Convert to `w-[var(--var)]` |
| `TooltipProvider` inside a component | Creates nested providers | Single instance in `App.tsx` |
| Drag & drop for list reordering | Poor mobile UX, complex state | Sort select with semantic options |
| `!important` in component className props | Defeats the cascade intentionally | Fix the root cause (data-attribute) |
| Hardcoded pixel values for spacing | Not responsive, not systematic | Use Tailwind scale or `--radius` |

---

## Checklist: New Component

Before committing any new UI component:

- [ ] Colours come from Semantic or Component tokens — never a Primitive, never a literal
- [ ] Monetary values use a `.ts-amount-*` class (which already carries `tabular-nums`)
- [ ] Form elements at `h-9` (or `h-7` for compact), consistent within row
- [ ] Destructive actions have two-tap confirm pattern
- [ ] Row actions are always visible (no `opacity-0`)
- [ ] No `var(var(--token))` double-wrapping
- [ ] shadcn component heights controlled via `size` prop or `data-size`, not `h-*` className
- [ ] Dark mode tested (toggle with sun/moon in header)
- [ ] No inline colour literals
- [ ] TypeScript: `npx tsc --noEmit` passes clean

---

## Deductions — color by group

Items in `deductions.ts` carry a `color: string` field referencing a domain token:

| Group | Token |
|-------|-------|
| Social Security | `--color-income` |
| Income tax retention | `--color-tax` |
| Primas / Cesantías / Vacaciones | `--color-provision` |
| Custom | `--color-provision` (default) |

---

## Changelog

| Version | Change |
|---------|--------|
| v1 | `--n-*` tokens — color names, not purpose |
| v2 | Migration to `--color-{semantic}` — domain names |
| v3 | Tailwind+shadcn rules, form heights, component patterns, anti-patterns, checklist |
| v4 | Translated to English |
| v5 | Token architecture rewritten against the real Figma structure (Primitives → Semantic → Component). Values moved out of this document into `design-system/tokens/`, generated. Typography collapsed to one family, Rethink Sans. Type scale replaced by 26 named text styles. Fixed the `text-sm` arithmetic — it computes to 14px, not 12.25px. |
| v6 | **Staleness pass, 2026-09-12** — 42 days since v5, against a `design-system/` that moved on 09-07. Eleven claims were wrong, each re-measured: the token imports **are** wired up (`index.css` 8–9), `Badge`'s per-account variants are gone, `font-heading` is retired and this document was its last consumer, `--n-txt3` and `--color-account-*` do not exist, the node table pointed at exploration frames instead of components, `Detail/` sizes were a rung low across all four, 27 text styles not 26, 14 expense categories not 15 (`category/savings/*` is not one), KPI padding 16 not 17, `Amount/Hero` 28 not 20, `Heading/Group` 16 not 14, sidebar item radius 16 not 12. Added: the mobile tab bar, motion as tokens, and `-Strong` as the rung above `-Emphasis`. Not re-verified in this pass and still carried from v5: the dark-mode category rule (`-950` surface / `-300` text with `connectivity` and `other` as exceptions) and the tabular-width measurements. |
