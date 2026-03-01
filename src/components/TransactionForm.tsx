import { useState } from 'react'
import { ArrowDownCircle, ArrowUpCircle, Coins, Calendar } from 'lucide-react'
import type { Category } from '../domain/types'
import { useLanguage } from '../contexts/LanguageContext'
import { cn } from '../lib/cn'

interface TransactionFormProps {
  type: 'receita' | 'despesa'
  categories: Category[]
  onSubmit: (description: string, amount: number, categoryId: string, date: string) => Promise<void>
  className?: string
}

export function TransactionForm({
  type,
  categories,
  onSubmit,
  className,
}: TransactionFormProps) {
  const { t } = useLanguage()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)

  const list = categories.filter((c) => c.type === type)
  const isReceita = type === 'receita'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount.replace(',', '.'))
    if (!description.trim() || Number.isNaN(value) || value <= 0 || !categoryId || loading) return
    setLoading(true)
    try {
      await onSubmit(description.trim(), value, categoryId, date)
      setDescription('')
      setAmount('')
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : (e && typeof e === 'object' && 'message' in e)
            ? String((e as { message: string }).message)
            : String(e)
      console.error('Erro ao registrar:', e)
      if (typeof alert !== 'undefined') alert(t('errorRegister') + ': ' + msg)
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = description.trim() && amount && categoryId && !loading
  const hasCategories = list.length > 0

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative z-10 space-y-3', className)}
      style={{ pointerEvents: 'auto' }}
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{t('description')}</label>
        <div className="relative">
          <Coins className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={isReceita ? 'Ex: Salário, Freela' : 'Ex: Mercado, Conta de luz'}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all dark:border-slate-700 dark:bg-slate-800/40 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
<label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{t('value')}</label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">€</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d,.]/g, ''))}
              placeholder="0,00"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all dark:border-slate-700 dark:bg-slate-800/40 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{t('date')}</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all dark:border-slate-700 dark:bg-slate-800/40 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Categoria</label>
        {!hasCategories ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 py-2 px-3 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
            Vai à aba <strong>Categorias</strong> e cria pelo menos uma categoria de {isReceita ? 'receita' : 'despesa'} primeiro.
          </p>
        ) : (
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all dark:border-slate-700 dark:bg-slate-800/40 dark:text-white"
            aria-label={t('category')}
          >
            <option value="">{t('selectCategory')}</option>
            {list.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <button
        type="submit"
        disabled={!canSubmit}
        title={!hasCategories ? t('createCategoryFirst', { type: '' }) : !categoryId ? t('selectCategory') : undefined}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white shadow transition disabled:opacity-50',
          isReceita
            ? 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-emerald-700 dark:shadow-[0_0_24px_rgba(16,185,129,0.35)]'
            : 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:from-rose-600 hover:to-rose-700 dark:shadow-[0_0_24px_rgba(244,63,94,0.35)]'
        )}
      >
        {isReceita ? (
          <ArrowDownCircle className="h-5 w-5" />
        ) : (
          <ArrowUpCircle className="h-5 w-5" />
        )}
        {isReceita ? t('registerReceita') : t('registerDespesa')}
      </button>
    </form>
  )
}
