'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLocale } from '@/contexts/LocaleContext'

const credits = [
  { role: 'Feature Film', project: 'Tierra Adentro', year: '2022', note: 'Cinematographer' },
  { role: 'Documentary', project: 'Memoria Viva', year: '2024', note: 'Director & DP' },
  { role: 'Short Film', project: 'El Último Verano', year: '2023', note: 'Cinematographer' },
  { role: 'Photography', project: 'Retratos Nocturnos', year: '2023', note: 'Photographer' },
  { role: 'Documentary', project: 'Raíces', year: '2021', note: 'Director of Photography' },
  { role: 'Commercial', project: 'Fragmentos', year: '2024', note: 'Visual Director' },
]

const awards = [
  { year: '2024', title: 'Best Cinematography', event: 'Festival de Cine de Bogotá', project: 'Memoria Viva', status: 'Winner' },
  { year: '2023', title: 'Special Jury Award', event: 'Lima DocFest', project: 'El Último Verano', status: 'Nominee' },
  { year: '2023', title: 'Best Short Film', event: 'FICCI — Festival Internacional de Cine de Cartagena', project: 'El Último Verano', status: 'Nominee' },
  { year: '2022', title: 'Best Cinematography', event: 'Bogoshorts', project: 'Tierra Adentro', status: 'Winner' },
  { year: '2021', title: 'Documentary Competition', event: 'San Sebastián International Film Festival', project: 'Raíces', status: 'Nominee' },
  { year: '2021', title: 'Best Photography', event: 'FIAF — Festival de la Imagen', project: 'Silencio', status: 'Nominee' },
]

