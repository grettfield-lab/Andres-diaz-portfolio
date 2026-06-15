'use client'

import { useEffect, useRef } from 'react'

export default function ScrollFade() {
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    let rafId = 0

    const update = () => {
      // Top gradient: invisible at scroll=0, full black at ~280px scroll
      const t = Math.min(window.scrollY / 280, 1).toFixed(3)
      el.style.background =
        `linear-gradient(to bottom, rgba(10,10,10,${t}) 0%, transparent 24%, transparent 76%, rgba(10,10,10,0.97) 100%)`
    }

    update()

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 8, pointerEvents: 'none' }}
    />
  )
}
