import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

export interface FeatureSlide {
  key: string
  icon: LucideIcon
  titleKey: string
  descKey: string
}

interface FeatureCarouselProps {
  slides: FeatureSlide[]
  t: (key: string) => string
  ariaLabel?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export function FeatureCarousel({ slides, t, ariaLabel }: FeatureCarouselProps) {
  return (
    <motion.section
      aria-label={ariaLabel}
      className="grid grid-cols-1 gap-6 px-4 sm:gap-8 md:grid-cols-4 md:px-0"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {slides.map(({ key, icon: Icon, titleKey, descKey }) => (
        <motion.div
          key={key}
          variants={itemVariants}
          className="flex flex-col items-start rounded-[2.5rem] border border-slate-200/5 bg-white p-10 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform duration-300 hover:scale-105 dark:border-white/10 dark:bg-slate-800/80 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
        >
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mb-4 text-2xl font-bold text-slate-800 dark:text-slate-100">{t(titleKey)}</h3>
          <p className="leading-relaxed text-slate-500 dark:text-slate-400">{t(descKey)}</p>
        </motion.div>
      ))}
    </motion.section>
  )
}