export default function AboutPageContent() {
  const { t } = useLocale()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const roleMap: Record<string, string> = {
    'Feature Film': t.aboutPage.creditRoles.featureFilm,
    'Documentary': t.aboutPage.creditRoles.documentary,
    'Short Film': t.aboutPage.creditRoles.shortFilm,
    'Photography': t.aboutPage.creditRoles.photography,
    'Commercial': t.aboutPage.creditRoles.commercial,
  }

  const noteMap: Record<string, string> = {
    'Cinematographer': t.aboutPage.creditNotes.cinematographer,
    'Director & DP': t.aboutPage.creditNotes.directorDP,
    'Photographer': t.aboutPage.creditNotes.photographer,
    'Director of Photography': t.aboutPage.creditNotes.directorOfPhotography,
    'Visual Director': t.aboutPage.creditNotes.visualDirector,
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    gsap.registerPlugin(ScrollTrigger)

    const isMobile = window.matchMedia('(max-width: 768px)').matches

    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo('.apc-hero-label',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out', delay: 0.3 }
      )
      gsap.fromTo('.apc-hero-name',
        { autoAlpha: 0, y: 80 },
        { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.45 }
      )
      gsap.fromTo('.apc-hero-img',
        { autoAlpha: 0, scale: 1.08 },
        { autoAlpha: 1, scale: 1, duration: 1.6, ease: 'power3.out', delay: 0.1 }
      )

      // Bio section
      gsap.fromTo('.apc-bio-head',
        { autoAlpha: 0, x: -48 },
        {
          autoAlpha: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.apc-bio-section', start: 'top 88%', once: true, invalidateOnRefresh: true },
        }
      )
      gsap.fromTo('.apc-bio-para',
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out', stagger: 0.13,
          scrollTrigger: { trigger: '.apc-bio-section', start: 'top 88%', once: true, invalidateOnRefresh: true },
        }
      )

      // Manifesto
      gsap.fromTo('.apc-manifesto-line',
        { autoAlpha: 0, y: 64 },
        {
          autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.16,
          scrollTrigger: { trigger: '.apc-manifesto', start: 'top 88%', once: true, invalidateOnRefresh: true },
        }
      )

      // Credits
      gsap.fromTo('.apc-credit-row',
        { autoAlpha: 0, x: -36 },
        {
          autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07,
          scrollTrigger: { trigger: '.apc-credits', start: 'top 88%', once: true, invalidateOnRefresh: true },
        }
      )

      // Awards
      gsap.fromTo('.apc-award-row',
        { autoAlpha: 0, x: -36 },
        {
          autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: '.apc-awards', start: 'top 88%', once: true, invalidateOnRefresh: true },
        }
      )

      // Portrait entrance
      gsap.fromTo('.apc-portrait',
        { autoAlpha: 0, scale: 1.04 },
        {
          autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: '.apc-bio-section', start: 'top 88%', once: true, invalidateOnRefresh: true },
        }
      )

      if (!isMobile) {
        // Parallax on hero background image
        gsap.to('.apc-hero-img', {
          yPercent: 22,
          ease: 'none',
          scrollTrigger: {
            trigger: '.apc-hero-img',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.8,
            invalidateOnRefresh: true,
          },
        })
        gsap.to('.apc-manifesto', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: '.apc-manifesto', start: 'top bottom', end: 'bottom top', scrub: 1.6, invalidateOnRefresh: true },
        })
        gsap.to('.apc-bio-head', {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: { trigger: '.apc-bio-section', start: 'top bottom', end: 'bottom top', scrub: 1.6, invalidateOnRefresh: true },
        })
        gsap.to('.apc-portrait-inner', {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: '.apc-portrait', start: 'top bottom', end: 'bottom top', scrub: 1.8, invalidateOnRefresh: true },
        })
      }
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef}>
      {/* ── Hero ── */}
      <section className="relative min-h-[75vh] md:min-h-[85vh] pt-[72px] overflow-hidden transform-gpu">
        <div className="apc-hero-img absolute inset-0">
          <Image
            src="https://picsum.photos/seed/diaz-about-hero/1600/900"
            alt="Andres Díaz on set"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/10" />
        </div>

        <div className="relative z-10 flex flex-col justify-end h-full min-h-[75vh] md:min-h-[85vh] px-6 md:px-10 pb-16 md:pb-24 max-w-[1400px] mx-auto">
          <p
            className="apc-hero-label font-mono text-[16px] tracking-[0.22em] uppercase mb-6"
            style={{
              marginLeft: '-2px',
              color: '#c4c0ba',
              textShadow: '0 1px 16px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.7)',
            }}
          >
            {t.aboutPage.role}
          </p>
          <h1
            className="apc-hero-name font-display font-black leading-[0.88] tracking-normal text-primary"
            style={{ fontSize: 'clamp(60px, 8vw, 130px)' }}
          >
            ANDRES<br />
            <span className="text-accent" style={{ marginLeft: '-2px', display: 'inline-block' }}>DIAZ</span>
          </h1>
        </div>
      </section>

      {/* ── Bio ── */}
      <section className="apc-bio-section py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 md:gap-24 items-start">
          <div>
            <p className="font-mono text-[14px] tracking-[0.2em] uppercase text-muted mb-6">{t.aboutPage.label}</p>
            <h2
              className="apc-bio-head font-display font-black leading-[0.92] tracking-normal text-primary"
              style={{ fontSize: 'clamp(34px, 4vw, 60px)' }}
            >
              {t.aboutPage.bioHead}
            </h2>
          </div>

          <div className="space-y-6">
            <p className="apc-bio-para font-display font-light text-[19px] md:text-[21px] leading-relaxed text-primary/75 max-w-[60ch]">
              {t.aboutPage.bio1}
            </p>
            <p className="apc-bio-para font-display font-light text-[19px] md:text-[21px] leading-relaxed text-primary/75 max-w-[60ch]">
              {t.aboutPage.bio2}
            </p>
            <p className="apc-bio-para font-display font-light text-[19px] md:text-[21px] leading-relaxed text-primary/75 max-w-[60ch]">
              {t.aboutPage.bio3}
            </p>

            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-mono text-[14px] tracking-[0.18em] uppercase text-primary border-b border-accent pb-1 hover:text-accent transition-colors duration-300 group"
              >
                <span>{t.aboutPage.startProject}</span>
                <ArrowRight
                  size={12}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Portrait full-width */}
        <div className="apc-portrait max-w-[1400px] mx-auto mt-16 md:mt-20 relative overflow-hidden transform-gpu" style={{ aspectRatio: '21/9' }}>
          <div className="apc-portrait-inner absolute" style={{ inset: '-10%' }}>
            <Image
              src="https://picsum.photos/seed/diaz-portrait-wide/1400/600"
              alt="Andres Díaz at work"
              fill
              className="object-cover"
              loading="lazy"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      {/* ── Manifesto ── */}
      <section className="apc-manifesto bg-surface/75 py-28 md:py-40 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <p
            className="font-display font-black leading-[0.88] tracking-normal text-primary"
            style={{ fontSize: 'clamp(36px, 6vw, 100px)' }}
          >
            <span className="apc-manifesto-line block">{t.aboutPage.manifestoLine1}</span>
            <span className="apc-manifesto-line block">{t.aboutPage.manifestoLine2}</span>
            <span className="apc-manifesto-line block text-accent">{t.aboutPage.manifestoLine3}</span>
            <span className="apc-manifesto-line block">{t.aboutPage.manifestoLine4}</span>
          </p>
        </div>
      </section>

      {/* ── Credits ── */}
      <section className="apc-credits py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-mono text-[14px] tracking-[0.2em] uppercase text-muted mb-14">
            {t.aboutPage.creditsLabel}
          </p>
          <ul className="list-none divide-y divide-white/5">
            {credits.map((c) => (
              <li
                key={c.project}
                className="apc-credit-row grid grid-cols-[auto_1fr_auto] md:grid-cols-[180px_1fr_160px_auto] items-baseline gap-x-6 md:gap-x-10 gap-y-1 py-6"
              >
                <span className="font-mono text-[14px] tracking-[0.15em] uppercase text-muted">
                  {roleMap[c.role] ?? c.role}
                </span>
                <span className="font-display font-semibold text-[21px] md:text-[27px] text-primary tracking-[-0.01em]">
                  {c.project}
                </span>
                <span className="hidden md:block font-mono text-[14px] tracking-[0.1em] text-muted">
                  {noteMap[c.note] ?? c.note}
                </span>
                <span className="font-mono text-[14px] text-muted text-right">
                  {c.year}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Awards & Nominations ── */}
      <section className="apc-awards bg-surface/75 py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-mono text-[14px] tracking-[0.2em] uppercase text-muted mb-14">
            {t.aboutPage.awardsLabel}
          </p>
          <ul className="list-none divide-y divide-white/5">
            {awards.map((a, i) => (
              <li
                key={i}
                className="apc-award-row grid grid-cols-[auto_1fr] md:grid-cols-[80px_1fr_auto_80px] items-baseline gap-x-6 md:gap-x-10 gap-y-1 py-6"
              >
                <span className="font-mono text-[14px] tracking-[0.1em] text-muted">
                  {a.year}
                </span>
                <div className="min-w-0">
                  <span className="block font-display font-semibold text-[19px] md:text-[23px] text-primary tracking-[-0.01em] leading-snug">
                    {a.title}
                  </span>
                  <span className="block font-mono text-[13px] tracking-[0.12em] uppercase text-muted mt-1">
                    {a.event}
                    <span className="text-muted/40 mx-2">·</span>
                    {a.project}
                  </span>
                </div>
                <span
                  className={[
                    'hidden md:block font-mono text-[12px] tracking-[0.2em] uppercase px-3 py-1 border self-center',
                    a.status === 'Winner'
                      ? 'text-accent border-accent/40'
                      : 'text-muted border-white/10',
                  ].join(' ')}
                >
                  {a.status === 'Winner' ? t.aboutPage.awardWinner : t.aboutPage.awardNominee}
                </span>
                <span
                  className={[
                    'font-mono text-[12px] tracking-[0.15em] uppercase text-right self-center md:hidden',
                    a.status === 'Winner' ? 'text-accent' : 'text-muted',
                  ].join(' ')}
                >
                  {a.status === 'Winner' ? t.aboutPage.awardWinner : t.aboutPage.awardNominee}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
