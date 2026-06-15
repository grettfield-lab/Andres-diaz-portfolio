'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

const services = [
  {
    num: '01',
    name: 'Narrative Filmmaking',
    desc: 'Short and feature-length narrative projects from development through post.',
  },
  {
    num: '02',
    name: 'Documentary Direction',
    desc: 'Long-form and short documentary, observational and portrait-driven work.',
  },
  {
    num: '03',
    name: 'Commercial Photography',
    desc: 'Brand photography for products, editorial, campaigns, and cultural clients.',
  },
  {
    num: '04',
    name: 'Visual Direction',
    desc: 'Creative and visual direction for campaigns, brands, and artist projects.',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [originX, setOriginX] = useState(0)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo('.service-row',
        { autoAlpha: 0, x: -40, y: 14 },
        {
          autoAlpha: 1, x: 0, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.services-list', start: 'top 88%', once: true },
        }
      )
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
      className="py-32 md:py-44 px-6 md:px-10 max-w-[1400px] mx-auto"
      aria-label="Services"
    >
      <h2 className="font-display font-black text-3xl md:text-4xl tracking-normal text-primary mb-14 md:mb-16">
        What I do
      </h2>

      <ul className="services-list list-none divide-y divide-white/5" role="list">
        {services.map((s, idx) => {
          const on = hovered === idx
          return (
            <li key={s.num} className="service-row">
              <div
                className="relative flex items-center gap-6 md:gap-10 py-7 md:py-9 cursor-default overflow-hidden select-none"
                onMouseEnter={(e) => handleEnter(e, idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Warm white box — expands from cursor entry point */}
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

                {/* Number */}
                <span
                  className="relative z-10 font-mono text-[14px] tracking-[0.2em] shrink-0 w-8 transition-colors duration-300"
                  style={{ color: on ? '#E84B2A' : '#8A8480' }}
                >
                  {s.num}
                </span>

                {/* Text */}
                <div className="relative z-10 flex-1 min-w-0">
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

                {/* Arrow */}
                <ArrowRight
                  size={20}
                  strokeWidth={1.5}
                  className="relative z-10 shrink-0 transition-all duration-300"
                  style={{
                    color: on ? '#E84B2A' : '#8A8480',
                    transform: on ? 'translateX(8px)' : 'translateX(0)',
                  }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
