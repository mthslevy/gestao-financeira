import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { Transaction } from '../domain/types'
import type { Category } from '../domain/types'

/** Paleta para segmentos do donut (legível em light e dark) */
const PALETA = [
  '#f43f5e', // rose-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#0ea5e9', // sky-500
  '#10b981', // emerald-500
  '#f97316', // orange-500
  '#d946ef', // fuchsia-500
  '#14b8a6', // teal-500
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
]

export interface DadoCategoria {
  name: string
  value: number
  categoryId: string
}

function agregarDespesasPorCategoria(
  transacoes: Transaction[],
  categories: Category[]
): DadoCategoria[] {
  const catMap = new Map(categories.map((c) => [c.id, c.name]))
  const totals = new Map<string, number>()

  transacoes
    .filter((t) => t.type === 'despesa')
    .forEach((t) => {
      const cur = totals.get(t.categoryId) ?? 0
      totals.set(t.categoryId, cur + Math.abs(t.amount))
    })

  return Array.from(totals.entries())
    .map(([categoryId, value]) => ({
      name: catMap.get(categoryId) ?? 'Outros',
      value: Math.round(value * 100) / 100,
      categoryId,
    }))
    .sort((a, b) => b.value - a.value)
}

interface TooltipPayloadItem {
  payload?: DadoCategoria & { total?: number }
}

function CustomTooltipCategorias({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
}) {
  if (!active || !payload?.length) return null

  const raw = payload[0]?.payload
  if (!raw) return null
  const { name, value, total: totalGeral } = raw
  const total = totalGeral ?? value
  const percent = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-slate-900/90">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {name}
      </p>
      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
        {value.toLocaleString('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        })}
      </p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {percent}% do total
      </p>
      <div className="mt-2 h-1 w-full rounded-full bg-slate-200 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-rose-500"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}

interface GraficoCategoriasProps {
  transacoes: Transaction[]
  categories: Category[]
}

export function GraficoCategorias({ transacoes, categories }: GraficoCategoriasProps) {
  const { data, totalSum } = useMemo(() => {
    const agg = agregarDespesasPorCategoria(transacoes, categories)
    const sum = agg.reduce((s, d) => s + d.value, 0)
    const withTotal = agg.map((d) => ({ ...d, total: sum }))
    return { data: withTotal, totalSum: sum }
  }, [transacoes, categories])

  const isEmpty = data.length === 0

  return (
    <div className="w-full rounded-[2.5rem] border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40">
      <div className="mb-4">
        <h3 className="font-sans text-lg font-bold text-slate-800 dark:text-white">
          Despesas por categoria
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Onde vai o teu dinheiro
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="h-[280px] w-full min-w-0 sm:w-1/2">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-center dark:border-slate-700 dark:bg-slate-800/20">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Sem despesas por categoria
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Regista despesas na aba Despesas para ver a distribuição aqui.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={2}
                  stroke="transparent"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PALETA[index % PALETA.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipCategorias />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {!isEmpty && totalSum > 0 && (
          <div className="flex-1 space-y-2 sm:min-w-[200px]">
            {data.map((d, i) => {
              const percent = Math.round((d.value / totalSum) * 100)
              return (
                <div
                  key={d.categoryId}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 dark:border-white/5 dark:bg-white/5"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <span
                      className="inline-block h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: PALETA[i % PALETA.length] }}
                      aria-hidden
                    />
                    {d.name}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-slate-600 dark:text-slate-300">
                    {percent}%
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
