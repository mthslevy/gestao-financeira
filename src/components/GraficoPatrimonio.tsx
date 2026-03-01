import { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import { useTheme } from '../contexts/ThemeContext'
import type { Transaction } from '../domain/types'

export interface PontoGrafico {
  name: string
  patrimonio: number
}

type Periodo = '7D' | '1M' | '6M' | 'ALL'

function getDataLimite(periodo: Periodo): Date | null {
  const hoje = new Date()
  hoje.setHours(23, 59, 59, 999)
  switch (periodo) {
    case '7D': {
      const d = new Date(hoje)
      d.setDate(d.getDate() - 7)
      d.setHours(0, 0, 0, 0)
      return d
    }
    case '1M': {
      const d = new Date(hoje)
      d.setMonth(d.getMonth() - 1)
      d.setHours(0, 0, 0, 0)
      return d
    }
    case '6M': {
      const d = new Date(hoje)
      d.setMonth(d.getMonth() - 6)
      d.setHours(0, 0, 0, 0)
      return d
    }
    default:
      return null
  }
}

/**
 * Prepara os dados para o gráfico de Evolução do Património.
 * Lógica do "Saldo Acumulado": Saldo Anterior + Receita - Despesa.
 * Cada ponto do gráfico é o património real até àquela data (linha contínua).
 */
function processarDadosParaGrafico(transacoes: Transaction[]): PontoGrafico[] {
  // 1. Ordenamos as transações da mais antiga para a mais recente
  const ordenadas = [...transacoes].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  let saldoCorrente = 0 // "Balde" que vai acumulando o património

  // 2. Transformamos a lista em pontos no gráfico
  return ordenadas.map((t) => {
    const valor = Number(t.amount)

    // Se for receita, ADICIONA ao balde. Se for despesa, SUBTRAI.
    if (t.type === 'receita') {
      saldoCorrente += valor
    } else {
      saldoCorrente -= valor
    }

    return {
      // Formata a data para o eixo X (ex: "01/03")
      name: new Date(t.date).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
      }),
      // Valor que o gráfico desenha: acumulado até este momento
      patrimonio: Math.round(saldoCorrente * 100) / 100,
    }
  })
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  const valor = payload[0].value as number
  const isNegativo = valor < 0

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-slate-900/90">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Dia {label}
      </p>
      <p
        className={`text-lg font-bold ${isNegativo ? 'text-rose-500' : 'text-emerald-500'}`}
      >
        {valor.toLocaleString('pt-PT', {
          style: 'currency',
          currency: 'EUR',
        })}
      </p>
      <div
        className={`mt-2 h-1 w-full rounded-full ${isNegativo ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`}
      >
        <div
          className={`h-full rounded-full ${isNegativo ? 'bg-rose-500' : 'bg-emerald-500'}`}
          style={{ width: '40%' }}
        />
      </div>
    </div>
  )
}

interface GraficoPatrimonioProps {
  transacoes: Transaction[]
}

const PERIODOS: { id: Periodo; label: string }[] = [
  { id: '7D', label: '7D' },
  { id: '1M', label: '1M' },
  { id: '6M', label: '6M' },
  { id: 'ALL', label: 'Tudo' },
]

export function GraficoPatrimonio({ transacoes }: GraficoPatrimonioProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [periodo, setPeriodo] = useState<Periodo>('1M')

  const transacoesFiltradas = useMemo(() => {
    const limite = getDataLimite(periodo)
    if (!limite) return transacoes
    return transacoes.filter((t) => new Date(t.date) >= limite)
  }, [transacoes, periodo])

  const data = useMemo(
    () => processarDadosParaGrafico(transacoesFiltradas),
    [transacoesFiltradas]
  )

  const ultimosDados = data[data.length - 1]
  const corLinha =
    ultimosDados?.patrimonio != null && ultimosDados.patrimonio < 0
      ? '#f43f5e'
      : '#10b981'

  const chartData =
    data.length > 0 ? data : [{ name: '01', patrimonio: 0 }]

  return (
    <div className="mt-6 w-full rounded-[2.5rem] border border-slate-200/50 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-sans text-lg font-bold text-slate-800 dark:text-white">
            Evolução do Património
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Saldo acumulado ao longo do período
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-white/5">
          {PERIODOS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPeriodo(id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 ${
                periodo === id
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-white/10 dark:text-white'
                  : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="colorPatrimonioPositive"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="colorPatrimonioNegative"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: isDark ? '#94a3b8' : '#64748b',
                fontSize: 12,
              }}
              dy={10}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: '#94a3b8',
                strokeWidth: 1,
                strokeDasharray: '5 5',
              }}
            />
            <Area
              type="monotone"
              dataKey="patrimonio"
              stroke={corLinha}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#colorPatrimonio${ultimosDados?.patrimonio != null && ultimosDados.patrimonio < 0 ? 'Negative' : 'Positive'})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
