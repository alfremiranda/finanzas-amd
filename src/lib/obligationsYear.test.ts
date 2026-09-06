import { describe, it, expect } from 'vitest'
import { ssByMonth } from '@/lib/obligationsYear'
import { DEFAULT_DEDUCTIONS } from '@/data/deductions'
import type { FinanceDB, MonthData, Income, Egreso } from '@/types'

const SMMLV = 1_750_905
const smmlvFn = () => SMMLV

const income = (): Income =>
  ({ id: 1, desc: 'Contrato', amount: 20_000_000, currency: 'COP', account: 'B', tipo: 'servicios' })
const month = (over: Partial<MonthData> = {}): MonthData =>
  ({ trm: 4000, incomes: [], egresos: [], transfers: [], ...over })
const pay = (amount: number, period: string, accrued: number): Egreso =>
  ({ id: Math.round(Math.random() * 1e6), desc: 'Pago', category: 'impuestos', amount,
     currency: 'COP', date: '2026-08-05', settles: { kind: 'ss', period, accrued } })

const OWED = 2_401_760   // SS on an IBC of 8M: 29.022% + the 1% bracket

describe('ssByMonth — the four states a month can be in', () => {
  const withIncome = () => month({ incomes: [income()] })

  it('upcoming: caused but not yet payable', () => {
    // Derived from today rather than hardcoded: "not yet due" is a fact about the clock,
    // and a fixed month would quietly become "pending" as soon as it passed — the same way
    // the calendar story drifted at midnight.
    const now = new Date()
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const db: FinanceDB = { [period]: withIncome() }
    const [r] = ssByMonth(db, now.getFullYear(), DEFAULT_DEDUCTIONS, smmlvFn)
    expect(r.state).toBe('upcoming')
    expect(r.owed).toBeCloseTo(OWED, 0)
  })

  it('pending: due and nothing paid', () => {
    // January of a past year is due whenever this runs.
    const db: FinanceDB = { '2024-01': withIncome() }
    expect(ssByMonth(db, 2024, DEFAULT_DEDUCTIONS, smmlvFn)[0].state).toBe('pending')
  })

  it('partial: due, something paid, something left — its own state, not "pendiente"', () => {
    // A month half paid reads very differently from one nobody has touched, and folding
    // both into one label hid that.
    const db: FinanceDB = {
      '2024-01': withIncome(),
      '2024-02': month({ egresos: [pay(1_000_000, '2024-01', OWED)] }),
    }
    const [r] = ssByMonth(db, 2024, DEFAULT_DEDUCTIONS, smmlvFn)
    expect(r.state).toBe('partial')
    expect(r.owed - r.paid).toBeCloseTo(OWED - 1_000_000, 0)
  })

  it('settled: paid within the PILA rounding tolerance', () => {
    const db: FinanceDB = {
      '2024-01': withIncome(),
      '2024-02': month({ egresos: [pay(OWED - 700, '2024-01', OWED)] }),
    }
    expect(ssByMonth(db, 2024, DEFAULT_DEDUCTIONS, smmlvFn)[0].state).toBe('settled')
  })

  it('stays settled when the rate is corrected afterwards', () => {
    // The frozen figure wins over the live one, so a TRM correction cannot reopen a month.
    const db: FinanceDB = {
      '2024-01': month({ trm: 4300, incomes: [income()] }),
      '2024-02': month({ egresos: [pay(OWED, '2024-01', OWED)] }),
    }
    expect(ssByMonth(db, 2024, DEFAULT_DEDUCTIONS, smmlvFn)[0].state).toBe('settled')
  })

  it('skips months that neither accrued nor were paid', () => {
    const db: FinanceDB = { '2024-01': withIncome(), '2024-03': month() }
    expect(ssByMonth(db, 2024, DEFAULT_DEDUCTIONS, smmlvFn).map(r => r.period)).toEqual(['2024-01'])
  })
})
