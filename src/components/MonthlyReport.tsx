import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  TrendingUp,
  Calendar,
  Coins,
} from 'lucide-react'
import type { MonthlyReport as Report } from '../domain/types'
import { useLanguage } from '../contexts/LanguageContext'
import type { Locale } from '../i18n/translations'

function formatCurrency(value: number, locale: Locale): string {
  const localeMap: Record<Locale, string> = { 'pt-BR': 'pt-BR', en: 'en', es: 'es' }
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

interface MonthlyReportProps {
  report: Report | null
  loading: boolean
  year: number
  month: number
  onYearMonthChange: (year: number, month: number) => void
}

export function MonthlyReportView({
  report,
  loading,
  year,
  month,
  onYearMonthChange,
}: MonthlyReportProps) {
  const { t, locale } = useLanguage()
  const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => t(`month${i}`))
  const monthName = MONTHS[month - 1] ?? ''

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
          <Calendar className="h-6 w-6 text-slate-500 dark:text-slate-400" />
          {t('reportTitle')}
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => onYearMonthChange(year, Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-white"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => onYearMonthChange(Number(e.target.value), month)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-white"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 py-16 dark:border-slate-600 dark:bg-slate-800/50"
          >
            <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent dark:border-emerald-400" />
              <span className="text-sm">{t('reportLoading')}</span>
            </div>
          </motion.div>
        ) : report ? (
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-900/20"
              >
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <ArrowDownCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{t('reportInflows')}</span>
                </div>
                <p className="mt-1 text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  {formatCurrency(report.totalReceitas, locale)}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 shadow-sm dark:border-rose-500/20 dark:bg-rose-900/20"
              >
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                  <ArrowUpCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{t('reportOutflows')}</span>
                </div>
                <p className="mt-1 text-2xl font-bold text-rose-800 dark:text-rose-300">
                  {formatCurrency(report.totalDespesas, locale)}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className={`rounded-xl border p-4 shadow-sm ${
                  report.saldo >= 0
                    ? 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-500/20 dark:bg-emerald-900/20'
                    : 'border-amber-200 bg-amber-50/80 dark:border-amber-500/30 dark:bg-amber-900/20'
                }`}
              >
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm font-medium">{t('reportBalance')}</span>
                </div>
                <p
                  className={`mt-1 text-2xl font-bold ${
                    report.saldo >= 0 ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {formatCurrency(report.saldo, locale)}
                </p>
              </motion.div>
            </div>

            {report.byCategory.length > 0 && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-600 dark:bg-slate-800/60"
              >
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <TrendingUp className="h-4 w-4" />
                  {t('reportByCategory')}
                </h3>
                <div className="space-y-2">
                  {report.byCategory.map((row, i) => (
                    <motion.div
                      key={`${row.categoryId}-${row.type}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.03 }}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-700/50 dark:hover:bg-slate-700/80"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-100">{row.categoryName}</span>
                      <span
                        className={
                          row.type === 'receita'
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-rose-700 dark:text-rose-300'
                        }
                      >
                        {row.type === 'receita' ? '+' : '-'}{' '}
                        {formatCurrency(row.total, locale)} ({row.count}{' '}
                        {row.count === 1 ? t('transactionsCount', { count: String(row.count) }) : t('transactionsCountPlural', { count: String(row.count) })})
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {(report.receitas.length > 0 || report.despesas.length > 0) && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {report.receitas.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-600 dark:bg-slate-800/60">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      <Coins className="h-4 w-4" />
                      {t('reportReceitasIn', { month: monthName })}
                    </h3>
                    <ul className="max-h-48 space-y-1 overflow-y-auto text-sm">
                      {report.receitas.map((tx) => (
                        <li
                          key={tx.id}
                          className="flex justify-between border-b border-slate-100 py-1 last:border-0 dark:border-slate-600"
                        >
                          <span className="text-slate-700 dark:text-slate-300">{tx.description}</span>
                          <span className="font-medium text-emerald-700 dark:text-emerald-300">
                            +{formatCurrency(tx.amount, locale)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {report.despesas.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-600 dark:bg-slate-800/60">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-400">
                      <Coins className="h-4 w-4" />
                      {t('reportDespesasIn', { month: monthName })}
                    </h3>
                    <ul className="max-h-48 space-y-1 overflow-y-auto text-sm">
                      {report.despesas.map((tx) => (
                        <li
                          key={tx.id}
                          className="flex justify-between border-b border-slate-100 py-1 last:border-0 dark:border-slate-600"
                        >
                          <span className="text-slate-700 dark:text-slate-300">{tx.description}</span>
                          <span className="font-medium text-rose-700 dark:text-rose-300">
                            -{formatCurrency(tx.amount, locale)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.section>
            )}

            {report.receitas.length === 0 &&
              report.despesas.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400"
                >
                  {t('reportNoData', { month: monthName, year: String(year) })}
                </motion.p>
              )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
