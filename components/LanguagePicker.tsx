'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/contexts/LocaleContext'
import { Locale, LOCALE_NAMES } from '@/locales/translations'

const LOCALES: Locale[] = ['en', 'es', 'fr', 'de']

export default function LanguagePicker() {
  const { locale, setLocale, t } = useLocale()
  const [showPicker, setShowPicker] = useState(false)
  const [selected, setSelected] = useState<Locale>('en')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show if no locale has been saved yet
    const saved = localStorage.getItem('locale')
    if (!saved) {
      setShowPicker(true)
      // Slight delay so the animation triggers after mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    }
  }, [])

  const handleConfirm = () => {
    setLocale(selected)
    setVisible(false)
    setTimeout(() => setShowPicker(false), 350)
  }

  const handleSelect = (loc: Locale) => {
    setSelected(loc)
  }

  if (!showPicker) return null

  return (
    <div
      className="fixed inset-0 z-[9200] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Language picker"
      style={{
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.35s ease',
      }}
    >
      <div
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease',
        }}
        className="bg-surface border border-white/10 rounded-2xl w-full max-w-lg p-8 md:p-12"
      >
        {/* Title */}
        <h2 className="font-display font-black text-[clamp(28px,4vw,42px)] text-primary mb-2 leading-tight">
          {t.languagePicker.title}
        </h2>

        {/* Note */}
        <p className="font-mono text-[12px] tracking-[0.15em] uppercase text-muted mb-8">
          {t.languagePicker.note}
        </p>

        {/* Language grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {LOCALES.map((loc) => {
            const isSelected = selected === loc
            return (
              <button
                key={loc}
                onClick={() => handleSelect(loc)}
                className={[
                  'group relative flex items-center justify-between px-5 py-4 border rounded-xl transition-all duration-200 text-left',
                  isSelected
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-white/10 bg-surface-2 text-muted hover:border-accent hover:text-accent',
                ].join(' ')}
              >
                <span className="font-display font-semibold text-[18px] leading-none">
                  {LOCALE_NAMES[loc].native}
                </span>
                <span
                  className={[
                    'font-mono text-[11px] tracking-[0.2em] uppercase px-2 py-0.5 border rounded transition-colors duration-200',
                    isSelected
                      ? 'border-accent text-accent'
                      : 'border-white/20 text-muted group-hover:border-accent group-hover:text-accent',
                  ].join(' ')}
                >
                  {LOCALE_NAMES[loc].code}
                </span>
              </button>
            )
          })}
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-primary text-bg font-mono text-[14px] tracking-[0.2em] uppercase py-4 rounded-xl hover:bg-accent transition-colors duration-300 active:scale-[0.99]"
        >
          {t.languagePicker.confirm}
        </button>
      </div>
    </div>
  )
}
