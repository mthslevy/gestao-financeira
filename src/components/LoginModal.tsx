import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string,
    options?: { firstName: string; lastName: string }
  ) => Promise<{ error: Error | null }>
}

export function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  signIn,
  signUp,
}: LoginModalProps) {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  // Sempre que o modal abre, voltar ao formulário de login e limpar campos
  useEffect(() => {
    if (isOpen) {
      setMode('login')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setMessage(null)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    if (mode === 'login') {
      if (!email.trim() || !password) {
        setMessage({ type: 'error', text: t('fillEmailPassword') })
        return
      }
    } else {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
        setMessage({ type: 'error', text: t('fillSignUpFields') })
        return
      }
      if (password !== confirmPassword) {
        setMessage({ type: 'error', text: t('passwordsDoNotMatch') })
        return
      }
    }
    setLoading(true)
    try {
      const { error } =
        mode === 'login'
          ? await signIn(email, password)
          : await signUp(email, password, { firstName: firstName.trim(), lastName: lastName.trim() })
      if (error) {
        if (mode === 'login' && error.message.toLowerCase().includes('email not confirmed')) {
          setMessage({ type: 'error', text: t('loginEmailNotConfirmed') })
        } else if (mode === 'login') {
          setMessage({ type: 'error', text: t('loginGenericError') })
        } else {
          setMessage({ type: 'error', text: t('signUpGenericError') })
        }
      } else {
        if (mode === 'signup') {
          setMessage({ type: 'success', text: t('signUpSuccess') })
        } else {
          onSuccess()
          onClose()
        }
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        key="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-600 dark:bg-slate-800"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-600">
          <h2 id="login-title" className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {mode === 'login' ? t('loginTitle') : t('signUpTitle')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            aria-label={t('close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label htmlFor="login-first-name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('firstName')}
                </label>
                <input
                  id="login-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Maria"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label htmlFor="login-last-name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('lastName')}
                </label>
                <input
                  id="login-last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Silva"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
                  autoComplete="family-name"
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('email')}
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nome@email.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('password')}
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          {mode === 'signup' && (
            <div>
              <label htmlFor="login-confirm-password" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('confirmPassword')}
              </label>
              <input
                id="login-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
                autoComplete="new-password"
              />
            </div>
          )}

          {message && (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                message.type === 'error' ? 'bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            {loading ? t('processing') : mode === 'login' ? t('loginTitle') : t('signUpTitle')}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setMessage(null)
              if (mode === 'signup') {
                setFirstName('')
                setLastName('')
                setConfirmPassword('')
              }
            }}
            className="w-full text-center text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {mode === 'login' ? t('noAccount') : t('hasAccount')}
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}
