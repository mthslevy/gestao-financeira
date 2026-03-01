import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import type { Transaction } from '../domain/types'
import type { Category } from '../domain/types'
import { useLanguage } from '../contexts/LanguageContext'
import { cn } from '../lib/cn'
import type { Locale } from '../i18n/translations'

function formatCurrency(value: number, locale: Locale): string {
  const localeMap: Record<Locale, string> = { 'pt-BR': 'pt-BR', en: 'en', es: 'es' }
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

function formatDate(s: string, locale: Locale): string {
  const localeMap: Record<Locale, string> = { 'pt-BR': 'pt-BR', en: 'en-GB', es: 'es' }
  return new Date(s + 'T12:00:00').toLocaleDateString(localeMap[locale], {
    day: '2-digit',
    month: 'short',
  })
}

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  type: 'receita' | 'despesa'
  onEdit: (
    id: string,
    data: Partial<Pick<Transaction, 'description' | 'amount' | 'categoryId' | 'date'>>
  ) => void
  onDelete: (id: string) => void
  className?: string
}

export function TransactionList({
  transactions,
  categories,
  type,
  onEdit,
  onDelete,
  className,
}: TransactionListProps) {
  const { t, locale } = useLanguage()
  const list = transactions.filter((t) => t.type === type).sort((a, b) => b.date.localeCompare(a.date))
  const catMap = new Map(categories.map((c) => [c.id, c.name]))
  const [editingId, setEditingId] = useState<string | null>(null)

  if (list.length === 0) return null

  const isReceita = type === 'receita'

  return (
    <motion.ul
      className={cn('space-y-2', className)}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
        hidden: {},
      }}
    >
      {list.map((tx, index) => {
        const isEditing = editingId === tx.id
        return (
          <motion.li
            key={tx.id}
            variants={{
              hidden: { y: 12, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
            }}
            className={cn(
              'rounded-lg border bg-white p-3 text-sm transition-colors hover:bg-slate-50 dark:bg-slate-800/60 dark:hover:bg-white/5',
              isReceita ? 'border-emerald-100 dark:border-emerald-900/50' : 'border-rose-100 dark:border-rose-900/50'
            )}
          >
            {isEditing ? (
              <TransactionRowEdit
                tx={tx}
                categories={categories.filter((c) => c.type === type)}
                onSave={(data) => {
                  onEdit(tx.id, data)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {isReceita ? (
                    <ArrowDownCircle className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
                  ) : (
                    <ArrowUpCircle className="h-5 w-5 shrink-0 text-rose-600" aria-hidden />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-100">{tx.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {catMap.get(tx.categoryId) ?? '—'} · {formatDate(tx.date, locale)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      'font-semibold',
                      isReceita ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
                    )}
                  >
                    {isReceita ? '+' : '-'} {formatCurrency(tx.amount, locale)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingId(tx.id)}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200"
                    aria-label={t('editItem')}
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(tx.id)}
                    className="rounded p-1.5 text-slate-500 hover:bg-rose-100 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500 dark:text-slate-400 dark:hover:bg-rose-900/40 dark:hover:text-rose-300"
                    aria-label={t('deleteItem')}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            )}
          </motion.li>
        )
      })}
    </motion.ul>
  )
}

function TransactionRowEdit({
  tx,
  categories,
  onSave,
  onCancel,
}: {
  tx: Transaction
  categories: Category[]
  onSave: (data: Partial<Pick<Transaction, 'description' | 'amount' | 'categoryId' | 'date'>>) => void
  onCancel: () => void
}) {
  const { t } = useLanguage()
  const [description, setDescription] = useState(tx.description)
  const [amount, setAmount] = useState(String(tx.amount))
  const [categoryId, setCategoryId] = useState(tx.categoryId)
  const [date, setDate] = useState(tx.date)

  const handleSave = () => {
    const value = parseFloat(amount.replace(',', '.'))
    if (!description.trim() || Number.isNaN(value) || value <= 0 || !categoryId) return
    onSave({ description: description.trim(), amount: value, categoryId, date })
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all dark:border-slate-700 dark:bg-slate-800/40 dark:text-white dark:placeholder:text-slate-500"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d,.]/g, ''))}
          placeholder={t('value')}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all dark:border-slate-700 dark:bg-slate-800/40 dark:text-white dark:placeholder:text-slate-500"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-900 outline-none focus:border-emerald-500 transition-all dark:border-slate-700 dark:bg-slate-800/40 dark:text-white"
        />
      </div>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-900 outline-none focus:border-emerald-500 transition-all dark:border-slate-700 dark:bg-slate-800/40 dark:text-white"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700"
        >
          {t('save')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  )
}
