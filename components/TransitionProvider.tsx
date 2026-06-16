'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const PAGE_LEVEL: Record<string, number> = {
  '/': 0,
  '/work': 1,
  '/work/photography': 1,
  '/work/cinematography': 1,
  '/work/other-projects': 1,
  '/about': 2,
  '/contact': 3,
}

function getLevel(p: string): number {
  if (PAGE_LEVEL[p] !== undefined) return PAGE_LEVEL[p]
  const base = '/' + p.split('/').filter(Boolean)[0]
  return PAGE_LEVEL[base] ?? 1
}

type Dir = 'right-left' | 'left-right' | 'top-bottom'

const DUR_IN  = 0.42
const DUR_OUT = 0.52
const LAG     = 0.055   // stagger between the three colour layers

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname()
  const router      = useRouter()
  const navigating  = useRef(false)
  // Three overlay layers stacked front-to-back
  const oDarkRef    = useRef<HTMLDivElement>(null)  // front  bg-bg     z-9999
  const oPrimRef    = useRef<HTMLDivElement>(null)  // middle bg-primary z-9998
  const oAccRef     = useRef<HTMLDivElement>(null)  // back   bg-accent  z-9997
  const dirRef      = useRef<Dir>('right-left')
  const pathnameRef = useRef(pathname)

  useEffect(() => { pathnameRef.current = pathname }, [pathname])

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)
    // 'auto' only promotes to 3D when beneficial — avoids Chrome GPU layer explosion
    gsap.config({ force3D: 'auto' })
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize,orientationchange',
      ignoreMobileResize: true,
    })

    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh())
    document.fonts.ready.then(refresh)
    if (document.readyState === 'complete') refresh()
    else window.addEventListener('load', refresh, { once: true })
    const t1 = setTimeout(refresh, 200)
    const t2 = setTimeout(refresh, 600)
    const t3 = setTimeout(refresh, 1200)
    const t4 = setTimeout(refresh, 2500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  // After route change → reveal:
  // dark (front) exits first, primary second, accent (back) last
  // → you briefly see the colour strips in sequence then the new page appears
  useEffect(() => {
    navigating.current = false
    const dark = oDarkRef.current
    const prim = oPrimRef.current
    const acc  = oAccRef.current
    if (!dark || !prim || !acc) return

    const dir = dirRef.current

    const id = setTimeout(() => {
      gsap.killTweensOf([dark, prim, acc])

      if (dir === 'right-left') {
        gsap.fromTo(dark, { xPercent: 0 }, { xPercent: -100, duration: DUR_OUT, ease: 'power3.out' })
        gsap.fromTo(prim, { xPercent: 0 }, { xPercent: -100, duration: DUR_OUT, ease: 'power3.out', delay: LAG })
        gsap.fromTo(acc,  { xPercent: 0 }, { xPercent: -100, duration: DUR_OUT, ease: 'power3.out', delay: LAG * 2,
          onComplete: () => {
            gsap.set([dark, prim, acc], { xPercent: 100, yPercent: 0 })
            requestAnimationFrame(() => ScrollTrigger.refresh())
          },
        })
      } else if (dir === 'left-right') {
        gsap.fromTo(dark, { xPercent: 0 }, { xPercent: 100, duration: DUR_OUT, ease: 'power3.out' })
        gsap.fromTo(prim, { xPercent: 0 }, { xPercent: 100, duration: DUR_OUT, ease: 'power3.out', delay: LAG })
        gsap.fromTo(acc,  { xPercent: 0 }, { xPercent: 100, duration: DUR_OUT, ease: 'power3.out', delay: LAG * 2,
          onComplete: () => {
            gsap.set([dark, prim, acc], { xPercent: -100, yPercent: 0 })
            requestAnimationFrame(() => ScrollTrigger.refresh())
          },
        })
      } else {
        // top-bottom: overlays exit downward
        gsap.fromTo(dark, { yPercent: 0 }, { yPercent: 100, duration: DUR_OUT, ease: 'power3.out' })
        gsap.fromTo(prim, { yPercent: 0 }, { yPercent: 100, duration: DUR_OUT, ease: 'power3.out', delay: LAG })
        gsap.fromTo(acc,  { yPercent: 0 }, { yPercent: 100, duration: DUR_OUT, ease: 'power3.out', delay: LAG * 2,
          onComplete: () => {
            gsap.set([dark, prim, acc], { yPercent: -100, xPercent: 0 })
            requestAnimationFrame(() => ScrollTrigger.refresh())
          },
        })
      }
    }, 40)

    return () => clearTimeout(id)
  }, [pathname])

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
          const rect = target.getBoundingClientRect()
          let scrollTo: number
          if (href === '#work') {
            // Scroll to START of the work section (with nav clearance)
            scrollTo = Math.max(0, window.scrollY + rect.top - 80)
          } else {
            // #contact → show the last full screen of the section (CTA button visible)
            scrollTo = Math.max(0, window.scrollY + rect.bottom - window.innerHeight)
          }
          gsap.to(window, { duration: 1.0, scrollTo, ease: 'power3.inOut' })
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

      const from = pathnameRef.current

      // AD clicked while already on home → smooth scroll to top
      if (href === '/' && from === '/') {
        e.preventDefault()
        gsap.to(window, { duration: 0.9, scrollTo: 0, ease: 'power3.inOut' })
        return
      }

      if (navigating.current) { e.preventDefault(); return }
      navigating.current = true
      e.preventDefault()

      const dark = oDarkRef.current
      const prim = oPrimRef.current
      const acc  = oAccRef.current
      if (!dark || !prim || !acc) { router.push(href); return }

      const isHomeUp  = (anchor as HTMLElement).dataset.homeUp === 'true'
      const fromLevel = getLevel(from)
      const toLevel   = getLevel(href)

      let dir: Dir
      if (href === '/' && isHomeUp) {
        dir = 'top-bottom'
      } else if (href === '/') {
        dir = 'left-right'
      } else if (toLevel > fromLevel) {
        dir = 'right-left'
      } else if (toLevel < fromLevel) {
        dir = 'left-right'
      } else {
        dir = 'right-left'
      }

      dirRef.current = dir
      gsap.killTweensOf([dark, prim, acc])

      // Cover: accent (back) enters first as the leading visible edge,
      // then primary, then dark (front) — router.push fires when dark completes.
      // Because dark has the highest z-index, as the layers stagger in you see
      // a brief orange → white → dark strip sequence sweeping across the screen.
      if (dir === 'right-left') {
        gsap.set([dark, prim, acc], { xPercent: 100, yPercent: 0 })
        gsap.to(acc,  { xPercent: 0, duration: DUR_IN, ease: 'power3.in' })
        gsap.to(prim, { xPercent: 0, duration: DUR_IN, ease: 'power3.in', delay: LAG })
        gsap.to(dark, { xPercent: 0, duration: DUR_IN, ease: 'power3.in', delay: LAG * 2, onComplete: () => router.push(href) })
      } else if (dir === 'left-right') {
        gsap.set([dark, prim, acc], { xPercent: -100, yPercent: 0 })
        gsap.to(acc,  { xPercent: 0, duration: DUR_IN, ease: 'power3.in' })
        gsap.to(prim, { xPercent: 0, duration: DUR_IN, ease: 'power3.in', delay: LAG })
        gsap.to(dark, { xPercent: 0, duration: DUR_IN, ease: 'power3.in', delay: LAG * 2, onComplete: () => router.push(href) })
      } else {
        // top-bottom: cover enters from above
        gsap.set([dark, prim, acc], { yPercent: -100, xPercent: 0 })
        gsap.to(acc,  { yPercent: 0, duration: DUR_IN, ease: 'power3.in' })
        gsap.to(prim, { yPercent: 0, duration: DUR_IN, ease: 'power3.in', delay: LAG })
        gsap.to(dark, { yPercent: 0, duration: DUR_IN, ease: 'power3.in', delay: LAG * 2, onComplete: () => router.push(href) })
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [router])

  return (
    <>
      {/* Back layer — accent/orange */}
      <div
        ref={oAccRef}
        aria-hidden="true"
        className="fixed inset-0 bg-accent pointer-events-none"
        style={{ zIndex: 9997, willChange: 'transform' }}
      />
      {/* Middle layer — primary/warm white */}
      <div
        ref={oPrimRef}
        aria-hidden="true"
        className="fixed inset-0 bg-primary pointer-events-none"
        style={{ zIndex: 9998, willChange: 'transform' }}
      />
      {/* Front layer — dark background */}
      <div
        ref={oDarkRef}
        aria-hidden="true"
        className="fixed inset-0 bg-bg pointer-events-none"
        style={{ zIndex: 9999, willChange: 'transform' }}
      />
      {children}
    </>
  )
}
