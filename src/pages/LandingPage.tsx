import { Wallet, PieChart, Tags, TrendingUp, ArrowRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageSelector } from '../components/LanguageSelector'
import { ThemeToggle } from '../components/ThemeToggle'
import { FeatureCarousel } from '../components/FeatureCarousel'
import type { FeatureSlide } from '../components/FeatureCarousel'

interface LandingPageProps {
  onOpenLogin: () => void
}

const FEATURES: FeatureSlide[] = [
  { key: '1', icon: Wallet, titleKey: 'feature1Title', descKey: 'feature1Desc' },
  { key: '2', icon: Tags, titleKey: 'feature2Title', descKey: 'feature2Desc' },
  { key: '3', icon: PieChart, titleKey: 'feature3Title', descKey: 'feature3Desc' },
  { key: '4', icon: TrendingUp, titleKey: 'feature4Title', descKey: 'feature4Desc' },
]

export function LandingPage({ onOpenLogin }: LandingPageProps) {
  const { t, locale, setLocale } = useLanguage()

  return (
    <div className="relative min-h-screen">
      {/* Camada de fundo + manchas (light: verde/ciano | dark: roxo/azul) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900" aria-hidden />
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {/* Mancha Superior Esquerda - Light: esmeralda claro | Dark: esmeralda escuro (profundidade) */}
          <div
            className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-emerald-200/40 blur-[100px] animate-blob dark:bg-emerald-900/20"
          />
          {/* Mancha Inferior Direita - Light: azul suave | Dark: violeta (tom arroxeado) */}
          <div
            className="absolute -bottom-[10%] -right-[5%] h-[600px] w-[600px] rounded-full bg-blue-100/30 blur-[130px] animate-blob dark:bg-purple-900/20"
            style={{ animationDelay: '2s' }}
          />
          {/* Pequeno detalhe no centro */}
          <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-[80px] dark:bg-slate-800/20 dark:backdrop-blur-[60px]" />
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-400/20">
              <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-lg font-bold text-slate-800 sm:text-xl dark:text-slate-100">{t('landingTitle')}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector locale={locale} onLocaleChange={setLocale} />
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-lg dark:bg-emerald-500 dark:shadow-emerald-500/30 dark:hover:bg-emerald-400"
            >
              <span>{t('signIn')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:py-20 sm:px-6">
        <section className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-slate-50">
            {t('heroTitlePrefix')}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
              {t('heroTitleKeyword')}
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:mt-4 sm:text-lg md:text-xl dark:text-slate-300">
            {t('heroSubtitle')}
          </p>
          <button
            type="button"
            onClick={onOpenLogin}
            className="group relative mt-6 rounded-full bg-[#00a369] px-10 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:shadow-emerald-500/40 dark:hover:bg-emerald-400 sm:mt-8"
          >
            {/* Brilho externo (neon) — mais visível no dark no hover */}
            <span
              className="absolute -inset-1 rounded-full bg-emerald-500 blur opacity-0 transition-opacity duration-500 group-hover:opacity-30 dark:group-hover:opacity-50"
              aria-hidden
            />
            <span className="relative flex items-center gap-2">
              {t('getStarted')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </section>

        <section className="mt-14 sm:mt-20">
          <h2 className="sr-only">{t('feature1Title')}</h2>
          <FeatureCarousel slides={FEATURES} t={t} ariaLabel={t('feature1Title')} />
        </section>

        <section className="mt-16 text-center sm:mt-24">
          <p className="text-slate-600 sm:text-lg dark:text-slate-300">{t('createAccountCta')}</p>
          <button
            type="button"
            onClick={onOpenLogin}
            className="mt-3 font-medium text-emerald-600 underline-offset-4 transition hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            {t('signInOrCreate')} →
          </button>
        </section>
      </main>
    </div>
  )
}
