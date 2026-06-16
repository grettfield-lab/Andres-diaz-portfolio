'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { ArrowRight, X, AlertCircle } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'

export default function Contact() {
  const { t } = useLocale()
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set())
  const [errorList, setErrorList] = useState<string[]>([])
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const errorBoxRef = useRef<HTMLDivElement>(null)

  const FIELD_LABELS: Record<string, string> = {
    name: t.contact.formName.replace(' *', ''),
    email: t.contact.formEmail.replace(' *', ''),
    message: t.contact.formMessage.replace(' *', ''),
  }

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo('.ct-heading-line',
        { autoAlpha: 0, y: 72 },
        {
          autoAlpha: 1, y: 0, duration: 0.95, ease: 'power2.inOut', stagger: 0.1,
          scrollTrigger: { trigger: '.ct-heading', start: 'top 88%', once: true },
        }
      )
      gsap.fromTo('.ct-info-item',
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.09,
          scrollTrigger: { trigger: '.ct-info-row', start: 'top 88%', once: true },
        }
      )
      gsap.fromTo('.ct-cta-btn',
        { autoAlpha: 0, y: 28, scale: 0.97 },
        {
          autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.ct-cta-btn', start: 'top 92%', once: true },
        }
      )

      // Parallax — heading
      gsap.to('.ct-heading', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ct-heading',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.6,
          invalidateOnRefresh: true,
        },
      })

      // Parallax — info row (subtle)
      gsap.to('.ct-info-row', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ct-info-row',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.7,
          invalidateOnRefresh: true,
        },
      })

      // Parallax — CTA button (very subtle)
      gsap.to('.ct-cta-btn', {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ct-cta-btn',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const openModal = () => {
    setModalOpen(true)
    setFieldErrors(new Set())
    setErrorList([])
    document.body.style.overflow = 'hidden'
    const overlay = overlayRef.current
    const card = cardRef.current
    if (!overlay || !card) return
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    gsap.fromTo(card, { opacity: 0, y: 32, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' })
  }

  const closeModal = () => {
    const overlay = overlayRef.current
    const card = cardRef.current
    if (!overlay || !card) return
    gsap.to(card, { opacity: 0, y: 20, scale: 0.97, duration: 0.25, ease: 'power2.in' })
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setModalOpen(false)
        document.body.style.overflow = ''
        if (submitted) setTimeout(() => setSubmitted(false), 100)
      },
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const nameEl  = form.elements.namedItem('name')    as HTMLInputElement
    const emailEl = form.elements.namedItem('email')   as HTMLInputElement
    const msgEl   = form.elements.namedItem('message') as HTMLTextAreaElement

    const errors: string[] = []
    const errorFields = new Set<string>()

    if (!nameEl.value.trim()) { errors.push(FIELD_LABELS['name']); errorFields.add('name') }
    if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      errors.push(FIELD_LABELS['email']); errorFields.add('email')
    }
    if (!msgEl.value.trim()) { errors.push(FIELD_LABELS['message']); errorFields.add('message') }

    if (errors.length > 0) {
      setFieldErrors(errorFields)
      setErrorList(errors)
      requestAnimationFrame(() => {
        const box = errorBoxRef.current
        if (box) gsap.fromTo(box, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out' })
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
    'bg-surface-2 border rounded text-primary placeholder:text-primary/25 font-display text-[19px] px-4 py-3 focus:outline-none transition-colors duration-300',
    fieldErrors.has(field) ? 'border-accent/80 focus:border-accent' : 'border-white/10 focus:border-accent/60',
  ].join(' ')

  return (
    <>
      <section
        ref={sectionRef}
        id="contact"
        className="bg-surface/75 py-32 md:py-44 px-6 md:px-10"
        aria-label="Contact"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="ct-heading mb-16 md:mb-20">
            <h2
              className="font-display font-black leading-[0.9] tracking-normal"
              style={{ fontSize: 'clamp(42px, 5.5vw, 88px)' }}
            >
              <span className="ct-heading-line block text-primary">{t.contact.heading1}</span>
              <span className="ct-heading-line block text-accent">{t.contact.heading2}</span>
            </h2>
          </div>

          <div className="ct-info-row flex flex-col sm:flex-row sm:items-end gap-8 md:gap-16 mb-20 md:mb-24">
            <div className="ct-info-item">
              <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-2">{t.contact.emailLabel}</p>
              <a
                href="mailto:grettfield@gmail.com"
                className="font-display text-[15px] md:text-[19px] text-primary hover:text-accent transition-colors duration-300 break-all"
              >
                grettfield@gmail.com
              </a>
            </div>
            <div className="ct-info-item">
              <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-2">{t.contact.basedInLabel}</p>
              <p className="font-display text-[15px] md:text-[19px] text-primary/70">Bogotá D.C, Colombia</p>
            </div>
            <div className="ct-info-item sm:ml-auto">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-mono text-[14px] tracking-[0.18em] uppercase text-muted hover:text-primary transition-colors duration-300 group"
              >
                <span>{t.contact.fullContactPage}</span>
                <ArrowRight size={11} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={openModal}
              className="ct-cta-btn group inline-flex items-center gap-3 md:gap-4 font-mono text-[13px] md:text-[14px] tracking-[0.2em] uppercase text-bg bg-primary px-8 py-4 md:px-12 md:py-5 hover:bg-accent transition-colors duration-300"
            >
              <span>{t.contact.connectWithMe}</span>
              <ArrowRight size={14} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[9100] flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label={t.contact.modalTitle}
        >
          <div className="absolute inset-0 bg-bg/90 backdrop-blur-sm" onClick={closeModal} />

          <div
            ref={cardRef}
            className="relative z-10 bg-surface border border-white/10 rounded-2xl w-full max-w-[540px] p-8 md:p-12 overflow-hidden"
          >
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-muted hover:text-primary transition-colors duration-300"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {submitted ? (
              <div className="py-6">
                <p className="font-display font-semibold text-[27px] text-primary mb-3">{t.contact.formSent}</p>
                <p className="font-display font-light text-base text-muted">
                  {t.contact.formSentSub}
                </p>
              </div>
            ) : (
              <>
                <p className="font-mono text-[13px] tracking-[0.22em] uppercase text-muted mb-6">
                  {t.contact.modalTitle}
                </p>

                {/* Validation error box */}
                {errorList.length > 0 && (
                  <div
                    ref={errorBoxRef}
                    className="border border-accent/40 rounded-xl p-4 mb-5 bg-surface-2"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle size={15} strokeWidth={1.5} className="text-accent mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent mb-2">
                          {t.contact.formErrorTitle}
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

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="modal-name" className="font-mono text-[14px] tracking-[0.18em] uppercase text-muted">
                        {t.contact.formName}
                      </label>
                      <input
                        type="text"
                        id="modal-name"
                        name="name"
                        autoComplete="name"
                        placeholder={t.contact.formNamePlaceholder}
                        onChange={() => clearFieldError('name')}
                        className={inputClass('name')}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="modal-email" className="font-mono text-[14px] tracking-[0.18em] uppercase text-muted">
                        {t.contact.formEmail}
                      </label>
                      <input
                        type="email"
                        id="modal-email"
                        name="email"
                        autoComplete="email"
                        placeholder={t.contact.formEmailPlaceholder}
                        onChange={() => clearFieldError('email')}
                        className={inputClass('email')}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="modal-message" className="font-mono text-[14px] tracking-[0.18em] uppercase text-muted">
                      {t.contact.formMessage}
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      rows={5}
                      placeholder={t.contact.formMessagePlaceholder}
                      onChange={() => clearFieldError('message')}
                      className={`${inputClass('message')} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-bg font-mono text-[14px] tracking-[0.2em] uppercase py-4 rounded hover:bg-accent hover:text-primary transition-colors duration-300 active:scale-[0.99]"
                  >
                    {t.contact.formSend}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
