import { describe, it, expect } from 'vitest'
import { COP, COPShort, USD } from './format'

describe('formato de moneda', () => {
  it('pone el signo fuera del símbolo', () => {
    // "$-45.311.067" reads as a corrupted amount, not a negative one.
    expect(COP(-45_311_067)).toBe('-$45.311.067')
    expect(USD(-1234.5)).toBe('-USD 1.234,50')
  })

  it('no cambia los positivos ni el cero', () => {
    expect(COP(45_311_067)).toBe('$45.311.067')
    expect(COP(0)).toBe('$0')
    expect(USD(1234.5)).toBe('USD 1.234,50')
    expect(USD(0)).toBe('USD 0,00')
  })

  it('no produce "-$0" al redondear un negativo diminuto', () => {
    // Math.round(-0.4) is -0 in JS, and -0 < 0 is false, so this stays "$0".
    expect(COP(-0.4)).toBe('$0')
    expect(USD(-0.001)).toBe('USD 0,00')
  })
})

describe('COPShort', () => {
  it('abbreviates millions with a lowercase unit and a comma decimal', () => {
    expect(COPShort(54_570_000)).toBe('$54,57 m')
  })

  it('abbreviates thousands, keeping both decimals rather than trimming the zero', () => {
    // "$1,2 k" would read as a different precision than "$54,57 m" beside it.
    expect(COPShort(1_200)).toBe('$1,20 k')
  })

  it('leaves anything under a thousand whole — there is nothing to save', () => {
    expect(COPShort(940)).toBe('$940')
  })

  it('puts the sign outside the symbol, like COP does', () => {
    // '$-54,57 m' reads as a corrupted amount rather than a negative one.
    expect(COPShort(-54_570_000)).toBe('-$54,57 m')
  })

  it('promotes to the next unit when rounding would otherwise print four digits', () => {
    // 999.999 rounds to 1.000,00 at two decimals, and "$1.000,00 k" is unreadable.
    expect(COPShort(999_999)).toBe('$1,00 m')
  })

  it('crosses into millions at exactly one million', () => {
    expect(COPShort(1_000_000)).toBe('$1,00 m')
  })

  it('is zero, not an empty string', () => {
    expect(COPShort(0)).toBe('$0')
  })
})
