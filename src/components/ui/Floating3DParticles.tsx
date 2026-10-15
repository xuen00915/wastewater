import { useEffect, useRef, type CanvasHTMLAttributes } from 'react'

export interface Floating3DParticlesProps extends Omit<CanvasHTMLAttributes<HTMLCanvasElement>, 'width' | 'height'> {
  quantity?: number
  color?: string
  size?: number
  opacity?: number
  drift?: number
  depth?: number
}

type Particle = {
  x: number
  y: number
  depth: number
  size: number
  opacity: number
  riseSpeed: number
  swayAmplitude: number
  swayPhase: number
  swaySpeed: number
  screenX: number
  screenY: number
  projectedScale: number
}

const MOBILE_BREAKPOINT = 768
const MOBILE_PARTICLE_RATIO = 0.32
const MAX_DPR = 2

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace('#', '').trim()
  const full = clean.length === 3 ? clean.split('').map((character) => character + character).join('') : clean
  if (!/^[0-9a-f]{6}$/i.test(full)) return `rgba(45,212,191,${alpha})`
  const numeric = Number.parseInt(full, 16)
  return `rgba(${(numeric >> 16) & 0xff},${(numeric >> 8) & 0xff},${numeric & 0xff},${alpha})`
}

function spawnParticle(width: number, height: number, size: number, opacity: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    depth: 0.35 + Math.random() * 0.65,
    size: Math.max(1, size * (0.65 + Math.random() * 0.7)),
    opacity: Math.min(0.82, Math.max(0.18, opacity - 0.12 + Math.random() * 0.28)),
    riseSpeed: 0.65 + Math.random() * 1.15,
    swayAmplitude: 5 + Math.random() * 8,
    swayPhase: Math.random() * Math.PI * 2,
    swaySpeed: 0.008 + Math.random() * 0.01,
    screenX: 0,
    screenY: 0,
    projectedScale: 1,
  }
}

export function Floating3DParticles({
  quantity = 150,
  color = '#0EA5E9',
  size = 3.8,
  opacity = 0.44,
  drift = 0.32,
  depth = 0.55,
  className = '',
  ...canvasProps
}: Floating3DParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colorRef = useRef(color)

  useEffect(() => {
    colorRef.current = color
  }, [color])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !context) return

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let animationFrame: number | null = null
    let inView = true
    let reducedMotion = false
    const depthIntensity = Math.max(0, Math.min(1, depth))

    const drawParticle = (particle: Particle) => {
      const radius = Math.max(0, particle.size * particle.projectedScale)
      if (!radius) return

      context.beginPath()
      context.fillStyle = hexToRgba(colorRef.current, particle.opacity)
      context.arc(particle.screenX, particle.screenY, radius, 0, Math.PI * 2)
      context.fill()
      context.strokeStyle = hexToRgba(colorRef.current, Math.min(1, particle.opacity + 0.3))
      context.lineWidth = Math.max(0.7, radius * 0.16)
      context.stroke()

      context.beginPath()
      context.fillStyle = `rgba(255,255,255,${Math.min(0.88, particle.opacity + 0.28)})`
      context.arc(
        particle.screenX - radius * 0.3,
        particle.screenY - radius * 0.32,
        Math.max(0.55, radius * 0.2),
        0,
        Math.PI * 2,
      )
      context.fill()
    }

    const paintFrame = (advance: boolean) => {
      context.clearRect(0, 0, width, height)

      for (const particle of particles) {
        if (advance) {
          particle.swayPhase += particle.swaySpeed
          particle.y -= drift * particle.riseSpeed * (0.72 + particle.depth * 0.48)
          if (particle.y < -particle.size * 3) particle.y = height + particle.size * 3
          if (particle.y > height + particle.size * 3) particle.y = -particle.size * 3
        }
        const scale = 0.7 + particle.depth * depthIntensity * 0.72
        particle.screenX = particle.x + Math.sin(particle.swayPhase) * particle.swayAmplitude * scale
        particle.screenY = particle.y
        particle.projectedScale = scale
      }

      particles.sort((first, second) => first.projectedScale - second.projectedScale)
      particles.forEach(drawParticle)
    }

    const tick = () => {
      if (!inView || document.hidden || reducedMotion) {
        animationFrame = null
        return
      }
      paintFrame(true)
      animationFrame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (animationFrame === null && inView && !document.hidden && !reducedMotion) animationFrame = requestAnimationFrame(tick)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, MAX_DPR))
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      const particleCount = window.innerWidth < MOBILE_BREAKPOINT ? Math.round(quantity * MOBILE_PARTICLE_RATIO) : quantity
      particles = Array.from({ length: Math.max(0, particleCount) }, () => spawnParticle(width, height, size, opacity))
      paintFrame(false)
      start()
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => {
      reducedMotion = motionQuery.matches
      if (reducedMotion && animationFrame !== null) cancelAnimationFrame(animationFrame)
      animationFrame = null
      paintFrame(false)
      start()
    }
    const onVisibilityChange = () => start()
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    const intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true
      if (!inView) {
        if (animationFrame !== null) cancelAnimationFrame(animationFrame)
        animationFrame = null
      } else {
        start()
      }
    })

    reducedMotion = motionQuery.matches
    resizeObserver?.observe(canvas)
    if (!resizeObserver) window.addEventListener('resize', resize)
    intersectionObserver?.observe(canvas)
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionQuery.addEventListener('change', syncMotionPreference)
    resize()

    return () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      if (!resizeObserver) window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener('change', syncMotionPreference)
    }
  }, [depth, drift, opacity, quantity, size])

  return <canvas ref={canvasRef} aria-hidden="true" tabIndex={-1} className={`floating-3d-particles ${className}`.trim()} {...canvasProps} />
}
