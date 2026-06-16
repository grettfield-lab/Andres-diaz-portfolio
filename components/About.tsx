'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'

export default function About() {
  const { t } = useLocale()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Entrance — slow-fast-slow
      gsap.fromTo('.about-manifesto',
        { autoAlpha: 0, y: 56 },
        {
          autoAlpha: 1, y: 0, duration: 1.1, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.about-manifesto', start: 'top 88%', once: true },
        }
      )
      gsap.fromTo('.about-bio p',
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1, y: 0, duration: 0.85, ease: 'power2.inOut', stagger: 0.12,
          scrollTrigger: { trigger: '.about-body', start: 'top 88%', once: true },
        }
      )
      gsap.fromTo('.about-bio a',
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.about-body', start: 'top 88%', once: true },
        }
      )
      gsap.fromTo('.about-portrait',
        { autoAlpha: 0, scale: 1.04 },
        {
          autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.about-body', start: 'top 88%', once: true },
        }
      )

      // Parallax — manifesto text
      gsap.to('.about-manifesto', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-manifesto',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.6,
          invalidateOnRefresh: true,
        },
      })

      // Parallax — bio text (subtle)
      gsap.to('.about-bio', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-body',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      })

      // Parallax — portrait image inner (stronger, within overflow:hidden)
      gsap.to('.about-portrait-img', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-portrait',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-surface/75 pt-24 md:pt-36 pb-11 md:pb-[60px] px-6 md:px-10"
      aria-label="About Andres Díaz"
    >
      {/* Manifesto */}
      <div className="about-manifesto mb-20 md:mb-28 max-w-[1400px] mx-auto">
        <p
          className="font-display font-black leading-[0.9] tracking-[-0.02em] text-primary"
          style={{ fontSize: 'clamp(40px, 6.5vw, 108px)' }}
        >
          {t.about.manifestoLine1}
          <br />
          <span className="text-accent">{t.about.manifestoAccent}</span>{' '}{t.about.manifestoLine2}
        </p>
      </div>

      {/* Bio + portrait */}
      <div className="about-body grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-12 md:gap-16 max-w-[1400px] mx-auto items-start">
        <div className="about-bio">
          <div className="space-y-5 mb-10">
            <p className="font-display font-light text-[19px] md:text-[21px] leading-relaxed text-primary/80 max-w-[55ch]">
              {t.about.bio1}
            </p>
            <p className="font-display font-light text-[19px] md:text-[21px] leading-relaxed text-primary/80 max-w-[55ch]">
              {t.about.bio2}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-3 font-mono text-[14px] tracking-[0.18em] uppercase text-primary bg-surface-2 border border-white/15 px-6 py-4 hover:border-accent hover:text-accent transition-colors duration-300 group w-fit"
            >
              <span>{t.about.fullStory}</span>
              <ArrowUpRight
                size={13}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* Portrait with oversized inner for parallax within overflow:hidden */}
        <div className="about-portrait relative overflow-hidden transform-gpu" style={{ aspectRatio: '4/5' }}>
          <div className="about-portrait-img absolute" style={{ inset: '-10%', willChange: 'transform' }}>
            <Image
              src="https://picsum.photos/seed/diaz-portrait-studio/800/1000"
              alt="Andres Díaz — Cinematographer"
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
