'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const descriptorRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    gsap.config({ force3D: true })
    gsap.ticker.lagSmoothing(0)
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (!prefersReduced) {
        const tl = gsap.timeline({ delay: 0.15 })
        tl.from(descriptorRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.85,
          ease: 'power3.out',
        })
          .from(
            headlineRef.current?.querySelectorAll('.hero-line') ?? [],
            { opacity: 0, y: 110, duration: 1.15, ease: 'power3.out', stagger: 0.12 },
            '-=0.4',
          )
          .from(ctaRef.current, { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' }, '-=0.5')
          .from(
            imgRef.current,
            { opacity: 0, scale: 1.14, duration: 1.4, ease: 'power3.out' },
            '-=1.0',
          )

        gsap.to(imgRef.current, {
          yPercent: 28,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.8,
            invalidateOnRefresh: true,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100dvh] grid grid-cols-1 md:grid-cols-[45%_55%] pt-[72px]"
      aria-label="Introduction"
    >
      {/* Left — text */}
      <div className="flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-10 order-2 md:order-1">
        <p
          ref={descriptorRef}
          className="font-mono text-[14px] tracking-[0.22em] uppercase text-muted mb-8"
        >
          Filmmaker + Photographer
        </p>

        <h1
          ref={headlineRef}
          className="font-display font-black leading-[0.88] tracking-normal text-primary mb-12"
          style={{ fontSize: 'clamp(72px, 9vw, 148px)' }}
        >
          <span className="hero-line block">ANDRES</span>
          <span className="hero-line block text-accent">DIAZ</span>
        </h1>

        <a
          ref={ctaRef}
          href="#work"
          className="inline-flex items-center gap-3 font-mono text-[14px] tracking-[0.18em] uppercase text-primary group w-fit"
          aria-label="View selected work"
        >
          <span>View selected work</span>
          <ArrowRight
            size={14}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden="true"
          />
        </a>
      </div>

      {/* Right — image */}
      <div className="relative overflow-hidden order-1 md:order-2 h-[44vh] md:h-auto min-h-[220px]">
        <div ref={imgRef} className="absolute inset-0 scale-[1.06]" style={{ willChange: 'transform' }}>
          <Image
            src="https://picsum.photos/seed/ferro-cinematic-hero/900/1200"
            alt="Cinematic still from Andres Díaz"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 55vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  )
}
