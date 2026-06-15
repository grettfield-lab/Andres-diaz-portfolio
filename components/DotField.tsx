'use client'

import { useEffect, useRef } from 'react'

const SPACING = 16
const DOT_R   = 0.65

// Direct cursor repulsion
const REPEL_R = 110
const REPEL_K = 6500

// Spring physics
const SPRING  = 0.052
const DAMP    = 0.78

// Ripple / wave system
const WAVE_SPEED = 3.8   // px per frame ring expands
const WAVE_FORCE = 1.6   // velocity impulse at wave peak
const WAVE_WIDTH = 60    // ring band thickness (px)
const WAVE_LIFE  = 85    // frames before ripple dies
const WAVE_SAMPLE = 7    // spawn ripple every N frames if mouse moved
const WAVE_MAX   = 22    // max concurrent ripples

// Base color: warm dim white  /  Hot color: full white
const BR = 240, BG = 237, BB = 232, BA = 0.11
const HR = 255, HG = 255, HB = 255, HA = 0.88

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    interface Dot  { rx: number; ry: number; x: number; y: number; vx: number; vy: number }
    interface Wave { ox: number; oy: number; age: number }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0
    let dots: Dot[] = []
    let waves: Wave[] = []
    let mx = -9999, my = -9999
    let raf = 0
    let frame = 0
    let lastWX = -9999, lastWY = -9999

    const build = () => {
      W = window.innerWidth
      H = window.innerHeight
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
      for (const d of dots) {
        ctx.beginPath()
        ctx.arc(d.rx, d.ry, DOT_R, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const spawnWave = (x: number, y: number) => {
      if (waves.length >= WAVE_MAX) waves.shift()
      waves.push({ ox: x, oy: y, age: 0 })
    }

    const tick = () => {
      frame++
      ctx.clearRect(0, 0, W, H)

      // Sample mouse trail to spawn ripples
      if (mx > -500 && frame % WAVE_SAMPLE === 0) {
        const moved = (mx - lastWX) ** 2 + (my - lastWY) ** 2
        if (moved > 9) {
          spawnWave(mx, my)
          lastWX = mx; lastWY = my
        }
      }

      // Advance & prune waves
      let wi = waves.length
      while (wi--) {
        waves[wi].age++
        if (waves[wi].age >= WAVE_LIFE) waves.splice(wi, 1)
      }

      for (const d of dots) {
        // --- cursor repulsion ---
        const cdx = d.x - mx
        const cdy = d.y - my
        const cr2 = cdx * cdx + cdy * cdy

        if (cr2 < REPEL_R * REPEL_R && cr2 > 0.01) {
          const cr = Math.sqrt(cr2)
          const f  = REPEL_K / cr2
          d.vx += (cdx / cr) * f
          d.vy += (cdy / cr) * f
        }

        // --- ripple wave forces (use rest pos for clean ring shape) ---
        for (const w of waves) {
          const wdx = d.rx - w.ox
          const wdy = d.ry - w.oy
          const wr2 = wdx * wdx + wdy * wdy
          if (wr2 < 0.01) continue
          const wr    = Math.sqrt(wr2)
          const front = w.age * WAVE_SPEED
          const gap   = Math.abs(wr - front)
          if (gap < WAVE_WIDTH) {
            const shape   = (1 - gap / WAVE_WIDTH) ** 2
            const decay   = 1 - w.age / WAVE_LIFE
            const impulse = WAVE_FORCE * shape * decay
            d.vx += (wdx / wr) * impulse
            d.vy += (wdy / wr) * impulse
          }
        }

        // --- spring return ---
        d.vx += (d.rx - d.x) * SPRING
        d.vy += (d.ry - d.y) * SPRING
        d.vx *= DAMP
        d.vy *= DAMP
        d.x  += d.vx
        d.y  += d.vy

        // --- color: cursor proximity + displacement glow ---
        const ndx = d.x - mx
        const ndy = d.y - my
        const nr2 = ndx * ndx + ndy * ndy
        const cursorT = nr2 < REPEL_R * REPEL_R
          ? Math.max(0, 1 - Math.sqrt(nr2) / REPEL_R)
          : 0

        // dots glow when displaced by waves
        const disp  = Math.sqrt((d.x - d.rx) ** 2 + (d.y - d.ry) ** 2)
        const waveT = Math.min(disp / 14, 1) * 0.55

        const inf    = Math.max(cursorT, waveT)
        const cr     = Math.round(BR + (HR - BR) * inf)
        const cg     = Math.round(BG + (HG - BG) * inf)
        const cb     = Math.round(BB + (HB - BB) * inf)
        const ca     = BA + (HA - BA) * inf
        const radius = DOT_R + inf * 1.1

        ctx.fillStyle = `rgba(${cr},${cg},${cb},${ca})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    const onPointerMove  = (e: PointerEvent) => { mx = e.clientX; my = e.clientY }
    const onPointerLeave = () => { mx = -9999; my = -9999 }

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(raf)
        build()
        if (prefersReduced) drawStatic()
        else raf = requestAnimationFrame(tick)
      }, 200)
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    build()

    if (prefersReduced) {
      drawStatic()
    } else {
      raf = requestAnimationFrame(tick)
      document.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('pointerleave', onPointerLeave)
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
