'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const navigating = useRef(false)
  const [covered, setCovered] = useState(true)

  // Central plugin registration + aggressive ScrollTrigger refresh for Vercel
  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)
    gsap.config({ force3D: true })
    gsap.ticker.lagSmoothing(0)

    const refresh = () => requestAnimationFrame(() => ScrollTrigger.refresh())

    document.fonts.ready.then(refresh)
    if (document.readyState === 'complete') {
      refresh()
    } else {
      window.addEventListener('load', refresh, { once: true })
    }
    // Belt-and-suspenders fallback refreshes
    const t1 = setTimeout(refresh, 200)
    const t2 = setTimeout(refresh, 600)
    const t3 = setTimeout(refresh, 1200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // On every route change: show overlay briefly, then reveal and refresh triggers
  useEffect(() => {
    navigating.current = false
    setCovered(true)
    const reveal = setTimeout(() => {
      setCovered(false)
      // Refresh after CSS transition completes (480ms) + one RAF
      setTimeout(() => requestAnimationFrame(() => ScrollTrigger.refresh()), 500)
    }, 40)
    return () => clearTimeout(reveal)
  }, [pathname])

  // Intercept link clicks for smooth transitions
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute('href') ?? ''

      // Hash anchors → GSAP smooth scroll
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

      setCovered(true)
      setTimeout(() => router.push(href), 340)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [router])

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-bg pointer-events-none"
        style={{
          zIndex: 9997,
          opacity: covered ? 1 : 0,
          transition: 'opacity 0.48s ease',
        }}
      />
      {children}
    </>
  )
}
