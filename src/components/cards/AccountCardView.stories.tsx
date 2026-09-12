import type { Meta, StoryObj } from '@storybook/react-vite'
import { AccountCardView } from './AccountCardView'
import type { Account } from '@/types'

const meta = { title: 'Cards/AccountCard', parameters: { layout: 'padded' } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

/**
 * Accounts are built here rather than seeded into the store on purpose: with an empty `db`,
 * `computeAccountBalance` returns `startingBalance` untouched, so every figure below is the
 * number written in this file. A story that depended on fixture months would drift whenever
 * the fixture did, and the baseline would report that as a component change.
 */
const base: Account = {
  id: 'acc_story', label: 'Bancolombia', currency: 'COP', type: 'account',
  number: '4821', rate: 4.5, startingBalance: 3_708_000, color: 'indigo',
}

const ACCOUNTS: Account[] = [
  { ...base },
  { ...base, id: 'acc_usd', label: 'ARQ (Observer Hub)', currency: 'USD', number: '', rate: 0,
    startingBalance: 13_000, favorite: true, color: 'purple' },
  { ...base, id: 'acc_cash', label: 'Efectivo', type: 'cash', number: '', rate: 0,
    startingBalance: 340_000, color: 'rose' },
  { ...base, id: 'acc_credit', label: 'CMR Falabella', type: 'credit', number: '0205',
    rate: 0, startingBalance: -1_562_240, creditLimit: 2_000_000, cutoffDay: 4, dueDay: 14,
    color: 'pink' },
  { ...base, id: 'acc_savings', label: 'ARQ Savings', type: 'savings', savingsKind: 'cuenta',
    number: '', rate: 3.5, startingBalance: 6_162_000, color: 'emerald' },
]

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12, maxWidth: 820 }}>
    {children}
  </div>
)

/**
 * ## Acceptance criteria
 *
 * - **Four types, four headlines.** Bank and cash show the balance; savings shows it with its
 *   yield line; a credit card shows what is left to SPEND, not the limit. The limit never
 *   moves, so on the compact tile — where the debt and %-used lines are hidden — a card
 *   showing it looked like it ignored every purchase.
 * - **4px between the meta row and the amount, and none below it.** The amount and its
 *   sub-lines are one group: the yield, the debt and the %-used belong to the figure above
 *   them, so the gap lives on the parent and not between every child.
 * - **`Amount/Large`, not `Amount/Hero`.** At 28 the figure did not fit its own card — 27px of
 *   overflow at two columns on a phone — which is what made the tile abbreviate for a while.
 *   At 22 a full COP figure needs 113px against 139 available.
 * - **Default sits on `bg/surface-subtle`**, a rung above the page rather than on the card
 *   surface the grid's own container uses.
 * - **Hover marks with `border/strong`, a neutral.** The brand tint said "this one is chosen",
 *   which is Selected's job — on a touch device the two read alike.
 * - **The type is readable without being visible.** Alfredo hid it in Figma, so the meta line
 *   is currency and number; the type survives as an `sr-only` line, because its only other
 *   carrier is the avatar glyph and that is `aria-hidden`.
 * - **The whole card is the control**, with `role="button"`, Enter/Space and `aria-pressed`.
 *   `Editar` is a second button inside it and stops propagation.
 *
 * **Not covered here, deliberately:** a CDT's `Vence en N d` countdown. It is computed from
 * `new Date()`, so any baseline holding it would change every day and report a component
 * change that never happened. The rest of the savings shape is covered by `ARQ Savings`.
 */
export const Types: Story = {
  render: () => (
    <Grid>
      {ACCOUNTS.map(a => <AccountCardView key={a.id} account={a} />)}
    </Grid>
  ),
}

/** The compact tile pinned on Resumen: meta and amount only, no sub-lines and no `Editar`. */
export const Compact: Story = {
  render: () => (
    <Grid>
      {ACCOUNTS.map(a => <AccountCardView key={a.id} account={a} size="sm" />)}
    </Grid>
  ),
}

/**
 * Selected against default, side by side — the comparison the state has to survive.
 *
 * Design reported the fill as invisible at 1.01 and concluded the 2px border is the only thing
 * marking selection. The number checks out — `bg/income-subtle` measured 1.007 against the card
 * surface it used to sit on — but the conclusion needs narrowing, because this story shows the
 * tint plainly.
 *
 * **A contrast ratio measures luminance, and this difference is hue.** `#eff6ff` against
 * `#fdfefe` is 1.077: almost no luminance step, and a blue one. So it reads for most people and
 * disappears for anyone who cannot separate the hue, or in greyscale — which is 1.4.1, not
 * 1.4.11, and means the border really is carrying the state alone for them.
 *
 * Also worth fixing for a different reason: `bg/income-subtle` means money coming IN, on a card
 * whose whole subject is money. The system already has `bg/selected`.
 */
export const Selected: Story = {
  render: () => (
    <Grid>
      <AccountCardView account={ACCOUNTS[0]} />
      <AccountCardView account={ACCOUNTS[0]} selected />
    </Grid>
  ),
}

/** An account created but never configured: no `startingBalance`, so there is no figure to show. */
export const Unconfigured: Story = {
  render: () => (
    <Grid>
      <AccountCardView account={{ ...base, id: 'acc_new', label: 'Nequi', startingBalance: undefined }} />
    </Grid>
  ),
}
