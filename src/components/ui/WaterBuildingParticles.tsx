import { useEffect, useRef, type CanvasHTMLAttributes } from 'react'

type WaterBuildingParticlesProps = Omit<CanvasHTMLAttributes<HTMLCanvasElement>, 'width' | 'height'> & {
  quantity?: number
}

type Particle = {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  size: number
  opacity: number
  delay: number
  phase: number
  sourceColor: readonly [number, number, number]
  targetColor: readonly [number, number, number]
}

type BuildingZone = {
  x: number
  y: number
  width: number
  height: number
  color: readonly [number, number, number]
}

const MOBILE_BREAKPOINT = 768
const MOBILE_PARTICLE_RATIO = 0.48
const MAX_DPR = 2
const CYCLE_DURATION = 11_500
const WATER_BLUE = [14, 165, 233] as const
const WATER_AQUA = [45, 212, 191] as const
const BUILDING_GREEN = [63, 143, 107] as const
const BUILDING_DEEP_GREEN = [35, 105, 78] as const
const BUILDING_NAVY = [8, 47, 73] as const

const buildingZones: readonly BuildingZone[] = [
  { x: .59, y: .2, width: .22, height: .62, color: BUILDING_GREEN },
  { x: .53, y: .43, width: .13, height: .39, color: BUILDING_DEEP_GREEN },
  { x: .78, y: .35, width: .12, height: .47, color: BUILDING_NAVY },
  { x: .56, y: .36, width: .3, height: .035, color: WATER_AQUA },
  { x: .55, y: .51, width: .32, height: .035, color: BUILDING_DEEP_GREEN },
  { x: .54, y: .67, width: .35, height: .04, color: BUILDING_GREEN },
  { x: .62, y: .16, width: .15, height: .035, color: BUILDING_DEEP_GREEN },
]
const zonePattern = [0, 0, 0, 0, 1, 1, 2, 3, 4, 5, 6] as const

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value))
}

