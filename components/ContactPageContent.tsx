'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'

export default function ContactPageContent() {
  const [submitted, setSubmitted] = useState(false)
  const [clientType, setClientType] = useState<'individual' | 'company'>('individual')
  const [hasDate, setHasDate] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    gsap.registerPlugin(ScrollTrigger)

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
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputClass =
    'bg-surface-2 border border-white/10 rounded text-primary placeholder:text-primary/25 font-display text-[18px] px-4 py-3 focus:outline-none focus:border-accent/60 transition-colors duration-300 w-full'
  const labelClass = 'font-mono text-[13px] tracking-[0.18em] uppercase text-muted'

  return (
    <div ref={wrapperRef} className="min-h-screen pt-[72px]">
      <section className="py-24 md:py-36 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">

          {/* Page header */}
          <div className="mb-20 md:mb-28">
            <p className="cpc-label font-mono text-[14px] tracking-[0.22em] uppercase text-muted mb-8">
              Contact
            </p>
            <h1
              className="font-display font-black leading-[0.88] tracking-normal"
              style={{ fontSize: 'clamp(52px, 7vw, 112px)' }}
            >
              <span className="cpc-heading-line block text-primary">{"Let's create"}</span>
              <span className="cpc-heading-line block text-accent">something</span>
              <span className="cpc-heading-line block text-primary">together.</span>
            </h1>
          </div>

          {/* 2-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start">

            {/* Left — info */}
            <div className="space-y-10">
              <div className="cpc-meta">
                <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-3">Email</p>
                <a
                  href="mailto:grettfield@gmail.com"
                  className="font-display text-[21px] md:text-[23px] text-primary hover:text-accent transition-colors duration-300 break-all"
                >
                  grettfield@gmail.com
                </a>
              </div>

              <div className="cpc-meta">
                <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-3">Based in</p>
                <p className="font-display text-[15px] md:text-[19px] text-primary/75">Bogotá D.C, Colombia</p>
              </div>

              <div className="cpc-meta">
                <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-3">Availability</p>
                <p className="font-display text-[15px] md:text-[19px] text-primary/75">Open for projects in 2026</p>
              </div>

              <div className="cpc-meta">
                <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-3">Services</p>
                <ul className="space-y-1 list-none">
                  {['Cinematography', 'Photography', 'Documentary', 'Visual Direction'].map((s) => (
                    <li key={s} className="font-display font-light text-[15px] md:text-[19px] text-primary/60">{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right — form */}
            <div className="cpc-form">
              {submitted ? (
                <div className="py-16 border-t border-white/10">
                  <p className="font-display font-semibold text-[22px] md:text-[27px] text-primary mb-3">Message sent.</p>
                  <p className="font-display font-light text-[15px] md:text-[19px] text-muted">
                    I&apos;ll be in touch within 2 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                  {/* Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="cp-name" className={labelClass}>Name *</label>
                      <input type="text" id="cp-name" name="name" required autoComplete="name" placeholder="María García" className={inputClass} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="cp-email" className={labelClass}>Email *</label>
                      <input type="email" id="cp-email" name="email" required autoComplete="email" placeholder="maria@ejemplo.com" className={inputClass} />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="cp-phone" className={labelClass}>
                      Phone <span className="normal-case text-muted/60">(optional)</span>
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
                        type="tel"
                        id="cp-phone"
                        name="phone"
                        autoComplete="tel"
                        placeholder="300 000 0000"
                        className="bg-surface-2 border border-white/10 rounded-r text-primary placeholder:text-primary/25 font-display text-[18px] px-4 py-3 focus:outline-none focus:border-accent/60 transition-colors duration-300 w-full"
                      />
                    </div>
                  </div>

                  {/* Client type toggle */}
                  <div className="flex flex-col gap-3">
                    <p className={labelClass}>Type of client *</p>
                    <div className="grid grid-cols-2 border border-white/10 rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setClientType('individual')}
                        className={[
                          'py-3 font-mono text-[13px] tracking-[0.15em] uppercase transition-colors duration-200',
                          clientType === 'individual'
                            ? 'bg-primary text-bg'
                            : 'bg-surface-2 text-muted hover:text-primary',
                        ].join(' ')}
                      >
                        Individual
                      </button>
                      <button
                        type="button"
                        onClick={() => setClientType('company')}
                        className={[
                          'py-3 font-mono text-[13px] tracking-[0.15em] uppercase transition-colors duration-200 border-l border-white/10',
                          clientType === 'company'
                            ? 'bg-primary text-bg'
                            : 'bg-surface-2 text-muted hover:text-primary',
                        ].join(' ')}
                      >
                        Company / Project
                      </button>
                    </div>
                  </div>

                  {/* Company / project name — conditional */}
                  {clientType === 'company' && (
                    <div className="flex flex-col gap-2">
                      <label htmlFor="cp-company" className={labelClass}>Company or project name *</label>
                      <input
                        type="text"
                        id="cp-company"
                        name="company"
                        required
                        placeholder="Empresa S.A.S."
                        className={inputClass}
                        autoFocus
                      />
                    </div>
                  )}

                  {/* Project type */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="cp-type" className={labelClass}>Project type *</label>
                    <div className="relative">
                      <select
                        id="cp-type"
                        name="type"
                        required
                        defaultValue=""
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="" disabled>Select a category</option>
                        <option value="cinematography">Cinematography</option>
                        <option value="photography">Photography</option>
                        <option value="documentary">Documentary</option>
                        <option value="commercial">Commercial</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown
                        size={14}
                        strokeWidth={1.5}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="cp-message" className={labelClass}>Tell me about your project *</label>
                    <textarea
                      id="cp-message"
                      name="message"
                      required
                      rows={6}
                      placeholder="Cuéntame sobre tu proyecto: qué tienes en mente, cuándo lo necesitas, dónde será..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Date availability */}
                  <div className="flex flex-col gap-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <span
                        className={[
                          'mt-0.5 w-5 h-5 shrink-0 border flex items-center justify-center transition-colors duration-200',
                          hasDate ? 'border-accent bg-accent' : 'border-white/20 group-hover:border-white/40',
                        ].join(' ')}
                        aria-hidden="true"
                      >
                        {hasDate && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={hasDate}
                        onChange={(e) => setHasDate(e.target.checked)}
                      />
                      <span className="font-mono text-[13px] tracking-[0.15em] uppercase text-muted group-hover:text-primary transition-colors duration-200">
                        I have a specific project date
                      </span>
                    </label>

                    {hasDate && (
                      <div className="flex flex-col gap-2 pl-8">
                        <label htmlFor="cp-date" className={labelClass}>Project date *</label>
                        <input
                          type="date"
                          id="cp-date"
                          name="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className={`${inputClass} cursor-pointer`}
                          style={{ colorScheme: 'dark' }}
                        />
                        <p className="font-mono text-[12px] tracking-[0.1em] text-muted/60 uppercase">
                          Selecting a date sends a booking request — not a confirmation.
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-bg font-mono text-[14px] tracking-[0.2em] uppercase py-4 rounded hover:bg-accent hover:text-primary transition-colors duration-300 active:scale-[0.99]"
                  >
                    Send message
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
