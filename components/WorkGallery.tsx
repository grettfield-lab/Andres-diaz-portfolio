'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export type WorkCategory = 'photography' | 'cinematography' | 'other-projects'

const categoryMeta: Record<WorkCategory, { title: string; sub: string; desc: string }> = {
  photography: {
    title: 'Photography',
    sub: 'Portrait · Editorial · Fine Art',
    desc: 'Still images built from patience and precision.',
  },
  cinematography: {
    title: 'Cinematography',
    sub: 'Feature · Documentary · Short Film',
    desc: 'Moving images told through light, framing, and time.',
  },
  'other-projects': {
    title: 'Other Projects',
    sub: 'Commercial · Visual Direction · Installation',
    desc: 'Cross-discipline work that defies a single category.',
  },
}

const projectsByCategory: Record<
  WorkCategory,
  { id: string; title: string; type: string; year: string; src: string; alt: string }[]
> = {
  photography: [
    { id: 'ph-1', title: 'Luz de Octubre',    type: 'Portrait Series', year: '2023', src: 'https://picsum.photos/seed/diaz-ph-luz/900/600',        alt: 'Luz de Octubre portrait series' },
    { id: 'ph-2', title: 'Retratos Nocturnos', type: 'Night Series',    year: '2023', src: 'https://picsum.photos/seed/diaz-ph-nocturnos/900/600',  alt: 'Retratos Nocturnos night photography' },
    { id: 'ph-3', title: 'Fragmentos',         type: 'Editorial',       year: '2024', src: 'https://picsum.photos/seed/diaz-ph-fragmentos/900/600', alt: 'Fragmentos editorial photography' },
    { id: 'ph-4', title: 'Silencio',           type: 'Fine Art',        year: '2022', src: 'https://picsum.photos/seed/diaz-ph-silencio/900/600',   alt: 'Silencio fine art series' },
    { id: 'ph-5', title: 'Tierra',             type: 'Landscape',       year: '2024', src: 'https://picsum.photos/seed/diaz-ph-tierra/900/600',     alt: 'Tierra landscape photography' },
    { id: 'ph-6', title: 'Retratos I',         type: 'Portrait',        year: '2023', src: 'https://picsum.photos/seed/diaz-ph-r1/900/600',         alt: 'Portrait series Retratos I' },
  ],
  cinematography: [
    { id: 'ci-1', title: 'Memoria Viva',      type: 'Documentary', year: '2024', src: 'https://picsum.photos/seed/diaz-ci-memoria/900/600',  alt: 'Memoria Viva documentary' },
    { id: 'ci-2', title: 'Tierra Adentro',    type: 'Feature Film', year: '2022', src: 'https://picsum.photos/seed/diaz-ci-tierra/900/600',  alt: 'Tierra Adentro feature film' },
    { id: 'ci-3', title: 'El Último Verano',  type: 'Short Film',  year: '2023', src: 'https://picsum.photos/seed/diaz-ci-verano/900/600',  alt: 'El Último Verano short film' },
    { id: 'ci-4', title: 'Raíces',            type: 'Documentary', year: '2021', src: 'https://picsum.photos/seed/diaz-ci-raices/900/600',  alt: 'Raíces documentary' },
    { id: 'ci-5', title: 'Noche Abierta',     type: 'Short Film',  year: '2020', src: 'https://picsum.photos/seed/diaz-ci-noche/900/600',   alt: 'Noche Abierta short film' },
    { id: 'ci-6', title: 'Frontera',          type: 'Feature Film', year: '2019', src: 'https://picsum.photos/seed/diaz-ci-frontera/900/600', alt: 'Frontera feature film' },
  ],
  'other-projects': [
    { id: 'ot-1', title: 'Campaign 01',    type: 'Commercial',       year: '2024', src: 'https://picsum.photos/seed/diaz-ot-camp1/900/600',  alt: 'Commercial campaign 01' },
    { id: 'ot-2', title: 'Brand Identity', type: 'Visual Direction', year: '2023', src: 'https://picsum.photos/seed/diaz-ot-brand/900/600',  alt: 'Brand identity visual direction' },
    { id: 'ot-3', title: 'Exposición',    type: 'Installation',     year: '2022', src: 'https://picsum.photos/seed/diaz-ot-exh/900/600',    alt: 'Exhibition installation' },
    { id: 'ot-4', title: 'Campaign 02',   type: 'Commercial',       year: '2024', src: 'https://picsum.photos/seed/diaz-ot-camp2/900/600',  alt: 'Commercial campaign 02' },
  ],
}

export default function WorkGallery({ category }: { category: WorkCategory }) {
  const sectionRef = useRef<HTMLElement>(null)
  const projects = projectsByCategory[category]
  const meta = categoryMeta[category]

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo('.wg-back',
        { autoAlpha: 0, x: -14 },
        { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 }
      )

      gsap.fromTo('.wg-heading',
        { autoAlpha: 0, y: 56 },
        { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 0.2 }
      )

      gsap.fromTo('.wg-image',
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.07,
          scrollTrigger: { trigger: '.wg-grid', start: 'top 88%', once: true, invalidateOnRefresh: true },
        }
      )

      gsap.fromTo('.wg-caption',
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: '.wg-grid', start: 'top 88%', once: true, invalidateOnRefresh: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [category])

  return (
    <section
      ref={sectionRef}
      className="pt-[72px] pb-24 md:pb-32 px-6 md:px-10"
      aria-label={meta.title}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="wg-heading pt-14 md:pt-20 mb-12 md:mb-16">
          <Link
            href="/"
            className="wg-back inline-flex items-center gap-2 font-mono text-[14px] tracking-[0.15em] uppercase text-muted hover:text-primary transition-colors duration-300 mb-10 group"
          >
            <ArrowLeft
              size={12}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden="true"
            />
            Back to home
          </Link>

          <p className="font-mono text-[14px] tracking-[0.22em] uppercase text-muted mb-3">
            Work
          </p>
          <h1
            className="font-display font-black leading-[0.9] tracking-normal text-primary"
            style={{ fontSize: 'clamp(48px, 7vw, 108px)' }}
          >
            {meta.title}
          </h1>
          <p className="font-mono text-[14px] tracking-[0.15em] uppercase text-muted mt-7 mb-4">
            {meta.sub}
          </p>
          <p className="font-display font-light text-[16px] md:text-[21px] text-muted max-w-[48ch]">
            {meta.desc}
          </p>
        </div>

        {/* Symmetric 3-column grid — equal aspect, no col-span mixing */}
        <div className="wg-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {projects.map((p) => (
            <div key={p.id} className="wg-card group cursor-default">
              <div className="wg-image overflow-hidden">
                <div
                  className="relative overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  style={{ aspectRatio: '3/2', willChange: 'transform' }}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </div>
              </div>
              <div className="wg-caption pt-3 pb-5">
                <p className="font-display font-semibold text-[17px] md:text-[19px] text-primary leading-snug">
                  {p.title}
                </p>
                <p className="font-mono text-[13px] tracking-[0.12em] uppercase text-muted mt-1">
                  {p.type} · {p.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
