export function COP(n: number): string {
  // The sign goes outside the symbol. Prefixing '$' to a negative number produces
  // "$-45.311.067", which reads as a corrupted amount rather than a negative one. It only
  // became visible when the annual net stopped being clamped at zero.
  const v = Math.round(n)
  return (v < 0 ? '-$' : '$') + Math.abs(v).toLocaleString('es-CO')
}

export function USD(n: number): string {
  const v = Math.round(n * 100) / 100
  return (v < 0 ? '-USD ' : 'USD ') + Math.abs(v).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function pct(a: number, b: number): string {
  return b > 0 ? Math.round(a / b * 100) + '%' : '0%'
}

export function copFormat(n: number): string {
  return n > 0 ? Math.round(n).toLocaleString('es-CO') : ''
}

export function parseCOP(str: string): number {
  return parseInt(String(str).replace(/\D/g, '')) || 0
}

export function parseMoney(str: string): number {
  return parseFloat(String(str).replace(/\./g, '').replace(',', '.')) || 0
}

export function formatMoney(n: number, decimals: number): string {
  return n.toLocaleString('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

const MONTHS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export function fmtDate(iso: string): string {
  const parts = iso.split('-')
  const m = parseInt(parts[1] ?? '0', 10) - 1
  const d = parseInt(parts[2] ?? '0', 10)
  if (!d) return ''
  return `${MONTHS_SHORT[m] ?? ''} ${d}`
}

export function localToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * An amount abbreviated to fit somewhere it otherwise cannot: up to two decimals, a
 * lowercase unit, and the comma decimal separator the rest of the app uses (es-CO).
 *
 *   $54,57 m   millions
 *   $1,20 k    thousands
 *
 * It exists because a year's gross written in full is eleven digits inside a 160px circle:
 * it either shrinks until it stops being the headline, or it breaks onto two lines.
 *
 * Deliberately NOT used on chart axes. An axis is a scale you read AGAINST — it stays
 * `$12M`, uppercase and without decimals — while this is the figure you read. Two different
 * jobs, and unifying them would make the headline look like a tick.
 */
export function COPShort(n: number): string {
  const sign = n < 0 ? '-' : ''
  // The unit is chosen against the ROUNDED figure, not the raw one: 999.999 rounds to
  // 1.000,00 at two decimals, and "$1.000,00 k" is a number nobody wants to read.
  const abs = Math.round(Math.abs(n) / 10) * 10
  const [value, unit] =
    abs >= 1_000_000 ? [abs / 1_000_000, ' m'] :
    abs >= 1_000     ? [abs / 1_000,     ' k'] :
    [abs, '']
  const body = unit
    ? value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(value).toLocaleString('es-CO')
  return `${sign}$${body}${unit}`
}
