import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, ArrowDownCircle, ArrowUpCircle, Tags, FileBarChart, User, LogOut } from 'lucide-react'
import { useAuth } from './contexts/AuthContext'
import { useLanguage } from './contexts/LanguageContext'
import { useCategories, useTransactions, useMonthlyReport } from './hooks/useFinance'
import { LanguageSelector } from './components/LanguageSelector'
import { ThemeToggle } from './components/ThemeToggle'
import { CategoryForm } from './components/CategoryForm'
import { CategoryList } from './components/CategoryList'
import { EditCategoryModal } from './components/EditCategoryModal'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { MonthlyReportView } from './components/MonthlyReport'
import { GraficoPatrimonio } from './components/GraficoPatrimonio'
import { GraficoCategorias } from './components/GraficoCategorias'
import { LandingPage } from './pages/LandingPage'
import { LoginModal } from './components/LoginModal'
import { cn } from './lib/cn'
import type { TabId, EditCategoryState } from './types'

const now = new Date()

function App() {
  // ——— 1. Hooks sempre no topo (nunca depois de return/if) ———
  const { user, loading, signIn, signUp, signOut } = useAuth()
  const { t, locale, setLocale } = useLanguage()
  const [loginOpen, setLoginOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [reportYear, setReportYear] = useState(now.getFullYear())
  const [reportMonth, setReportMonth] = useState(now.getMonth() + 1)
  const [editCategory, setEditCategory] = useState<EditCategoryState | null>(null)
  const [errorToast, setErrorToast] = useState<string | null>(null)

  const categories = useCategories()
  const transactions = useTransactions()
  const report = useMonthlyReport(reportYear, reportMonth)

  useEffect(() => {
    if (activeTab === 'relatorio') report.refresh()
  }, [activeTab, report.refresh])

  useEffect(() => {
    if (!errorToast) return
    const id = window.setTimeout(() => setErrorToast(null), 4000)
    return () => window.clearTimeout(id)
  }, [errorToast])

  // ——— 2. Só depois: verificações de loading e user ———
  if (loading) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-900"
        role="status"
        aria-live="polite"
        aria-label={t('loading')}
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent dark:border-emerald-400" aria-hidden />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{t('loading')}</p>
      </div>
    )
  }

  // Proteção: dashboard só é acessível com utilizador autenticado; sem user mostra landing + login
  if (!user) {
    return (
      <>
        <LandingPage onOpenLogin={() => setLoginOpen(true)} />
        <LoginModal
          isOpen={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSuccess={() => setLoginOpen(false)}
          signIn={signIn}
          signUp={signUp}
        />
      </>
    )
  }

  const handleReportYearMonth = (year: number, month: number) => {
    setReportYear(year)
    setReportMonth(month)
  }

  const list = Array.isArray(transactions?.list) ? transactions.list : []
  const totalIncome = list
    .filter((t) => t?.type === 'receita')
    .reduce((acc, t) => acc + Number(t?.amount) || 0, 0)
  const totalExpense = list
    .filter((t) => t?.type === 'despesa')
    .reduce((acc, t) => acc + Number(t?.amount) || 0, 0)
  const balance = Number.isFinite(totalIncome - totalExpense) ? totalIncome - totalExpense : 0

  const navTabs: { id: TabId; label: string; icon: typeof ArrowDownCircle }[] = [
    { id: 'dashboard', label: t('tabDashboard'), icon: LayoutDashboard },
    { id: 'receitas', label: t('tabReceitas'), icon: ArrowDownCircle },
    { id: 'despesas', label: t('tabDespesas'), icon: ArrowUpCircle },
    { id: 'categorias', label: t('tabCategorias'), icon: Tags },
    { id: 'relatorio', label: t('tabRelatorio'), icon: FileBarChart },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-30 isolate border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-8 w-8 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('appTitle')}</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSelector locale={locale} onLocaleChange={setLocale} />
              <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300" aria-label={user.email ?? undefined}>
                <User className="h-4 w-4" aria-hidden />
                {user.email}
              </span>
              <button
                type="button"
                onClick={async () => {
                  await signOut()
                  window.location.href = '/'
                }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label={t('signOut')}
              >
                <LogOut className="h-4 w-4" aria-hidden />
                <span>{t('signOut')}</span>
              </button>
            </div>
          </div>
          <nav className="mt-3 flex flex-wrap gap-1" aria-label={t('navLabel')}>
            {navTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setActiveTab(id)
                }}
                aria-current={activeTab === id ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500',
                  activeTab === id
                    ? 'text-emerald-800 dark:text-emerald-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-200'
                )}
              >
                {activeTab === id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-emerald-100 dark:bg-emerald-500/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    aria-hidden
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {errorToast && (
        <div
          role="alert"
          className="mx-auto max-w-4xl px-4 py-2 bg-rose-50 border-b border-rose-200 text-rose-800 text-sm flex items-center justify-between gap-2 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-200"
        >
          <span>{errorToast}</span>
          <button
            type="button"
            onClick={() => setErrorToast(null)}
            className="shrink-0 rounded p-1 hover:bg-rose-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
            aria-label={t('close')}
          >
            ×
          </button>
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6" role="main" id="main-content">
        <div className="balance-cards mb-6 grid gap-4 sm:grid-cols-3" role="region" aria-label={t('balance')}>
          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-200/80 bg-emerald-50/80 p-6 shadow-lg shadow-emerald-500/5 backdrop-blur-md dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-400/10 blur-2xl" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{t('income')}</span>
            <p className="mt-1 text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              +{totalIncome.toFixed(2)}€
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-rose-200/80 bg-rose-50/80 p-6 shadow-lg shadow-rose-500/5 backdrop-blur-md dark:border-rose-500/20 dark:bg-rose-500/10">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-rose-400/10 blur-2xl" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">{t('expense')}</span>
            <p className="mt-1 text-3xl font-bold text-rose-700 dark:text-rose-400">
              -{totalExpense.toFixed(2)}€
            </p>
          </div>
          <div
            className={`relative overflow-hidden rounded-[2rem] border p-6 shadow-lg backdrop-blur-md transition-colors duration-500 ${
              balance >= 0
                ? 'border-emerald-200/80 bg-emerald-50/80 shadow-emerald-500/5 dark:border-emerald-500/20 dark:bg-emerald-500/10'
                : 'border-rose-200/80 bg-rose-50/80 shadow-rose-500/5 dark:border-rose-500/30 dark:bg-rose-500/10'
            }`}
          >
            {balance < 0 && (
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-rose-400/15 blur-2xl" aria-hidden />
            )}
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">{t('balance')}</span>
            <p
              className={`mt-1 text-3xl font-bold transition-colors duration-500 ${balance >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-500 animate-pulse'}`}
            >
              {balance.toFixed(2)}€
            </p>
          </div>
        </div>

        {(activeTab === 'dashboard' || activeTab === 'relatorio') && (
          <GraficoPatrimonio transacoes={list} />
        )}

        {activeTab === 'dashboard' && (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t('dashboardIntro')}
          </p>
        )}

        {activeTab === 'categorias' && (
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('categoriesTitle')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('categoriesIntro')}
            </p>
            <GraficoCategorias transacoes={list} categories={categories.list} />
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-slate-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50">
                <h3 className="mb-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">{t('categoryReceitas')}</h3>
                <CategoryForm
                  type="receita"
                  onSubmit={(name) => categories.create(name, 'receita')}
                />
                <CategoryList
                  categories={categories.list}
                  type="receita"
                  onEdit={(id, name) => setEditCategory({ id, name })}
                  onDelete={(id) => {
                    categories.remove(id).catch(() => setErrorToast(t('errorDeleteCategory')))
                  }}
                  className="mt-3"
                />
              </div>
              <div className="rounded-[2rem] border border-slate-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50">
                <h3 className="mb-3 text-sm font-semibold text-rose-700 dark:text-rose-400">{t('categoryDespesas')}</h3>
                <CategoryForm
                  type="despesa"
                  onSubmit={(name) => categories.create(name, 'despesa')}
                />
                <CategoryList
                  categories={categories.list}
                  type="despesa"
                  onEdit={(id, name) => setEditCategory({ id, name })}
                  onDelete={(id) => {
                    categories.remove(id).catch(() => setErrorToast(t('errorDeleteCategory')))
                  }}
                  className="mt-3"
                />
              </div>
            </div>
          </section>
        )}

        {activeTab === 'receitas' && (
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('receitasTitle')}</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-[2rem] border border-slate-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50 lg:col-span-1">
                <TransactionForm
                  type="receita"
                  categories={categories.list}
                  onSubmit={transactions.addReceita}
                />
              </div>
              <div className="lg:col-span-2">
                <h3 className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">{t('lastReceitas')}</h3>
                {transactions.loading ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
                    {t('loading')}
                  </div>
                ) : (
                  <TransactionList
                    transactions={list}
                    categories={categories.list}
                    type="receita"
                    onEdit={transactions.update}
                    onDelete={(id) => {
                    transactions.remove(id).catch(() => setErrorToast(t('errorDeleteTransaction')))
                  }}
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'despesas' && (
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('despesasTitle')}</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-[2rem] border border-slate-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/50 lg:col-span-1">
                <TransactionForm
                  type="despesa"
                  categories={categories.list}
                  onSubmit={transactions.addDespesa}
                />
              </div>
              <div className="lg:col-span-2">
                <h3 className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">{t('lastDespesas')}</h3>
                {transactions.loading ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
                    {t('loading')}
                  </div>
                ) : (
                  <TransactionList
                    transactions={list}
                    categories={categories.list}
                    type="despesa"
                    onEdit={transactions.update}
                    onDelete={(id) => {
                    transactions.remove(id).catch(() => setErrorToast(t('errorDeleteTransaction')))
                  }}
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'relatorio' && (
          <section className="space-y-8">
            <GraficoCategorias transacoes={list} categories={categories.list} />
            <MonthlyReportView
              report={report.report}
              loading={report.loading}
              year={reportYear}
              month={reportMonth}
              onYearMonthChange={handleReportYearMonth}
            />
          </section>
        )}
      </main>

      <EditCategoryModal
        isOpen={!!editCategory}
        initialName={editCategory?.name ?? ''}
        onClose={() => setEditCategory(null)}
        onSave={(name) => {
          if (editCategory) categories.update(editCategory.id, name)
          setEditCategory(null)
        }}
      />
    </div>
  )
}

export default App
