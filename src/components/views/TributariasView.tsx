import { useState } from 'react'
import { Landmark, PiggyBank, ChevronDown } from 'lucide-react'
import { useFinanceStore } from '@/store/financeStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useUIStore } from '@/store/uiStore'
import { COP, USD, fmtDate } from '@/lib/format'
import { MONTHS } from '@/data/defaults'
import { ssByMonth, retencionByYear } from '@/lib/obligationsYear'
import { settlementsFor } from '@/lib/obligations'
import { SectionCard } from '@/components/ui/SectionCard'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/Progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { cn } from '@/lib/utils'


/**
 * The page's own answer, above the two cards.
 *
 * The two figures are NOT summed, and that is the point. Social security is money owed to
 * an operator; retención is money that should be set ASIDE. A single total would assert a
 * debt that does not exist.
 *
 * The social security note counts overdue MONTHS rather than pesos: "two months late" is
 * the fact you act on, and the amount is already the figure beside it.
 */
function StatusStrip({ ssOwed, overdueMonths, ret }: {
  ssOwed: number
  overdueMonths: number
  ret: { accrued: number; reserved: number; gap: number }
}) {
  const pct = ret.accrued > 0 ? Math.round((ret.reserved / ret.accrued) * 100) : 0
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 flex flex-col sm:flex-row gap-4 sm:gap-0">
      <div className="flex-1 sm:pr-4">
        <div className="ts-label-micro uppercase text-muted-foreground/70">Seguridad social</div>
        <div className={cn('ts-amount-hero', ssOwed > 0 ? 'text-[var(--color-tax-txt)]' : 'text-foreground')}>
          {COP(ssOwed)}
        </div>
        <div className="ts-body-small text-muted-foreground">
          {overdueMonths === 0
            ? 'Al día'
            : `${overdueMonths} ${overdueMonths === 1 ? 'mes vencido' : 'meses vencidos'}`}
        </div>
      </div>
      <Separator orientation="vertical" className="hidden sm:block" />
      <div className="flex-1 sm:pl-4">
        <div className="ts-label-micro uppercase text-muted-foreground/70">Retención {new Date().getFullYear()}</div>
        <div className="ts-amount-hero text-foreground">{COP(ret.reserved)}</div>
        <div className="ts-body-small text-muted-foreground">
          {pct}% reservado de {COP(ret.accrued)}
        </div>
      </div>
    </div>
  )
}

/**
 * The tax obligations, read down a year instead of across a month.
 *
 * The month view answers "what do I owe now". This answers "am I up to date", which is a
 * different question and cannot be read a month at a time — social security is paid in
 * arrears and retención accrues all year against a single payment, so following either one
 * means seeing the whole run.
 */
