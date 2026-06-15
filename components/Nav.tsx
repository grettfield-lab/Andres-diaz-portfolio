'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X, Menu, ChevronDown } from 'lucide-react'

const workLinks = [
  { label: 'Photography', href: '/work/photography' },
  { label: 'Cinematography', href: '/work/cinematography' },
  { label: 'Other Projects', href: '/work/other-projects' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [workDropdown, setWorkDropdown] = useState(false)
  const [mobileWorkOpen, setMobileWorkOpen] = useState(false)
  const [navOnLight, setNavOnLight] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const mobileOverlayRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const progressContainerRef = useRef<HTMLDivElement>(null)
  const workBtnRef = useRef<HTMLButtonElement>(null)
  const aboutLinkRef = useRef<HTMLAnchorElement>(null)
  const contactLinkRef = useRef<HTMLAnchorElement>(null)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    setMobileOpen(false)
    setMobileWorkOpen(false)
  }, [pathname])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const st = ScrollTrigger.create({
      start: 80,
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    })
    return () => st.kill()
  }, [])

  // Detect if nav is over a light-background section (sections tagged data-nav-light)
  useEffect(() => {
    const check = () => {
      const lightSections = document.querySelectorAll('[data-nav-light]')
      let isLight = false
      for (const section of lightSections) {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 72 && rect.bottom >= 0) {
          isLight = true
          break
        }
      }
      setNavOnLight(isLight)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [pathname])

  useEffect(() => {
    const overlay = mobileOverlayRef.current
    if (!overlay) return
    gsap.killTweensOf(overlay)
    gsap.killTweensOf('.mobile-nav-item')
    if (mobileOpen) {
      gsap.set(overlay, { opacity: 0, pointerEvents: 'auto' })
      gsap.to(overlay, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(
        '.mobile-nav-item',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07, delay: 0.1 },
      )
    } else {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => gsap.set(overlay, { pointerEvents: 'none' }),
      })
    }
  }, [mobileOpen])

  // Scroll progress bar — full width on home, link-width on sub-pages
  useEffect(() => {
    const isHome = pathname === '/'
    const nav = navRef.current
    const bar = progressBarRef.current
    const container = progressContainerRef.current
    if (!bar || !container || !nav) return

    const getActiveEl = (): HTMLElement | null => {
      if (isHome) return null
      if (pathname.startsWith('/work')) return workBtnRef.current
      if (pathname.startsWith('/about')) return aboutLinkRef.current
      if (pathname.startsWith('/contact')) return contactLinkRef.current
      return null
    }

    const positionLine = () => {
      const activeEl = getActiveEl()
      if (!activeEl || activeEl.offsetParent === null) {
        // mobile or no match → full width
        container.style.left = '0px'
        container.style.right = '0px'
        container.style.removeProperty('width')
      } else {
        const elRect = activeEl.getBoundingClientRect()
        const navRect = nav.getBoundingClientRect()
        container.style.left = `${elRect.left - navRect.left}px`
        container.style.width = `${elRect.width}px`
        container.style.removeProperty('right')
      }
    }

    let rafId: number | null = null
    const updateProgress = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight
        const p = total > 0 ? Math.min(window.scrollY / total, 1) : 0
        bar.style.transform = `scaleX(${p})`
        rafId = null
      })
    }

    if (isHome) {
      container.style.left = '0px'
      container.style.right = '0px'
      container.style.removeProperty('width')
    }

    requestAnimationFrame(positionLine)
    updateProgress()

    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', positionLine)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', positionLine)
    }
  }, [pathname])

  const closeAll = () => {
    setMobileOpen(false)
    setMobileWorkOpen(false)
  }

  const linkColor = navOnLight
    ? 'text-[#0A0A0A]/60 hover:text-[#0A0A0A]'
    : 'text-muted hover:text-primary'
  const logoColor = navOnLight
    ? 'text-[#0A0A0A]'
    : scrolled
      ? 'text-primary'
      : 'text-primary/70'

  return (
    <>
      <nav
        ref={navRef}
        className={[
          'fixed top-0 left-0 right-0 z-[9000] flex items-center px-6 md:px-10 transition-all duration-500',
          'h-[72px]',
          scrolled ? 'bg-bg/85 backdrop-blur-md border-b border-white/5' : 'bg-transparent',
        ].join(' ')}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo — flex-1 left anchor */}
        <div className="flex-1">
          <Link
            href="/"
            className={`font-mono text-[17px] tracking-[0.2em] font-bold uppercase hover:text-accent transition-colors duration-300 ${logoColor}`}
            aria-label="Home — Andres Díaz"
          >
            AD
          </Link>
        </div>

        {/* Desktop links — visually centered */}
        <ul className="hidden md:flex items-center gap-8 list-none" role="list">
          <li
            className="relative"
            onMouseEnter={() => setWorkDropdown(true)}
            onMouseLeave={() => setWorkDropdown(false)}
          >
            <button
              ref={workBtnRef}
              className={`flex items-center gap-1.5 font-mono text-[15px] tracking-[0.15em] uppercase transition-colors duration-300 ${linkColor}`}
              aria-expanded={workDropdown}
              aria-haspopup="menu"
            >
              Work
              <ChevronDown
                size={10}
                strokeWidth={2}
                className={`transition-transform duration-200 ${workDropdown ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={[
                'absolute top-full left-0 pt-[2px] min-w-[200px] transition-all duration-200 z-10',
                workDropdown
                  ? 'opacity-100 pointer-events-auto translate-y-0'
                  : 'opacity-0 pointer-events-none -translate-y-2',
              ].join(' ')}
              role="menu"
            >
              <div className="bg-surface border border-white/10 py-1">
                {workLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    role="menuitem"
                    onClick={() => setWorkDropdown(false)}
                    className="flex items-center font-mono text-[14px] tracking-[0.15em] uppercase text-muted hover:text-primary hover:bg-white/5 px-5 py-3 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </li>

          <li>
            <Link
              ref={aboutLinkRef}
              href="/about"
              className={`font-mono text-[15px] tracking-[0.15em] uppercase transition-colors duration-300 ${linkColor}`}
            >
              About
            </Link>
          </li>

          <li>
            <Link
              ref={contactLinkRef}
              href="/contact"
              className={`font-mono text-[15px] tracking-[0.15em] uppercase transition-colors duration-300 ${linkColor}`}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Right side — CTA + hamburger, flex-1 pushes to edge */}
        <div className="flex-1 flex items-center gap-4 justify-end">
          <Link
            href={isHome ? '#contact' : '/contact'}
            className={[
              `hidden lg:inline-flex items-center gap-2 font-mono text-[15px] tracking-[0.15em] uppercase px-4 py-2 hover:border-accent hover:text-accent transition-all duration-500`,
              navOnLight
                ? 'text-[#0A0A0A] border border-[#0A0A0A]/20'
                : 'text-primary/70 border border-primary/20',
              scrolled ? 'opacity-0 pointer-events-none translate-y-[-4px]' : 'opacity-100 pointer-events-auto translate-y-0',
            ].join(' ')}
          >
            Start a project
          </Link>
          <button
            className={`p-1 transition-colors duration-300 ${navOnLight ? 'text-[#0A0A0A]' : 'text-primary'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={22} strokeWidth={1.5} />
            ) : (
              <Menu size={22} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Scroll progress line — 1px at bottom of nav bar */}
        <div
          ref={progressContainerRef}
          className="absolute bottom-0 overflow-hidden pointer-events-none"
          style={{ height: '1px', left: 0, right: 0 }}
        >
          <div
            ref={progressBarRef}
            className="h-full w-full bg-white/70 origin-left"
            style={{ transform: 'scaleX(0)', willChange: 'transform' }}
          />
        </div>
      </nav>

      {/* Fullscreen overlay */}
      <div
        ref={mobileOverlayRef}
        className="fixed inset-0 z-[8999] bg-bg flex flex-col justify-center px-8"
        style={{ opacity: 0, pointerEvents: 'none' }}
        aria-hidden={!mobileOpen}
      >
        <ul className="list-none space-y-6" role="list">
          <li className="mobile-nav-item">
            <button
              onClick={() => setMobileWorkOpen(!mobileWorkOpen)}
              className="flex items-center gap-3 font-display font-black text-[clamp(40px,10vw,64px)] text-primary hover:text-accent transition-colors duration-300"
            >
              Work
              <ChevronDown
                size={28}
                strokeWidth={1.5}
                className={`mt-1 transition-transform duration-300 ${mobileWorkOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-400 ease-out"
              style={{ gridTemplateRows: mobileWorkOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden min-h-0">
                <ul className="pl-5 pt-4 space-y-4 list-none border-l border-white/10">
                  {workLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeAll}
                        className="font-mono text-[17px] tracking-[0.15em] uppercase text-muted hover:text-primary transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>

          <li className="mobile-nav-item">
            <Link
              href="/about"
              onClick={closeAll}
              className="block font-display font-black text-[clamp(40px,10vw,64px)] text-primary hover:text-accent transition-colors duration-300"
            >
              About
            </Link>
          </li>

          <li className="mobile-nav-item">
            <Link
              href="/contact"
              onClick={closeAll}
              className="block font-display font-black text-[clamp(40px,10vw,64px)] text-primary hover:text-accent transition-colors duration-300"
            >
              Contact
            </Link>
          </li>
        </ul>

        <Link
          href="/contact"
          onClick={closeAll}
          className="mobile-nav-item mt-12 w-fit font-mono text-[15px] tracking-[0.2em] uppercase border border-primary/20 text-primary px-6 py-3 hover:border-accent hover:text-accent transition-colors duration-300"
        >
          Start a project
        </Link>
      </div>
    </>
  )
}
