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
  angle: number
  radius: number
  y: number
  size: number
  angularSpeed: number
  opacity: number
  screenX: number
  screenY: number
  projectedScale: number
}

const MOBILE_BREAKPOINT = 768
const SPREAD_FACTOR = 1.2
const MAX_DPR = 2

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace('#', '').trim()
  const full = clean.length === 3 ? clean.split('').map((character) => character + character).join('') : clean
  if (!/^[0-9a-f]{6}$/i.test(full)) return `rgba(45,212,191,${alpha})`
  const numeric = Number.parseInt(full, 16)
  return `rgba(${(numeric >> 16) & 0xff},${(numeric >> 8) & 0xff},${numeric & 0xff},${alpha})`
}

function deriveProjection(depth: number) {
  const intensity = Math.max(0, Math.min(1, depth))
  const fov = 800 - intensity * 600
  const perspectiveDistance = 100 + intensity * 700
  const depthRange = intensity * Math.min(400, fov + perspectiveDistance - 1)
  return { fov, perspectiveDistance, depthRange }
}

function spawnParticle(width: number, height: number, size: number, opacity: number): Particle {
  const sizeVariance = size * 0.4
  const opacityVariance = 0.2
  return {
    angle: Math.random() * Math.PI * 2,
    radius: Math.random() * Math.max(width, height) * SPREAD_FACTOR,
    y: (Math.random() - 0.5) * height * 2,
    size: Math.max(0.5, size - sizeVariance + Math.random() * sizeVariance * 2),
    angularSpeed: 0.0015 + Math.random() * 0.001,
    opacity: Math.min(1, Math.max(0, opacity - opacityVariance + Math.random() * opacityVariance * 2)),
    screenX: 0,
    screenY: 0,
    projectedScale: 1,
  }
}

export function Floating3DParticles({
  quantity = 180,
  color = '#2DD4BF',
  size = 2,
  opacity = 0.26,
  drift = 0.18,
  depth = 0.35,
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
    const projection = deriveProjection(depth)

    const drawParticle = (particle: Particle) => {
      const radius = Math.max(0, particle.size * particle.projectedScale)
      if (!radius) return
      context.beginPath()
      context.fillStyle = hexToRgba(colorRef.current, particle.opacity)
      context.arc(particle.screenX, particle.screenY, radius, 0, Math.PI * 2)
      context.fill()
    }

    const paintFrame = (advance: boolean) => {
      context.clearRect(0, 0, width, height)
      const centerX = width / 2
      const centerY = height / 2

      for (const particle of particles) {
        if (advance) {
          particle.angle += particle.angularSpeed
          particle.y -= drift
          if (particle.y < -height) particle.y = height
          if (particle.y > height) particle.y = -height
        }
        const denominator = Math.max(1, projection.fov + projection.perspectiveDistance + Math.sin(particle.angle) * projection.depthRange)
        const scale = projection.fov / denominator
        particle.screenX = centerX + Math.cos(particle.angle) * particle.radius * scale
        particle.screenY = centerY + particle.y * scale
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
      const particleCount = window.innerWidth < MOBILE_BREAKPOINT ? Math.round(quantity * 0.2) : quantity
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
