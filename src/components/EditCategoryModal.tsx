import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

interface EditCategoryModalProps {
  isOpen: boolean
  initialName: string
  onClose: () => void
  onSave: (name: string) => void
}

export function EditCategoryModal({
  isOpen,
  initialName,
  onClose,
  onSave,
}: EditCategoryModalProps) {
  const { t } = useLanguage()
  const [name, setName] = useState(initialName)

  useEffect(() => {
    setName(initialName)
  }, [initialName, isOpen])

  const handleSave = () => {
    const trimmed = name.trim()
    if (trimmed) {
      onSave(trimmed)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
            style={{ pointerEvents: 'auto' }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-category-title"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl outline-none"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 id="edit-category-title" className="font-semibold text-slate-800">{t('editCategory')}</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
                aria-label={t('close')}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder={t('categoryName')}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                autoFocus
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!name.trim()}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {t('save')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
