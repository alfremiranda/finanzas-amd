/**
 * Dimming the items you are NOT hovering, in a distribution bar and its legend.
 *
 * It is two values and not one, because the gesture falls on two different kinds of object.
 *
 * The swatch and the bar segment are where colour IS the encoding. While dimmed they are not
 * the ones carrying the message — the highlighted one is — so they can go far down, and 30%
 * is where the retreat reads clearly.
 *
 * The label and the figure are text the user is reading AT THAT MOMENT, since dimming is what
 * happens while the pointer is over the bar. `fg/subtle` composited on `bg/surface-default`
 * measures 1.69:1 at 30% and 2.07:1 at 40% — against the 4.5:1 that text of this size needs.
 * Both of the values this code used to carry failed, in both modes. 75% measures 4.73:1 light
 * and 6.76:1 dark, and still reads as "this is not the one you are looking at": the retreat is
 * carried by the swatch beside it, which has already dropped to 30%.
 *
 * INTERIM: these are literals until Design mints the pair (A-2026-09-12). The value is settled
 * by the measurement above; only the token name is open.
 */
export const DIM_SWATCH = 'opacity-30'
export const DIM_TEXT = 'opacity-75'
