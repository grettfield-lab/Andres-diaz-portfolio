'use client'

import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin)
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => gsap.to(window, { duration: 1.1, scrollTo: 0, ease: 'power3.inOut' })}
      aria-label="Back to top"
      className="fixed bottom-8 right-8 w-10 h-10 flex items-center justify-center border border-white/15 bg-bg/80 backdrop-blur-sm text-muted hover:text-accent hover:border-accent"
      style={{
        zIndex: 9500,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.35s ease, transform 0.35s ease, color 0.25s ease, border-color 0.25s ease',
      }}
    >
      <ArrowUp size={16} strokeWidth={1.5} />
    </button>
  )
}
