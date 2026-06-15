'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    id: 'photography',
    label: 'Photography',
    href: '/work/photography',
    projects: [
      {
        id: 'luz-octubre',
        title: 'Luz de Octubre',
        desc: 'Analog portraits shot at golden hour in the outskirts of Bogotá.',
        type: 'Portrait Series',
        year: '2023',
        src: 'https://picsum.photos/seed/diaz-luz-octubre/600/800',
        alt: 'Portrait from Luz de Octubre series',
      },
      {
        id: 'retratos-nocturnos',
        title: 'Retratos Nocturnos',
        desc: 'Long-exposure studies of faces under urban artificial light.',
        type: 'Night Series',
        year: '2023',
        src: 'https://picsum.photos/seed/diaz-retratos-nocturnos/600/800',
        alt: 'Night photography Retratos Nocturnos',
      },
      {
        id: 'silencio',
        title: 'Silencio',
        desc: 'A body of work exploring quietude in post-industrial landscapes.',
        type: 'Fine Art',
        year: '2022',
        src: 'https://picsum.photos/seed/diaz-ph-silencio/600/800',
        alt: 'Silencio fine art series',
      },
      {
        id: 'fragmentos-ph',
        title: 'Fragmentos',
        desc: 'Art direction and editorial photography for an independent cultural magazine.',
        type: 'Editorial',
        year: '2024',
        src: 'https://picsum.photos/seed/diaz-ph-fragmentos/600/800',
        alt: 'Fragmentos editorial photography',
      },
    ],
  },
  {
    id: 'cinematography',
    label: 'Cinematography',
    href: '/work/cinematography',
    projects: [
      {
        id: 'memoria-viva',
        title: 'Memoria Viva',
        desc: 'Feature-length documentary following displaced communities in rural Colombia.',
        type: 'Documentary',
        year: '2024',
        src: 'https://picsum.photos/seed/diaz-memoria-viva/600/800',
        alt: 'Film still Memoria Viva documentary',
      },
      {
        id: 'tierra-adentro',
        title: 'Tierra Adentro',
        desc: 'Shot on 16mm — a drama about identity and memory on the Colombian border.',
        type: 'Feature Film',
        year: '2022',
        src: 'https://picsum.photos/seed/diaz-tierra-adentro/600/800',
        alt: 'Cinematography from Tierra Adentro',
      },
      {
        id: 'ultimo-verano',
        title: 'El Último Verano',
        desc: 'An intimate portrait of adolescence during the last days of summer.',
        type: 'Short Film',
        year: '2023',
        src: 'https://picsum.photos/seed/diaz-ultimo-verano/600/800',
        alt: 'Short film El Último Verano',
      },
      {
        id: 'raices',
        title: 'Raíces',
        desc: 'Documentary following indigenous communities deep in the Colombian Amazon.',
        type: 'Documentary',
        year: '2021',
        src: 'https://picsum.photos/seed/diaz-ci-raices-lp/600/800',
        alt: 'Raíces documentary film',
      },
    ],
  },
  {
    id: 'other-projects',
    label: 'Another Projects',
    href: '/work/other-projects',
    projects: [
      {
        id: 'fragmentos',
        title: 'Fragmentos',
        desc: 'Art direction and visual identity for an independent cultural magazine.',
        type: 'Visual Direction',
        year: '2024',
        src: 'https://picsum.photos/seed/diaz-fragmentos/600/800',
        alt: 'Visual direction Fragmentos',
      },
      {
        id: 'campaign-01',
        title: 'Campaign 01',
        desc: 'Brand film and stills campaign for a Colombian fashion label.',
        type: 'Commercial',
        year: '2024',
        src: 'https://picsum.photos/seed/diaz-ot-camp1/600/800',
        alt: 'Commercial campaign 01',
      },
    ],
  },
]

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from('.work-main-heading', {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.work-main-heading',
          start: 'top 90%',
          invalidateOnRefresh: true,
        },
      })

      gsap.utils.toArray<HTMLElement>('.work-category').forEach((section) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 88%',
            invalidateOnRefresh: true,
          },
        })
        tl.from(section.querySelector('.work-section-header'), {
          opacity: 0,
          y: 18,
          duration: 0.6,
          ease: 'power3.out',
        }).from(
          section.querySelectorAll('.work-card'),
          {
            opacity: 0,
            y: 44,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.07,
            force3D: true,
          },
          '-=0.3',
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="py-20 md:py-28 px-6 md:px-10"
      aria-label="Selected work"
    >
      <div className="max-w-[1400px] mx-auto">
        <h2 className="work-main-heading font-display font-black text-3xl md:text-4xl tracking-normal text-primary mb-20 md:mb-28">
          Selected work
        </h2>

        <div className="space-y-10 md:space-y-14">
          {categories.map((cat) => (
            <div key={cat.id} className="work-category">
              {/* Category header */}
              <div className="work-section-header flex items-center justify-between mb-10 md:mb-12 pb-4 border-b border-white/10">
                <p className="font-mono text-[14px] tracking-[0.22em] uppercase text-muted">
                  {cat.label}
                </p>
                <Link
                  href={cat.href}
                  className="inline-flex items-center gap-2 font-mono text-[13px] tracking-[0.15em] uppercase text-muted hover:text-primary transition-colors duration-300 group"
                >
                  <span>View all</span>
                  <ArrowRight
                    size={10}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>

              {/* Grid — 2 cols for even symmetry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                {cat.projects.map((p) => (
                  <Link
                    key={p.id}
                    href={cat.href}
                    className="work-card group block"
                  >
                    {/* Image */}
                    <div className="overflow-hidden mb-5">
                      <div
                        className="relative overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        style={{ aspectRatio: '4/5', willChange: 'transform' }}
                      >
                        <Image
                          src={p.src}
                          alt={p.alt}
                          fill
                          className="object-cover"
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100" />
                      </div>
                    </div>

                    {/* Text */}
                    <p className="font-display font-semibold text-[17px] md:text-[19px] text-primary mb-1.5 leading-snug">
                      {p.title}
                    </p>
                    <p className="font-mono text-[13px] tracking-[0.15em] uppercase text-muted">
                      {p.type} · {p.year}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
