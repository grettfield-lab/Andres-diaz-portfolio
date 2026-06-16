'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown, AlertCircle, X } from 'lucide-react'
import DatePicker from './DatePicker'
import { useLocale } from '@/contexts/LocaleContext'

export default function ContactPageContent() {
  const { t } = useLocale()
  const [submitted, setSubmitted] = useState(false)
  const [clientType, setClientType] = useState<'individual' | 'company'>('individual')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [hasDate, setHasDate] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set())
  const [errorList, setErrorList] = useState<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const errorBoxRef = useRef<HTMLDivElement>(null)

  const FIELD_LABELS: Record<string, string> = {
    name: t.contactPage.fieldLabels.name,
    email: t.contactPage.fieldLabels.email,
    type: t.contactPage.fieldLabels.type,
    company: t.contactPage.fieldLabels.company,
    message: t.contactPage.fieldLabels.message,
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    gsap.registerPlugin(ScrollTrigger)

    const isMobile = window.matchMedia('(max-width: 768px)').matches

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })
      tl.fromTo('.cpc-label',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      ).fromTo('.cpc-heading-line',
        { autoAlpha: 0, y: 48 },
        { autoAlpha: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger: 0.11 },
        '-=0.4'
      ).fromTo('.cpc-meta',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.09 },
        '-=0.5'
      ).fromTo('.cpc-form',
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.6'
      )

      if (!isMobile) {
        // --- Parallax ---
        gsap.to('.cpc-label, .cpc-heading-line', {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: '40% top',
            scrub: 1.6,
            invalidateOnRefresh: true,
          },
        })
        gsap.utils.toArray<HTMLElement>('.cpc-meta').forEach((el) => {
          gsap.to(el, {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5, invalidateOnRefresh: true },
          })
        })
        gsap.to('.cpc-form', {
          y: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.cpc-form',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2.0,
            invalidateOnRefresh: true,
          },
        })
      }
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  const handleRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start)
    setEndDate(end)
    setSelectedDate(start)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const nameEl    = form.elements.namedItem('name')    as HTMLInputElement
    const emailEl   = form.elements.namedItem('email')   as HTMLInputElement
    const typeEl    = form.elements.namedItem('type')    as HTMLSelectElement
    const msgEl     = form.elements.namedItem('message') as HTMLTextAreaElement
    const companyEl = clientType === 'company'
      ? (form.elements.namedItem('company') as HTMLInputElement)
      : null

    const errors: string[] = []
    const errorFields = new Set<string>()

    if (!nameEl.value.trim()) { errors.push(FIELD_LABELS['name']); errorFields.add('name') }
    if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      errors.push(FIELD_LABELS['email']); errorFields.add('email')
    }
    if (!typeEl.value) { errors.push(FIELD_LABELS['type']); errorFields.add('type') }
    if (companyEl && !companyEl.value.trim()) { errors.push(FIELD_LABELS['company']); errorFields.add('company') }
    if (!msgEl.value.trim()) { errors.push(FIELD_LABELS['message']); errorFields.add('message') }

    if (errors.length > 0) {
      setFieldErrors(errorFields)
      setErrorList(errors)
      requestAnimationFrame(() => {
        const box = errorBoxRef.current
        if (box) {
          box.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          gsap.fromTo(box, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out' })
        }
      })
      return
    }

    setFieldErrors(new Set())
    setErrorList([])
    setSubmitted(true)
  }

  const clearFieldError = (field: string) => {
    if (fieldErrors.has(field)) {
      setFieldErrors(prev => { const n = new Set(prev); n.delete(field); return n })
    }
    if (errorList.length > 0) {
      setErrorList(prev => prev.filter(l => l !== FIELD_LABELS[field]))
    }
  }

  const inputClass = (field: string) => [
    'bg-surface-2 border rounded text-primary placeholder:text-primary/25 font-display text-[18px] px-4 py-3 focus:outline-none transition-colors duration-300 w-full',
    fieldErrors.has(field) ? 'border-accent/80 focus:border-accent' : 'border-white/10 focus:border-accent/60',
  ].join(' ')

  const labelClass = 'font-mono text-[13px] tracking-[0.18em] uppercase text-muted'

  return (
    <div ref={wrapperRef} className="min-h-screen pt-[72px]">
      <section className="py-24 md:py-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">

          <div className="mb-20 md:mb-28">
            <p className="cpc-label font-mono text-[14px] tracking-[0.22em] uppercase text-muted mb-8">{t.contactPage.label}</p>
            <h1
              className="font-display font-black leading-[0.88] tracking-normal"
              style={{ fontSize: 'clamp(52px, 7vw, 112px)' }}
            >
              <span className="cpc-heading-line block text-primary">{t.contactPage.heading1}</span>
              <span className="cpc-heading-line block text-accent">{t.contactPage.heading2}</span>
              <span className="cpc-heading-line block text-primary">{t.contactPage.heading3}</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start">

            {/* Left — info */}
            <div className="space-y-10">
              <div className="cpc-meta">
                <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-3">{t.contactPage.emailLabel}</p>
                <a href="mailto:grettfield@gmail.com" className="font-display text-[21px] md:text-[23px] text-primary hover:text-accent transition-colors duration-300 break-all">
                  grettfield@gmail.com
                </a>
              </div>
              <div className="cpc-meta">
                <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-3">{t.contactPage.basedInLabel}</p>
                <p className="font-display text-[15px] md:text-[19px] text-primary/75">Bogotá D.C, Colombia</p>
              </div>
              <div className="cpc-meta">
                <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-3">{t.contactPage.availabilityLabel}</p>
                <p className="font-display text-[15px] md:text-[19px] text-primary/75">{t.contactPage.availability}</p>
              </div>
              <div className="cpc-meta">
                <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-3">{t.contactPage.servicesLabel}</p>
                <ul className="space-y-1 list-none">
                  {t.contactPage.services.map((s: string) => (
                    <li key={s} className="font-display font-light text-[15px] md:text-[19px] text-primary/60">{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right — form */}
            <div className="cpc-form">
              {submitted ? (
                <div className="py-16 border-t border-white/10">
                  <p className="font-display font-semibold text-[22px] md:text-[27px] text-primary mb-3">{t.contactPage.formSent}</p>
                  <p className="font-display font-light text-[15px] md:text-[19px] text-muted">
                    {t.contactPage.formSentSub}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                  {/* Validation error box */}
                  {errorList.length > 0 && (
                    <div
                      ref={errorBoxRef}
                      className="border border-accent/40 rounded-xl p-4 bg-surface-2"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle size={15} strokeWidth={1.5} className="text-accent mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent mb-2">
                            {t.contactPage.formErrorTitle}
                          </p>
                          <ul className="list-none space-y-1">
                            {errorList.map(label => (
                              <li key={label} className="font-display text-[15px] text-primary/80">
                                — {label}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setErrorList([]); setFieldErrors(new Set()) }}
                          className="text-muted hover:text-primary transition-colors duration-200 shrink-0"
                          aria-label="Dismiss"
                        >
                          <X size={13} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="cp-name" className={labelClass}>{t.contactPage.formName}</label>
                      <input type="text" id="cp-name" name="name" autoComplete="name" placeholder="María García"
                        onChange={() => clearFieldError('name')} className={inputClass('name')} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="cp-email" className={labelClass}>{t.contactPage.formEmail}</label>
                      <input type="email" id="cp-email" name="email" autoComplete="email" placeholder="maria@ejemplo.com"
                        onChange={() => clearFieldError('email')} className={inputClass('email')} />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="cp-phone" className={labelClass}>
                      {t.contactPage.formPhone} <span className="normal-case text-muted/60">{t.contactPage.formPhoneOptional}</span>
                    </label>
                    <div className="flex gap-0">
                      <select
                        name="phone-code"
                        defaultValue="+57"
                        className="bg-surface-2 border border-white/10 border-r-0 rounded-l text-primary font-mono text-[14px] tracking-[0.05em] px-3 py-3 focus:outline-none focus:border-accent/60 transition-colors duration-300 shrink-0 cursor-pointer appearance-none"
                        style={{ colorScheme: 'dark' }}
                      >
                        {['+57','+1','+44','+34','+52','+54','+58','+51','+56','+593','+55','+598'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="tel" id="cp-phone" name="phone" autoComplete="tel" placeholder="300 000 0000"
                        className="bg-surface-2 border border-white/10 rounded-r text-primary placeholder:text-primary/25 font-display text-[18px] px-4 py-3 focus:outline-none focus:border-accent/60 transition-colors duration-300 w-full"
                      />
                    </div>
                  </div>

                  {/* Client type toggle */}
                  <div className="flex flex-col gap-3">
                    <p className={labelClass}>{t.contactPage.formClientType}</p>
                    <div className="grid grid-cols-2 border border-white/10 rounded overflow-hidden">
                      <button type="button" onClick={() => setClientType('individual')}
                        className={['py-3 font-mono text-[13px] tracking-[0.15em] uppercase transition-colors duration-200',
                          clientType === 'individual' ? 'bg-primary text-bg' : 'bg-surface-2 text-muted hover:text-primary'].join(' ')}>
                        {t.contactPage.formIndividual}
                      </button>
                      <button type="button" onClick={() => setClientType('company')}
                        className={['py-3 font-mono text-[13px] tracking-[0.15em] uppercase transition-colors duration-200 border-l border-white/10',
                          clientType === 'company' ? 'bg-primary text-bg' : 'bg-surface-2 text-muted hover:text-primary'].join(' ')}>
                        {t.contactPage.formCompany}
                      </button>
                    </div>
                  </div>

                  {clientType === 'company' && (
                    <div className="flex flex-col gap-2">
                      <label htmlFor="cp-company" className={labelClass}>{t.contactPage.formCompanyName}</label>
                      <input type="text" id="cp-company" name="company" placeholder={t.contactPage.formCompanyPlaceholder}
                        onChange={() => clearFieldError('company')} className={inputClass('company')} autoFocus />
                    </div>
                  )}

                  {/* Project type */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="cp-type" className={labelClass}>{t.contactPage.formProjectType}</label>
                    <div className="relative">
                      <select
                        id="cp-type" name="type" defaultValue=""
                        onChange={() => clearFieldError('type')}
                        className={`${inputClass('type')} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>{t.contactPage.formProjectTypeSelect}</option>
                        {t.contactPage.formProjectTypes.map((pt: { value: string; label: string }) => (
                          <option key={pt.value} value={pt.value}>{pt.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} strokeWidth={1.5} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="cp-message" className={labelClass}>{t.contactPage.formMessage}</label>
                    <textarea
                      id="cp-message" name="message" rows={6}
                      placeholder={t.contactPage.formMessagePlaceholder}
                      onChange={() => clearFieldError('message')}
                      className={`${inputClass('message')} resize-none`}
                    />
                  </div>

                  {/* Date availability */}
                  <div className="flex flex-col gap-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <span
                        className={['mt-0.5 w-5 h-5 shrink-0 border flex items-center justify-center transition-colors duration-200',
                          hasDate ? 'border-accent bg-accent' : 'border-white/20 group-hover:border-white/40'].join(' ')}
                        aria-hidden="true"
                      >
                        {hasDate && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <input type="checkbox" className="sr-only" checked={hasDate} onChange={e => setHasDate(e.target.checked)} />
                      <span className="font-mono text-[13px] tracking-[0.15em] uppercase text-muted group-hover:text-primary transition-colors duration-200">
                        {t.contactPage.formHasDate}
                      </span>
                    </label>

                    {hasDate && (
                      <div className="flex flex-col gap-2 pl-8">
                        <label className={labelClass}>{t.contactPage.formDateLabel}</label>
                        <input type="hidden" name="date-start" value={startDate ? startDate.toISOString().split('T')[0] : (selectedDate ? selectedDate.toISOString().split('T')[0] : '')} />
                        <input type="hidden" name="date-end" value={endDate ? endDate.toISOString().split('T')[0] : ''} />
                        <DatePicker
                          value={selectedDate}
                          onChange={setSelectedDate}
                          startDate={startDate}
                          endDate={endDate}
                          onRangeChange={handleRangeChange}
                          min={new Date()}
                        />
                        <p className="font-mono text-[12px] tracking-[0.1em] text-muted/60 uppercase">
                          {t.contactPage.formDateNote}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-bg font-mono text-[14px] tracking-[0.2em] uppercase py-4 rounded hover:bg-accent hover:text-primary transition-colors duration-300 active:scale-[0.99]"
                  >
                    {t.contactPage.formSend}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
