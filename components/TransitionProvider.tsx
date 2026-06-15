'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const navigating = useRef(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)
    gsap.config({ force3D: true })
    gsap.ticker.lagSmoothing(0)

    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh())
    document.fonts.ready.then(refresh)
    if (document.readyState === 'complete') refresh()
    else window.addEventListener('load', refresh, { once: true })
    const t1 = setTimeout(refresh, 200)
    const t2 = setTimeout(refresh, 600)
    const t3 = setTimeout(refresh, 1200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Route change → slide overlay out to the left, revealing the new page
  useEffect(() => {
    navigating.current = false
    const overlay = overlayRef.current
    if (!overlay) return

    const id = setTimeout(() => {
      gsap.to(overlay, {
        xPercent: -100,
        duration: 0.52,
        ease: 'power3.out',
        onComplete: () => {
          // Reset to right so it's ready for the next cover
          gsap.set(overlay, { xPercent: 100 })
          requestAnimationFrame(() => ScrollTrigger.refresh())
        },
      })
    }, 40)
    return () => clearTimeout(id)
  }, [pathname])

  // Intercept link clicks for the slide-in cover
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href') ?? ''

      // Hash anchors → smooth scroll
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

      // Cover: slide in from the right — starts moderate, finishes fast
      gsap.set(overlay, { xPercent: 100 })
      gsap.to(overlay, {
        xPercent: 0,
        duration: 0.42,
        ease: 'power3.in',
        onComplete: () => router.push(href),
      })
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [router])

  return (
    <>
      {/* Slide overlay — starts covering (xPercent: 0) and reveals on mount */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 bg-bg pointer-events-none"
        style={{ zIndex: 9997, transform: 'translateX(0%)' }}
      />
      {children}
    </>
  )
}
