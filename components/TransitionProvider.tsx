'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const navigating = useRef(false)

  // Register all GSAP plugins once — before any component useEffect runs
  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)
    gsap.config({ force3D: true })
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    if (document.readyState === 'complete') {
      refresh()
    } else {
      window.addEventListener('load', refresh, { once: true })
      return () => window.removeEventListener('load', refresh)
    }
  }, [])

  // Page arrival — fade overlay out then recalculate all scroll triggers
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    navigating.current = false
    gsap.killTweensOf(overlay)
    gsap.set(overlay, { opacity: 1, pointerEvents: 'none' })
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.05,
      onComplete: () => {
        ScrollTrigger.refresh()
      },
    })
  }, [pathname])

  // Intercept internal link clicks — smooth scroll for anchors, fade for page nav
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute('href') ?? ''

      // Hash anchor — GSAP smooth scroll with fixed-nav offset
      if (href.startsWith('#')) {
        const target = document.getElementById(href.slice(1))
        if (target) {
          e.preventDefault()
          gsap.to(window, {
            duration: 1.0,
            scrollTo: { y: target, offsetY: 80 },
            ease: 'power3.inOut',
          })
        }
        return
      }

      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
      ) return

      if (navigating.current) { e.preventDefault(); return }
      navigating.current = true
      e.preventDefault()

      const overlay = overlayRef.current
      if (!overlay) { router.push(href); return }

      gsap.killTweensOf(overlay)
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.28,
        ease: 'power2.out',
        onStart: () => { overlay.style.pointerEvents = 'auto' },
        onComplete: () => router.push(href),
      })
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [router])

  return (
    <>
      <div
        ref={overlayRef}
        style={{ opacity: 1, pointerEvents: 'none' }}
        className="fixed inset-0 bg-bg z-[9997]"
        aria-hidden="true"
      />
      {children}
    </>
  )
}
