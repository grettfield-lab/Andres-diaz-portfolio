'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'

export default function Services() {
  const { t } = useLocale()
  const sectionRef = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [originX, setOriginX] = useState(0)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Entrance — slow-fast-slow
      gsap.fromTo('.services-heading',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1, y: 0, duration: 0.85, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.services-heading', start: 'top 88%', once: true, invalidateOnRefresh: true },
        }
      )
      gsap.fromTo('.service-row',
        { autoAlpha: 0, x: -40, y: 14 },
        {
          autoAlpha: 1, x: 0, y: 0, duration: 0.85, ease: 'power2.inOut', stagger: 0.1,
          scrollTrigger: { trigger: '.services-list', start: 'top 88%', once: true, invalidateOnRefresh: true },
        }
      )

      // Parallax — heading
      gsap.to('.services-heading', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.services-heading',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.6,
          invalidateOnRefresh: true,
        },
      })

      // Parallax — service rows (slight depth, staggered by position)
      gsap.utils.toArray<HTMLElement>('.service-row').forEach((row, i) => {
        gsap.to(row, {
          yPercent: -(5 + i * 1.5),
          ease: 'none',
          scrollTrigger: {
            trigger: row,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5 + i * 0.1,
            invalidateOnRefresh: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setOriginX(e.clientX - rect.left)
    setHovered(idx)
  }

  return (
    <section
      ref={sectionRef}
      id="services"
      className="pt-[60px] md:pt-[76px] pb-32 md:pb-44"
      aria-label="Services"
    >
      <h2 className="services-heading font-display font-black text-3xl md:text-4xl tracking-normal text-primary mb-14 md:mb-16 px-6 md:px-10 max-w-[1400px] mx-auto">
        {t.services.heading}
      </h2>

      <ul className="services-list list-none divide-y divide-white/5" role="list">
        {t.services.items.map((s, idx) => {
          const on = hovered === idx
          return (
            <li key={s.num} className="service-row">
              <div
                className="relative py-7 md:py-9 cursor-default overflow-hidden select-none"
                onMouseEnter={(e) => handleEnter(e, idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Warm white box — full viewport width */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none will-change-transform"
                  style={{
                    background: 'rgba(254,252,240,0.75)',
                    transformOrigin: `${originX}px center`,
                    transform: on ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
                  }}
                />

                {/* Content centered */}
                <div className="relative z-10 flex items-center gap-6 md:gap-10 max-w-[1400px] mx-auto px-6 md:px-10">
                  <span
                    className="font-mono text-[14px] tracking-[0.2em] shrink-0 w-8 transition-colors duration-300"
                    style={{ color: on ? '#E84B2A' : '#8A8480' }}
                  >
                    {s.num}
                  </span>

                  <div className="flex-1 min-w-0">
                    <span
                      className="block font-display font-black tracking-normal transition-colors duration-300"
                      style={{
                        fontSize: 'clamp(22px, 3vw, 42px)',
                        color: on ? '#0A0A0A' : '#F0EDE8',
                      }}
                    >
                      {s.name}
                    </span>
                    <span
                      className="block font-display font-light text-[17px] mt-1 max-w-[50ch] transition-colors duration-300"
                      style={{ color: on ? 'rgba(10,10,10,0.65)' : '#8A8480' }}
                    >
                      {s.desc}
                    </span>
                  </div>

                  <ArrowRight
                    size={20}
                    strokeWidth={1.5}
                    className="shrink-0 transition-all duration-300"
                    style={{
                      color: on ? '#E84B2A' : '#8A8480',
                      transform: on ? 'translateX(8px)' : 'translateX(0)',
                    }}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
