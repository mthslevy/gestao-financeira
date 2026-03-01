import { Pencil, Trash2 } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Category } from '../domain/types'
import { cn } from '../lib/cn'

interface CategoryListProps {
  categories: Category[]
  type: 'receita' | 'despesa'
  onEdit: (id: string, name: string) => void
  onDelete: (id: string) => void
  className?: string
}

export function CategoryList({ categories, type, onEdit, onDelete, className }: CategoryListProps) {
  const { t } = useLanguage()
  const list = categories.filter((c) => c.type === type)
  if (list.length === 0) return null

  return (
    <ul className={cn('space-y-1', className)}>
      {list.map((cat) => (
        <li
          key={cat.id}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800/60 dark:hover:bg-white/5"
        >
          <span className="font-medium text-slate-800 dark:text-slate-100">{cat.name}</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onEdit(cat.id, cat.name)}
              className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200"
              aria-label={t('editItem')}
            >
              <Pencil className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onDelete(cat.id)}
              className="rounded p-1.5 text-slate-500 hover:bg-rose-100 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500 dark:text-slate-400 dark:hover:bg-rose-900/40 dark:hover:text-rose-300"
              aria-label={t('deleteItem')}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
