import { useState } from 'react'
import { Plus, Tag } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { cn } from '../lib/cn'

interface CategoryFormProps {
  type: 'receita' | 'despesa'
  onSubmit: (name: string) => Promise<void>
  className?: string
}

export function CategoryForm({ type, onSubmit, className }: CategoryFormProps) {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || loading) return
    setLoading(true)
    try {
      await onSubmit(trimmed)
      setName('')
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : (e && typeof e === 'object' && 'message' in e)
            ? String((e as { message: string }).message)
            : String(e)
      console.error('Erro ao criar categoria:', e)
      if (typeof alert !== 'undefined') alert(t('errorCreateCategory') + ': ' + msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative z-10 flex gap-2', className)} style={{ pointerEvents: 'auto' }}>
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={type === 'receita' ? t('newCategoryReceita') : t('newCategoryDespesa')}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all dark:border-slate-700 dark:bg-slate-800/40 dark:text-white dark:placeholder:text-slate-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow transition hover:bg-emerald-700 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        {t('add')}
      </button>
    </form>
  )
}
