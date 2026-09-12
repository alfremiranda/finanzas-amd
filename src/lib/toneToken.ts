/**
 * The text colour that corresponds to a semantic FILL colour.
 *
 * Every tone in this system has two rungs, and they are not interchangeable. The fill token
 * is tuned to be read as an area — a bar segment, a donut arc, an avatar disc — where WCAG
 * asks for 3:1. The `-txt` token is a darker rung tuned to be read as words, where it asks
 * for 4.5:1. On a card in light mode `--color-expense` measures 3.44:1 and
 * `--color-expense-txt` measures 5.91:1, so using the fill for a figure fails by a margin
 * that no amount of size compensates for.
 *
 * This exists as a function rather than a rule in each component because the tone is often
 * NOT a literal: a provision's colour comes from whatever the user configured for that
 * deduction, so the call site has a variable, not a class it could have written correctly.
 * That is exactly the case that was failing.
 *
 * Tokens with no text rung pass through unchanged, so an unknown tone degrades to what it
 * already was rather than to nothing.
 */
const TO_TXT: Record<string, string> = {
  '--color-provision': '--color-provision-txt',
  '--color-expense':   '--color-expense-txt',
  '--color-tax':       '--color-tax-txt',
  '--color-net':       '--color-net-txt',
  '--color-income':    '--color-income-txt',
  '--color-danger':    '--color-danger-txt',
}

export function toTextToken(token: string): string {
  return TO_TXT[token] ?? token
}
