'use client'

import { useEffect, useRef } from 'react'

const SPACING  = 22
const DOT_R    = 0.7
const REPEL_R  = 80
const REPEL_K  = 2400
const SPRING   = 0.055
const DAMP     = 0.76
const ACTIVE_R2 = (REPEL_R * 2.5) ** 2

// Base: warm dim white  /  Active: subtle warm gray
const BR = 240, BG = 237, BB = 232, BA = 0.10
const HR = 168, HG = 166, HB = 165, HA = 0.50

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    interface Dot { rx: number; ry: number; x: number; y: number; vx: number; vy: number }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0
    let dots: Dot[] = []
    let mx = -9999, my = -9999
    let raf = 0

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      W = Math.round(rect.width)  || Math.round(window.innerWidth)
      H = Math.round(rect.height) || Math.round(window.innerHeight)
      canvas.width  = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      for (let ry = 0; ry <= H + SPACING; ry += SPACING)
        for (let rx = 0; rx <= W + SPACING; rx += SPACING)
          dots.push({ rx, ry, x: rx, y: ry, vx: 0, vy: 0 })
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = `rgba(${BR},${BG},${BB},${BA})`
      ctx.beginPath()
      for (const d of dots) {
        ctx.moveTo(d.rx + DOT_R, d.ry)
        ctx.arc(d.rx, d.ry, DOT_R, 0, Math.PI * 2)
      }
      ctx.fill()
    }

    const tick = () => {
      ctx.clearRect(0, 0, W, H)

      const hasCursor = mx > -500
      let needsNextFrame = hasCursor

      // Physics — only for dots near cursor or still decelerating
      for (const d of dots) {
        const cdx = d.rx - mx
        const cdy = d.ry - my
        const inZone = hasCursor && (cdx * cdx + cdy * cdy < ACTIVE_R2)
        const moving = Math.abs(d.vx) > 0.003 || Math.abs(d.vy) > 0.003

        if (inZone || moving) {
          needsNextFrame = true
          if (inZone) {
            const fdx = d.x - mx
            const fdy = d.y - my
            const cr2 = fdx * fdx + fdy * fdy
            if (cr2 < REPEL_R * REPEL_R && cr2 > 0.01) {
              const cr = Math.sqrt(cr2)
              d.vx += (fdx / cr) * (REPEL_K / cr2)
              d.vy += (fdy / cr) * (REPEL_K / cr2)
            }
          }
          d.vx += (d.rx - d.x) * SPRING
          d.vy += (d.ry - d.y) * SPRING
          d.vx *= DAMP
          d.vy *= DAMP
          d.x  += d.vx
          d.y  += d.vy
        } else {
          d.x = d.rx; d.y = d.ry; d.vx = 0; d.vy = 0
        }
      }

      // Batch draw: all dots in one path / one fill call
      ctx.fillStyle = `rgba(${BR},${BG},${BB},${BA})`
      ctx.beginPath()
      for (const d of dots) {
        ctx.moveTo(d.x + DOT_R, d.y)
        ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2)
      }
      ctx.fill()

      // Over-draw active zone dots with highlight
      if (hasCursor) {
        for (const d of dots) {
          const cdx = d.rx - mx
          const cdy = d.ry - my
          if (cdx * cdx + cdy * cdy >= ACTIVE_R2) continue

          const ndx = d.x - mx
          const ndy = d.y - my
          const nr2 = ndx * ndx + ndy * ndy
          const t = nr2 < REPEL_R * REPEL_R
            ? Math.max(0, 1 - Math.sqrt(nr2) / REPEL_R)
            : 0
          const disp = Math.sqrt((d.x - d.rx) ** 2 + (d.y - d.ry) ** 2)
          const inf = Math.max(t, Math.min(disp / 14, 1) * 0.55)
          if (inf < 0.02) continue

          ctx.fillStyle = `rgba(${Math.round(BR + (HR - BR) * inf)},${Math.round(BG + (HG - BG) * inf)},${Math.round(BB + (HB - BB) * inf)},${BA + (HA - BA) * inf})`
          ctx.beginPath()
          ctx.arc(d.x, d.y, DOT_R + inf * 1.1, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Stop the loop when canvas is idle; restart via event listeners
      if (needsNextFrame) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    const startLoop = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onPointerMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; startLoop() }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) { mx = e.touches[0].clientX; my = e.touches[0].clientY; startLoop() }
    }
    const onTouchEnd = () => { mx = -9999; my = -9999 }
    const onMouseLeave = () => { mx = -9999; my = -9999 }

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(raf)
        raf = 0
        build()
        if (prefersReduced) drawStatic()
        else drawStatic() // static draw on resize; loop restarts on next pointer event
      }, 200)
    }

    build()
    drawStatic() // initial render without rAF

    if (!prefersReduced) {
      document.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('touchmove',   onTouchMove,   { passive: true })
      document.addEventListener('touchend',    onTouchEnd,    { passive: true })
      document.addEventListener('touchcancel', onTouchEnd,    { passive: true })
      document.addEventListener('mouseleave',  onMouseLeave)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('touchmove',   onTouchMove)
      document.removeEventListener('touchend',    onTouchEnd)
      document.removeEventListener('touchcancel', onTouchEnd)
      document.removeEventListener('mouseleave',  onMouseLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
