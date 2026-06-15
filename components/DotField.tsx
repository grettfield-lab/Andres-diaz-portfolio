'use client'

import { useEffect, useRef } from 'react'

const SPACING = 16
const DOT_R   = 0.65
const REPEL_R = 135
const REPEL_K = 8500
const SPRING  = 0.052
const DAMP    = 0.78

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
      ctx.fillStyle = 'rgba(240,237,232,0.11)'
      for (const d of dots) {
        ctx.beginPath()
        ctx.arc(d.rx, d.ry, DOT_R, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = 'rgba(240,237,232,0.11)'

      for (const d of dots) {
        const dx = d.x - mx
        const dy = d.y - my
        const r2 = dx * dx + dy * dy

        if (r2 < REPEL_R * REPEL_R && r2 > 0.01) {
          const r = Math.sqrt(r2)
          const f = REPEL_K / r2
          d.vx += (dx / r) * f
          d.vy += (dy / r) * f
        }

        d.vx += (d.rx - d.x) * SPRING
        d.vy += (d.ry - d.y) * SPRING
        d.vx *= DAMP
        d.vy *= DAMP
        d.x += d.vx
        d.y += d.vy

        ctx.beginPath()
        ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    const onPointerMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    const onPointerLeave = () => { mx = -9999; my = -9999 }

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(raf)
        build()
        if (prefersReduced) {
          drawStatic()
        } else {
          raf = requestAnimationFrame(tick)
        }
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
