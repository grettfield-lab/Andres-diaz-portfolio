'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'

export default function Contact() {
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from('.ct-heading-line', {
        opacity: 0,
        y: 96,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.ct-heading',
          start: 'top 100%',
          once: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.from('.ct-info-item', {
        opacity: 0,
        y: 36,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.ct-info-row',
          start: 'top 100%',
          once: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.from('.ct-cta-btn', {
        opacity: 0,
        y: 36,
        scale: 0.96,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.ct-cta-btn',
          start: 'top 100%',
          once: true,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const openModal = () => {
    setModalOpen(true)
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
    setSubmitted(true)
  }

  return (
    <>
      <section
        ref={sectionRef}
        id="contact"
        className="bg-surface/80 py-32 md:py-44 px-6 md:px-10"
        aria-label="Contact"
      >
        <div className="max-w-[1400px] mx-auto">

          {/* Heading */}
          <div className="ct-heading mb-16 md:mb-20">
            <h2
              className="font-display font-black leading-[0.9] tracking-normal"
              style={{ fontSize: 'clamp(42px, 5.5vw, 88px)' }}
            >
              <span className="ct-heading-line block text-primary">{"Let's create"}</span>
              <span className="ct-heading-line block text-accent">something.</span>
            </h2>
          </div>

          {/* Info row */}
          <div className="ct-info-row flex flex-col sm:flex-row sm:items-end gap-8 md:gap-16 mb-20 md:mb-24">
            <div className="ct-info-item">
              <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-2">
                Email
              </p>
              <a
                href="mailto:grettfield@gmail.com"
                className="font-display text-[19px] text-primary hover:text-accent transition-colors duration-300"
              >
                grettfield@gmail.com
              </a>
            </div>

            <div className="ct-info-item">
              <p className="font-mono text-[13px] tracking-[0.2em] uppercase text-muted mb-2">
                Based in
              </p>
              <p className="font-display text-[19px] text-primary/70">
                Bogotá D.C, Colombia
              </p>
            </div>

            <div className="ct-info-item sm:ml-auto">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-mono text-[14px] tracking-[0.18em] uppercase text-muted hover:text-primary transition-colors duration-300 group"
              >
                <span>Full contact page</span>
                <ArrowRight
                  size={11}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Centered CTA */}
          <div className="flex justify-center">
            <button
              onClick={openModal}
              className="ct-cta-btn group inline-flex items-center gap-4 font-mono tracking-[0.22em] uppercase text-bg bg-primary px-12 py-5 hover:bg-accent transition-colors duration-300"
              style={{ fontSize: 'clamp(11px, 1.1vw, 14px)' }}
            >
              <span>Connect with me</span>
              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Modal overlay — always in DOM, visibility controlled by state */}
      {modalOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[9100] flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Start a project"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-bg/90 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Card */}
          <div
            ref={cardRef}
            className="relative z-10 bg-surface border border-white/10 w-full max-w-[540px] p-8 md:p-12"
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-muted hover:text-primary transition-colors duration-300"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {submitted ? (
              <div className="py-6">
                <p className="font-display font-semibold text-[27px] text-primary mb-3">
                  Message sent.
                </p>
                <p className="font-display font-light text-base text-muted">
                  I&apos;ll be in touch within 2 business days.
                </p>
              </div>
            ) : (
              <>
                <p className="font-mono text-[13px] tracking-[0.22em] uppercase text-muted mb-6">
                  Start a project
                </p>
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="modal-name"
                        className="font-mono text-[14px] tracking-[0.18em] uppercase text-muted"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="modal-name"
                        name="name"
                        required
                        autoComplete="name"
                        className="bg-surface-2 border border-white/10 text-primary font-display text-[19px] px-4 py-3 focus:outline-none focus:border-accent/60 transition-colors duration-300"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="modal-email"
                        className="font-mono text-[14px] tracking-[0.18em] uppercase text-muted"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="modal-email"
                        name="email"
                        required
                        autoComplete="email"
                        className="bg-surface-2 border border-white/10 text-primary font-display text-[19px] px-4 py-3 focus:outline-none focus:border-accent/60 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="modal-message"
                      className="font-mono text-[14px] tracking-[0.18em] uppercase text-muted"
                    >
                      Tell me about your project
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      required
                      rows={5}
                      className="bg-surface-2 border border-white/10 text-primary font-display text-[19px] px-4 py-3 focus:outline-none focus:border-accent/60 transition-colors duration-300 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-bg font-mono text-[14px] tracking-[0.2em] uppercase py-4 hover:bg-accent hover:text-primary transition-colors duration-300 active:scale-[0.99]"
                  >
                    Send message
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
