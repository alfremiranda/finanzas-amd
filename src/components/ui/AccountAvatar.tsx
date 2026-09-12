import { Landmark, Coins, CreditCard, PiggyBank } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { accountColor, accountColorVars } from '@/lib/accountColor'
import type { Account } from '@/types'

/**
 * An account's avatar: a tinted circle in `account/<hue>/surface` with the
 * account-type glyph in `account/<hue>/accent`
 * (design-system/docs/25-account-color.md §2).
 *
 * The colour paints the avatar and nothing else. That boundary is what makes
 * twelve hues safe: Neto already spends colour on meaning — cyan is brand and
 * net, red is expense and danger, emerald is provision, amber is tax — and an
 * identity colour confined to a small circle never shares a surface with a
 * number, so it cannot be read as one.
 *
 * It also never carries meaning alone. Twelve hues out of the fourteen left
 * over force 11° neighbours, so the account's label always travels with it
 * (WCAG 1.4.1, and §3's measurement).
 */
const avatarVariants = cva(
  'shrink-0 inline-flex items-center justify-center rounded-full bg-[var(--account-surface)] text-[var(--account-accent)]',
  {
    variants: {
      size: { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-10 h-10' },
    },
    defaultVariants: { size: 'md' },
  },
)

const GLYPH_SIZE = { sm: 12, md: 15, lg: 18 } as const

const TYPE_GLYPH = {
  credit: CreditCard,
  savings: PiggyBank,
  cash: Coins,
  account: Landmark,
} as const

/**
 * The account-type glyph on its own — Figma's `Icon Account`, which is a component in its
 * own right and not a part of the avatar.
 *
 * The avatar is the glyph plus a tinted disc, and the disc is what carries the identity
 * colour. That pairing earns its keep in the grid, where the colour is what tells one tile
 * from another at a glance. Inside an account page it does not: you already know which
 * account you are in, and the disc then competes with the title for the same corner of the
 * eye. So the page header takes the glyph bare.
 */
export function AccountGlyph({ type, size = 16, className }: {
  type?: Account['type']
  size?: number
  className?: string
}) {
  const Glyph = TYPE_GLYPH[type ?? 'account']
  return <Glyph aria-hidden="true" size={size} strokeWidth={2} className={className} />
}

type AccountAvatarProps = Omit<React.ComponentProps<'span'>, 'color'> &
  VariantProps<typeof avatarVariants> & {
    account: Pick<Account, 'id' | 'type' | 'color'>
  }

export function AccountAvatar({ account, size = 'md', className, ...props }: AccountAvatarProps) {
  const Glyph = TYPE_GLYPH[account.type ?? 'account']
  return (
    <span
      // Decorative: every place this renders also shows the account's label, so
      // announcing the type glyph again would only repeat what is already read.
      aria-hidden="true"
      style={accountColorVars(accountColor(account))}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      <Glyph size={GLYPH_SIZE[size ?? 'md']} strokeWidth={2} />
    </span>
  )
}