function easeInOut(value: number) {
  const t = clamp(value)
  return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function mix(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function mixColor(start: readonly number[], end: readonly number[], progress: number, alpha: number) {
  const red = Math.round(mix(start[0], end[0], progress))
  const green = Math.round(mix(start[1], end[1], progress))
  const blue = Math.round(mix(start[2], end[2], progress))
  return `rgba(${red},${green},${blue},${alpha})`
}

function createParticles(width: number, height: number, quantity: number): Particle[] {
  const compact = width < MOBILE_BREAKPOINT
  return Array.from({ length: quantity }, (_, index) => {
    const zoneIndex = zonePattern[index % zonePattern.length]
    const zone = buildingZones[zoneIndex]
    const zoneFrequency = zonePattern.filter((candidate) => candidate === zoneIndex).length
    const localIndex = Math.floor(index / zonePattern.length) * zoneFrequency + zonePattern.slice(0, index % zonePattern.length).filter((candidate) => candidate === zoneIndex).length
    let column = (localIndex * .754877666) % 1
    let row = (localIndex * .569840296) % 1
    if (zoneIndex <= 2 && localIndex % 3 === 0) {
      const edge = ((localIndex / 3) * .618033989) % 1
      if (edge < .25) { column = edge * 4; row = 0 }
      else if (edge < .5) { column = 1; row = (edge - .25) * 4 }
      else if (edge < .75) { column = 1 - (edge - .5) * 4; row = 1 }
      else { column = 0; row = 1 - (edge - .75) * 4 }
    }
    const normalizedX = zone.x + column * zone.width
    const normalizedY = zone.y + row * zone.height
    return {
      sourceX: width * (.03 + Math.random() * .34),
      sourceY: height * (.08 + Math.random() * (compact ? .45 : .84)),
      targetX: width * (compact ? .08 + ((normalizedX - .53) / .37) * .84 : normalizedX),
      targetY: height * (compact ? .55 + normalizedY * .42 : normalizedY),
      size: 1.35 + Math.random() * 2.45,
      opacity: .45 + Math.random() * .42,
      delay: (index % 19) / 19 * .12,
      phase: Math.random() * Math.PI * 2,
      sourceColor: index % 3 === 0 ? WATER_AQUA : WATER_BLUE,
      targetColor: zone.color,
    }
  })
}

function formationProgress(cycle: number, delay: number) {
  if (cycle < .08) return 0
  if (cycle < .57) return easeInOut((cycle - .08 - delay) / (.37 - delay))
  if (cycle < .86) return 1
  return 1 - easeInOut((cycle - .86) / .14)
}

export function WaterBuildingParticles({ quantity = 480, className = '', ...canvasProps }: WaterBuildingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    let cycleStartedAt: number | null = null

    const paintFrame = (timestamp: number, staticFrame = false) => {
      context.clearRect(0, 0, width, height)
      const cycle = staticFrame ? .7 : (timestamp % CYCLE_DURATION) / CYCLE_DURATION
      const frameProgress = formationProgress(cycle, 0)

      if (frameProgress > .12) {
        const compact = width < MOBILE_BREAKPOINT
        context.save()
        context.globalAlpha = clamp((frameProgress - .12) / .5) * .28
        context.strokeStyle = 'rgb(8,47,73)'
        context.lineWidth = 1
        buildingZones.slice(0, 3).forEach((zone) => {
          const left = compact ? .08 + ((zone.x - .53) / .37) * .84 : zone.x
          const right = compact ? .08 + (((zone.x + zone.width) - .53) / .37) * .84 : zone.x + zone.width
          const top = compact ? .55 + zone.y * .42 : zone.y
          const bottom = compact ? .55 + (zone.y + zone.height) * .42 : zone.y + zone.height
          context.strokeRect(left * width, top * height, (right - left) * width, (bottom - top) * height)
        })
        context.restore()
      }

      for (const particle of particles) {
        const progress = formationProgress(cycle, particle.delay)
        const loose = 1 - progress
        const currentX = mix(particle.sourceX, particle.targetX, progress) + Math.sin(timestamp * .0012 + particle.phase) * 12 * loose
        const currentY = mix(particle.sourceY, particle.targetY, progress) + Math.cos(timestamp * .001 + particle.phase) * 7 * loose
        const radius = particle.size * (.82 + progress * .34)

        context.beginPath()
        context.fillStyle = mixColor(particle.sourceColor, particle.targetColor, progress, particle.opacity)
        context.arc(currentX, currentY, radius, 0, Math.PI * 2)
        context.fill()
      }
    }

    const tick = (timestamp: number) => {
      if (!inView || document.hidden || reducedMotion) {
        animationFrame = null
        return
      }
      if (cycleStartedAt === null) cycleStartedAt = timestamp
      paintFrame(timestamp - cycleStartedAt)
      animationFrame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (animationFrame === null && inView && !document.hidden && !reducedMotion) {
        animationFrame = requestAnimationFrame(tick)
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, MAX_DPR))
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      const count = window.innerWidth < MOBILE_BREAKPOINT ? Math.round(quantity * MOBILE_PARTICLE_RATIO) : quantity
      particles = createParticles(width, height, Math.max(0, count))
      paintFrame(reducedMotion ? CYCLE_DURATION * .7 : 0, reducedMotion)
      start()
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => {
      reducedMotion = motionQuery.matches
      cycleStartedAt = null
      if (animationFrame !== null) cancelAnimationFrame(animationFrame)
      animationFrame = null
      paintFrame(reducedMotion ? CYCLE_DURATION * .7 : 0, reducedMotion)
      start()
    }
    const onVisibilityChange = () => start()
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    const intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true
      if (!inView && animationFrame !== null) {
        cancelAnimationFrame(animationFrame)
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
  }, [quantity])

  return (
    <div className="water-building-particles" role="img" aria-label="Water particles forming a planted green building">
      <canvas ref={canvasRef} aria-hidden="true" tabIndex={-1} className={`water-building-particles__canvas ${className}`.trim()} {...canvasProps} />
    </div>
  )
}
