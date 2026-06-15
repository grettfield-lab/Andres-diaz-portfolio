'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from('.about-manifesto', {
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-manifesto',
          start: 'top 100%',
          once: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.from('.about-bio p', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.about-body',
          start: 'top 100%',
          once: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.from('.about-bio a', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-body',
          start: 'top 100%',
          once: true,
          invalidateOnRefresh: true,
        },
      })

      gsap.from('.about-portrait', {
        opacity: 0,
        scale: 1.06,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-body',
          start: 'top 100%',
          once: true,
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
      className="bg-surface/80 py-24 md:py-36 px-6 md:px-10"
      aria-label="About Andres Díaz"
    >
      {/* Manifesto */}
      <div className="about-manifesto mb-20 md:mb-28 max-w-[1400px] mx-auto">
        <p
          className="font-display font-black leading-[0.9] tracking-[-0.02em] text-primary"
          style={{ fontSize: 'clamp(40px, 6.5vw, 108px)' }}
        >
          {'CRAFT IS PATIENCE.'}
          <br />
          <span className="text-accent">VISION</span>{' IS EVERYTHING.'}
        </p>
      </div>

      {/* Bio + portrait */}
      <div className="about-body grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-12 md:gap-16 max-w-[1400px] mx-auto items-start">
        <div className="about-bio">
          <div className="space-y-5 mb-10">
            <p className="font-display font-light text-[19px] md:text-[21px] leading-relaxed text-primary/80 max-w-[55ch]">
              Andres Díaz is a cinematographer and photographer based in Bogotá, Colombia. Over more than a decade behind the lens, he has built a practice that moves across documentary, narrative fiction, and commercial production.
            </p>
            <p className="font-display font-light text-[19px] md:text-[21px] leading-relaxed text-primary/80 max-w-[55ch]">
              His work has screened at international festivals and appeared in campaigns for cultural institutions and independent brands. He approaches each project as a close collaboration — building images from patience, observation, and trust.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-3 font-mono text-[14px] tracking-[0.18em] uppercase text-primary bg-surface-2 border border-white/15 px-6 py-4 hover:border-accent hover:text-accent transition-colors duration-300 group w-fit"
            >
              <span>Full story</span>
              <ArrowUpRight
                size={13}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        <div className="about-portrait relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
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
    </section>
  )
}
