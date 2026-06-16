'use client'

import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLocale } from '@/contexts/LocaleContext'

export default function Reel() {
  const { t } = useLocale()
  const [playing, setPlaying] = useState(false)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const sectionRef  = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Entrance — slow-fast-slow
      gsap.fromTo('.reel-label',
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.reel-label', start: 'top 90%', once: true, invalidateOnRefresh: true },
        }
      )
      // No scale on reel-video-container — it has transform-gpu (translateZ) which
      // conflicts with GSAP scale in Chrome, causing compositor layer corruption.
      gsap.fromTo('.reel-video-container',
        { autoAlpha: 0 },
        {
          autoAlpha: 1, duration: 1.0, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.reel-video-container', start: 'top 88%', once: true, invalidateOnRefresh: true },
        }
      )

      // Parallax — inner poster image (within overflow:hidden container)
      gsap.to('.reel-img-inner', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.reel-video-container',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.8,
          invalidateOnRefresh: true,
        },
      })

      // Parallax — label row (subtle)
      gsap.to('.reel-label', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.reel-label',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.6,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handlePlay = () => {
    setPlaying(true)
    videoRef.current?.play()
  }

  return (
    <section ref={sectionRef} className="pt-24 md:pt-32 pb-7 px-6 md:px-10" aria-label="Director's Reel">
      <div className="max-w-[1400px] mx-auto">

        {/* Label row */}
        <div className="reel-label flex items-baseline justify-between mb-8 md:mb-10">
          <p className="font-mono font-bold text-[23px] tracking-[0.08em] uppercase text-[#f5f4f0]">
            {t.reel.label}
          </p>
          <p className="font-mono font-bold text-[23px] tracking-[0.08em] text-[#f5f4f0]">2026</p>
        </div>

        {/* Video container */}
        <div
          className="reel-video-container relative w-full overflow-hidden group cursor-pointer transform-gpu"
          style={{ aspectRatio: '16/9' }}
          onClick={handlePlay}
          role="button"
          tabIndex={0}
          aria-label="Play reel"
          onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
        >
          {/* Oversized inner for parallax */}
          {!playing && (
            <div
              className="reel-img-inner absolute"
              style={{ inset: '-10%', willChange: 'transform' }}
            >
              <Image
                src="https://picsum.photos/seed/diaz-reel-poster/1400/787"
                alt="Reel poster"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1400px"
                priority
              />
            </div>
          )}

          {/* Dark vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-transparent to-bg/40 pointer-events-none z-[1]" />

          {/* Play button */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center z-[2]">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full border border-white/20 animate-ping opacity-30" />
                <div className="w-20 h-20 rounded-full border border-white/40 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-400 group-hover:scale-110 group-hover:border-white/70 group-hover:bg-black/50">
                  <Play size={28} strokeWidth={1.5} className="text-white ml-1" aria-hidden="true" />
                </div>
              </div>
            </div>
          )}

          {/* Video element */}
          {playing && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              controls
              autoPlay
              playsInline
            >
              <source src="" type="video/mp4" />
            </video>
          )}

          {/* Bottom label */}
          {!playing && (
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none z-[2]">
              <span
                className="font-display font-black text-white leading-none"
                style={{ fontSize: 'clamp(28px, 5vw, 72px)' }}
              >
                REEL
              </span>
              <span className="font-mono text-[13px] tracking-[0.15em] uppercase text-white/50">
                {t.reel.play}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