export function TributariasView() {
  const { db, getSMMLV, setCurKey } = useFinanceStore()
  const deductions = useSettingsStore(s => s.deductions)
  const { setView, openSSPayment } = useUIStore()

  const years = [...new Set(
    Object.keys(db).filter(k => k !== '_settings').map(k => k.slice(0, 4)),
  )].sort().reverse()
  const [year, setYear] = useState(years[0] ?? String(new Date().getFullYear()))
  const [expanded, setExpanded] = useState<string | null>(null)

  const ss  = ssByMonth(db, Number(year), deductions, getSMMLV)
  const ret = retencionByYear(db, Number(year), deductions, getSMMLV)

  // What is still owed, and over how many months — not what has been paid, which is the
  // one figure that cannot tell you whether to act.
  const ssOwed = ss.filter(r => r.state === 'pending' || r.state === 'partial')
                   .reduce((a, r) => a + (r.owed - r.paid), 0)
  const overdueMonths = ss.filter(r => r.state === 'pending' || r.state === 'partial').length

  function openMonth(period: string) {
    setCurKey(period)
    setView('mes')
  }

  /** Open one payment in its own sheet — the same one the month uses, so a payment is
   *  edited the same way wherever it is reached from. */
  function openPayment(row: { period: string; suggestedIbc: number; suggested: number },
                       monthKey: string, id: number) {
    openSSPayment({
      period: row.period,
      suggestedIbc: row.suggestedIbc,
      suggestedSS: row.suggested,
      editing: { id, monthKey },
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="ts-heading-section">Obligaciones</h2>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger size="sm" aria-label="Año"><SelectValue /></SelectTrigger>
          <SelectContent>
            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* The page answers first, then the cards detail it. Before this the two cards
          headlined opposite quantities — SS with what was PAID, retención with what was
          MISSING — so the same question in the same place got two different answers and
          the reader had to combine them. */}
      <StatusStrip ssOwed={ssOwed} overdueMonths={overdueMonths} ret={ret} />

      <SectionCard icon={Landmark} title="Seguridad social">
        {ss.length === 0 ? (
          <Empty className="border-0 py-2">
            <EmptyHeader>
              <EmptyMedia variant="icon"><Landmark size={14} /></EmptyMedia>
              <EmptyTitle>Sin obligaciones en {year}</EmptyTitle>
              <EmptyDescription>Registra ingresos por servicios y aparecerán aquí</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div>
            {ss.map(r => {
              const monthName = MONTHS[Number(r.period.slice(5)) - 1]
              const payments = settlementsFor(db, 'ss', r.period)
              const isOpen = expanded === r.period
              return (
                <div key={r.period} className="border-b border-[var(--border)] last:border-0">
                  {/* The header discloses rather than navigating: the payments are the
                      answer to "what did I pay", and sending the user to the month first
                      made them hunt for it. The month is still one tap away, below. */}
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : r.period)}
                    className="w-full text-left flex items-stretch gap-2 py-2 px-1 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {/* The rail is on all four states, never absent. If it vanished on one
                        the label column would shift for that row and the list would read
                        as ragged rather than as a state changing. */}
                    <span
                      aria-hidden
                      className={cn('w-[3px] rounded-full shrink-0',
                        r.state === 'settled' ? 'bg-[var(--color-provision)]'
                        : r.state === 'upcoming' ? 'bg-[var(--border)]'
                        : 'bg-[var(--color-tax)]')}
                    />
                    <ChevronDown
                      size={14}
                      aria-hidden
                      className={cn('shrink-0 self-center text-muted-foreground transition-transform duration-fast',
                        isOpen && 'rotate-180', payments.length === 0 && 'opacity-0')}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="ts-body-base-emphasis">{monthName}</div>
                      {/* The base is shown only when a payment declared a different one:
                          printing "IBC $X" on every row would imply a choice was made
                          where the suggestion was simply accepted. */}
                      <div className="ts-body-small text-muted-foreground">
                        {r.paidIbc != null
                          ? `IBC facturado ${COP(r.paidIbc)}`
                          : `IBC sugerido ${COP(r.suggestedIbc)}`}
                        {payments.length > 1 && ` · ${payments.length} pagos`}
                      </div>
                    </div>
                    {/* ONE figure, and its colour is the state — so the list can be read
                        down the right edge without stopping at twelve badges. The figure
                        is the actionable one: on an open month that is what is LEFT, which
                        used to be the small grey number under a large "$0". */}
                    <div className="text-right shrink-0">
                      <div className={cn('ts-amount-base',
                        r.state === 'settled' ? 'text-[var(--color-provision-txt)]'
                        : r.state === 'upcoming' ? 'text-muted-foreground'
                        : 'text-[var(--color-tax-txt)]')}>
                        {r.state === 'settled' ? COP(r.paid)
                          : r.state === 'upcoming' ? COP(r.owed)
                          : COP(r.owed - r.paid)}
                      </div>
                      <div className="ts-detail-base text-muted-foreground">
                        {r.state === 'settled' ? 'pagado'
                          : r.state === 'upcoming' ? 'causado'
                          : 'faltan'}
                      </div>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="pl-6 pr-1 pb-2 space-y-1">
                      {payments.map(pay => (
                        <button
                          key={pay.id}
                          type="button"
                          onClick={() => openPayment(r, pay.monthKey, pay.id)}
                          className="w-full text-left flex items-baseline gap-2 py-1.5 rounded-lg hover:bg-muted/50 px-1 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="ts-body-small truncate">{pay.desc}</div>
                            <div className="ts-body-small text-muted-foreground">
                              {fmtDate(pay.date)}
                              {pay.account && ` · ${pay.account}`}
                              {pay.ibc != null && ` · IBC ${COP(pay.ibc)}`}
                            </div>
                          </div>
                          <span className="ts-amount-small shrink-0">
                            {pay.currency === 'USD' ? USD(pay.rawAmount) : COP(pay.amount)}
                          </span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => openMonth(r.period)}
                        className="ts-body-small text-[var(--primary)] underline-offset-2 hover:underline px-1"
                      >
                        Ver {monthName} completo
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        icon={PiggyBank}
        title={`Retención ${year}`}
      >
        <div className="space-y-3">
          {/* Retención is not a monthly payment, so it gets a running total rather than a
              row per month with a state. What matters is whether the money is there when
              the DIAN asks once a year. */}
          <div className="flex items-baseline justify-between">
            <span className="ts-body-small text-muted-foreground">Causado en el año</span>
            <span className="ts-amount-small">{COP(ret.accrued)}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="ts-body-small text-muted-foreground">Reservado</span>
            <span className="ts-amount-small">{COP(ret.reserved)}</span>
          </div>
          {ret.settled > 0 && (
            <div className="flex items-baseline justify-between">
              <span className="ts-body-small text-muted-foreground">Pagado a la DIAN</span>
              <span className="ts-amount-small">{COP(ret.settled)}</span>
            </div>
          )}
          {ret.accrued > 0 && (
            <>
              <Progress
                value={ret.accrued > 0 ? ret.reserved / ret.accrued : 0}
                tone="provision"
                label={`${Math.round((ret.reserved / ret.accrued) * 100)}% de la retención del año reservado`}
              />
              {/* No "Faltante X · Y% reservado" here: the strip above says the
                  percentage and the bar draws it, so this said the same thing a third
                  time. What is left is the pair the other rows use. */}
              <div className="flex items-baseline justify-between pt-1 border-t border-[var(--border)]">
                <span className="ts-body-base-emphasis">Faltante por reservar</span>
                <span className="ts-amount-base text-[var(--color-tax-txt)]">{COP(ret.gap)}</span>
              </div>
            </>
          )}

          {ret.byMonth.length > 0 && (
            <div className="pt-1 border-t border-[var(--border)]">
              {ret.byMonth.map(m => (
                <div key={m.period} className="flex items-baseline justify-between py-1.5">
                  <span className="ts-body-small text-muted-foreground">
                    {MONTHS[Number(m.period.slice(5)) - 1]}
                  </span>
                  <span className="ts-amount-small">{COP(m.accrued)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}
