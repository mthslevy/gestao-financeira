import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Locale } from '../i18n/translations'
import { cn } from '../lib/cn'

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'pt-BR', label: 'PT' },
  { value: 'en', label: 'EN' },
  { value: 'es', label: 'ES' },
]

interface LanguageSelectorProps {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
  className?: string
}

export function LanguageSelector({ locale, onLocaleChange, className }: LanguageSelectorProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
        aria-label={t('language')}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" aria-hidden />
        <span>{LOCALES.find((l) => l.value === locale)?.label ?? locale}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <ul
            className="absolute right-0 top-full z-50 mt-1 min-w-[6rem] rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            role="listbox"
          >
            {LOCALES.map(({ value, label }) => (
              <li key={value} role="option" aria-selected={locale === value}>
                <button
                  type="button"
                  onClick={() => {
                    onLocaleChange(value)
                    setOpen(false)
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm',
                    locale === value ? 'bg-emerald-50 font-medium text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
