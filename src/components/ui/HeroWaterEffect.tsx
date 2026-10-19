import { useEffect, useRef } from 'react'

type Ripple = {
  x: number
  y: number
  age: number
  life: number
}

type FallingDrop = {
  x: number
  startY: number
  impactY: number
  age: number
  life: number
}

const MAX_RIPPLES = 2
const MAX_DPR = 2

const easeOut = (progress: number) => 1 - Math.pow(1 - progress, 3)
const easeIn = (progress: number) => progress * progress

export function HeroWaterEffect() {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: true })
    const visual = root?.parentElement

    if (!root || !canvas || !context || !visual) return
    const ctx = context

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const ripples: Ripple[] = []
    const drops: FallingDrop[] = []

    let width = 0
    let height = 0
    let frameId: number | null = null
    let previousFrame = 0
    let ambientTimer: number | null = null
    let inView = true

    const resize = () => {
      const rect = root.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, MAX_DPR))

      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const drawRipple = (ripple: Ripple) => {
      const progress = Math.min(1, ripple.age / ripple.life)
      const eased = easeOut(progress)
      const alpha = Math.pow(1 - progress, 1.8)

      for (let ring = 0; ring < 3; ring += 1) {
        const delayed = Math.max(0, eased - ring * 0.12)
        if (delayed <= 0) continue

        const radius = 10 + delayed * (68 + ring * 13)
        ctx.globalAlpha = alpha * (0.34 - ring * 0.07)
        ctx.strokeStyle = ring === 1 ? 'rgb(45, 212, 191)' : 'rgb(14, 165, 233)'
        ctx.lineWidth = Math.max(0.65, 1.35 - progress * 0.55)
        ctx.beginPath()
        ctx.ellipse(ripple.x, ripple.y, radius, radius * 0.34, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.globalAlpha = alpha * 0.18
      ctx.fillStyle = 'rgb(255, 255, 255)'
      ctx.beginPath()
      ctx.ellipse(ripple.x, ripple.y, 6 + eased * 16, 2 + eased * 4.5, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawDrop = (drop: FallingDrop) => {
      const progress = Math.min(1, drop.age / drop.life)
      const y = drop.startY + (drop.impactY - drop.startY) * easeIn(progress)
      const radius = 5.5 + progress * 1.5
      const gradient = ctx.createRadialGradient(
        drop.x - radius * 0.35,
        y - radius * 0.4,
        radius * 0.15,
        drop.x,
        y,
        radius * 1.35,
      )

      gradient.addColorStop(0, 'rgba(255,255,255,.95)')
      gradient.addColorStop(0.28, 'rgba(180,232,249,.78)')
      gradient.addColorStop(0.7, 'rgba(14,165,233,.34)')
      gradient.addColorStop(1, 'rgba(8,47,73,.04)')

      ctx.globalAlpha = 0.96
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.moveTo(drop.x, y - radius * 1.5)
      ctx.bezierCurveTo(
        drop.x + radius * 0.95,
        y - radius * 0.35,
        drop.x + radius * 0.85,
        y + radius * 0.95,
        drop.x,
        y + radius * 1.08,
      )
      ctx.bezierCurveTo(
        drop.x - radius * 0.85,
        y + radius * 0.95,
        drop.x - radius * 0.95,
        y - radius * 0.35,
        drop.x,
        y - radius * 1.5,
      )
      ctx.fill()
    }

    const startAnimation = () => {
      if (frameId === null && inView && !document.hidden && !motionQuery.matches && (ripples.length > 0 || drops.length > 0)) {
        frameId = requestAnimationFrame(tick)
      }
    }

    const addRipple = (x: number, y: number) => {
      if (motionQuery.matches || document.hidden) return
      ripples.push({ x, y, age: 0, life: 2100 })
      if (ripples.length > MAX_RIPPLES) ripples.shift()
      startAnimation()
    }

    const addAmbientDrop = () => {
      if (motionQuery.matches || document.hidden || !inView || width < 2 || height < 2) return
      if (drops.length > 0 || ripples.length >= MAX_RIPPLES) return

      const minX = width * 0.22
      const maxX = width * 0.84
      const x = minX + Math.random() * Math.max(1, maxX - minX)
      const impactY = height * (0.61 + Math.random() * 0.18)
      drops.push({
        x,
        startY: Math.max(28, impactY - Math.min(150, height * 0.24)),
        impactY,
        age: 0,
        life: 760 + Math.random() * 160,
      })
      startAnimation()
    }

    const scheduleAmbientDrop = () => {
      if (ambientTimer !== null) window.clearTimeout(ambientTimer)
      ambientTimer = window.setTimeout(() => {
        addAmbientDrop()
        scheduleAmbientDrop()
      }, 4400 + Math.random() * 2600)
    }

    function tick(timestamp: number) {
      const elapsed = previousFrame === 0 ? 16 : Math.min(34, timestamp - previousFrame)
      previousFrame = timestamp

      ctx.clearRect(0, 0, width, height)

      for (let index = drops.length - 1; index >= 0; index -= 1) {
        const drop = drops[index]
        drop.age += elapsed

        if (drop.age >= drop.life) {
          drops.splice(index, 1)
          addRipple(drop.x, drop.impactY)
        } else {
          drawDrop(drop)
        }
      }

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index]
        ripple.age += elapsed

        if (ripple.age >= ripple.life) {
          ripples.splice(index, 1)
        } else {
          drawRipple(ripple)
        }
      }

      ctx.globalAlpha = 1

      if (inView && !document.hidden && !motionQuery.matches && (ripples.length > 0 || drops.length > 0)) {
        frameId = requestAnimationFrame(tick)
      } else {
        frameId = null
        previousFrame = 0
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (motionQuery.matches) return
      const rect = root.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return
      addRipple(x, y)
    }

    const onVisibilityChange = () => {
      if (document.hidden && frameId !== null) {
        cancelAnimationFrame(frameId)
        frameId = null
        previousFrame = 0
      } else {
        startAnimation()
      }
    }

    const onMotionChange = () => {
      if (!motionQuery.matches) {
        scheduleAmbientDrop()
        return
      }

      ripples.length = 0
      drops.length = 0
      ctx.clearRect(0, 0, width, height)
      if (frameId !== null) cancelAnimationFrame(frameId)
      frameId = null
      previousFrame = 0
      if (ambientTimer !== null) window.clearTimeout(ambientTimer)
      ambientTimer = null
    }

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    const intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true
      if (!inView && frameId !== null) {
        cancelAnimationFrame(frameId)
        frameId = null
        previousFrame = 0
      } else {
        startAnimation()
      }
    }, { threshold: 0.08 })

    resizeObserver?.observe(root)
    if (!resizeObserver) window.addEventListener('resize', resize)
    intersectionObserver?.observe(root)
    visual.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionQuery.addEventListener('change', onMotionChange)

    resize()
    scheduleAmbientDrop()

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      if (ambientTimer !== null) window.clearTimeout(ambientTimer)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      if (!resizeObserver) window.removeEventListener('resize', resize)
      visual.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  return (
    <div ref={rootRef} className="hero-water-effect" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-water-effect__canvas" tabIndex={-1} />
      <span className="hero-water-effect__feature-drop">
        <span className="hero-water-effect__feature-highlight" />
      </span>
      <span className="hero-water-effect__surface" />
    </div>
  )
}
