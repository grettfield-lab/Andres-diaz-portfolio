'use client'

import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from('.service-row', {
        opacity: 0,
        x: -32,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.services-list',
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-32 md:py-44 px-6 md:px-10 max-w-[1400px] mx-auto"
      aria-label="Services"
    >
      <h2 className="font-display font-700 text-3xl md:text-4xl tracking-normal text-primary mb-14 md:mb-16">
        What I do
      </h2>

      <ul className="services-list list-none divide-y divide-white/5" role="list">
        {services.map((s) => (
          <li key={s.num} className="service-row group">
            <a
              href="#contact"
              className="flex items-center gap-6 md:gap-10 py-7 md:py-9 hover:text-accent transition-colors duration-300"
            >
              <span className="font-mono text-[14px] tracking-[0.2em] text-muted shrink-0 w-8">
                {s.num}
              </span>
              <div className="flex-1 min-w-0">
                <span
                  className="block font-display font-700 tracking-normal text-primary group-hover:text-accent transition-colors duration-300"
                  style={{ fontSize: 'clamp(22px, 3vw, 42px)' }}
                >
                  {s.name}
                </span>
                <span className="block font-display font-300 text-[17px] text-muted mt-1 max-w-[50ch]">
                  {s.desc}
                </span>
              </div>
              <ArrowRight
                size={20}
                strokeWidth={1.5}
                className="shrink-0 text-muted transition-all duration-300 group-hover:text-accent group-hover:translate-x-2"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
