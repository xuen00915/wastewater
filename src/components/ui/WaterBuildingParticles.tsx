import { useEffect, useRef, type CanvasHTMLAttributes } from 'react'

type WaterBuildingParticlesProps = Omit<CanvasHTMLAttributes<HTMLCanvasElement>, 'width' | 'height'> & {
  quantity?: number
}

type ParticleKind = 'water' | 'bridge' | 'building'

type Particle = {
  kind: ParticleKind
  startX: number
  startY: number
  targetX: number
  targetY: number
  size: number
  opacity: number
  phase: number
  color: readonly [number, number, number]
}

type BuildingZone = {
  x: number
  y: number
  width: number
  height: number
  color: readonly [number, number, number]
}

const MOBILE_BREAKPOINT = 768
const MOBILE_PARTICLE_RATIO = 0.52
const MAX_DPR = 2
const FLOW_DURATION = 9_000
const WATER_BLUE = [14, 165, 233] as const
const WATER_AQUA = [45, 212, 191] as const
const BUILDING_GREEN = [63, 143, 107] as const
const BUILDING_DEEP_GREEN = [35, 105, 78] as const
const BUILDING_NAVY = [8, 47, 73] as const

const buildingZones: readonly BuildingZone[] = [
  { x: .68, y: .19, width: .17, height: .64, color: BUILDING_NAVY },
  { x: .84, y: .34, width: .1, height: .49, color: BUILDING_NAVY },
  { x: .7, y: .25, width: .12, height: .51, color: BUILDING_GREEN },
  { x: .7, y: .31, width: .13, height: .035, color: BUILDING_DEEP_GREEN },
  { x: .7, y: .44, width: .14, height: .04, color: BUILDING_GREEN },
  { x: .69, y: .58, width: .16, height: .04, color: BUILDING_DEEP_GREEN },
  { x: .69, y: .72, width: .19, height: .045, color: BUILDING_GREEN },
  { x: .73, y: .15, width: .1, height: .035, color: BUILDING_GREEN },
]
const zonePattern = [0, 0, 1, 2, 2, 2, 3, 4, 5, 6, 7] as const

function mix(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function easeInOut(value: number) {
  const t = Math.min(1, Math.max(0, value))
  return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function mapBuildingPoint(normalizedX: number, normalizedY: number, compact: boolean) {
  if (!compact) return [normalizedX, normalizedY] as const
  return [.52 + ((normalizedX - .68) / .26) * .42, .55 + normalizedY * .42] as const
}

function createParticles(width: number, height: number, quantity: number): Particle[] {
  const compact = width < MOBILE_BREAKPOINT

  return Array.from({ length: quantity }, (_, index) => {
    const group = index % 10
    const kind: ParticleKind = group < 3 ? 'water' : group < 6 ? 'bridge' : 'building'
    const phase = ((index * .618033989) % 1 + Math.random() * .04) % 1
    const waterX = compact ? .04 + Math.random() * .25 : .03 + Math.random() * .31
    const waterY = compact ? .57 + Math.random() * .36 : .09 + Math.random() * .82

    if (kind === 'water') {
      return {
        kind,
        startX: width * waterX,
        startY: height * waterY,
        targetX: width * waterX,
        targetY: height * waterY,
        size: 1.35 + Math.random() * 2.5,
        opacity: .45 + Math.random() * .4,
        phase,
        color: index % 3 === 0 ? WATER_AQUA : WATER_BLUE,
      }
    }

    if (kind === 'bridge') {
      const bridgeStartX = compact ? .24 : .27
      const bridgeStartY = compact ? .74 : .52
      const bridgeEndX = compact ? .57 : .72
      const bridgeEndY = compact ? .75 : .53
      return {
        kind,
        startX: width * bridgeStartX,
        startY: height * bridgeStartY,
        targetX: width * bridgeEndX,
        targetY: height * bridgeEndY,
        size: 1.2 + Math.random() * 2.25,
        opacity: .5 + Math.random() * .4,
        phase,
        color: index % 2 === 0 ? WATER_AQUA : WATER_BLUE,
      }
    }

    const buildingIndex = Math.floor(index / 10) * 4 + Math.max(0, group - 6)
    const zoneIndex = zonePattern[buildingIndex % zonePattern.length]
    const zone = buildingZones[zoneIndex]
    let column = (buildingIndex * .754877666) % 1
    let row = (buildingIndex * .569840296) % 1
    if (zoneIndex <= 1 && buildingIndex % 3 === 0) {
      const edge = ((buildingIndex / 3) * .618033989) % 1
      if (edge < .25) { column = edge * 4; row = 0 }
      else if (edge < .5) { column = 1; row = (edge - .25) * 4 }
      else if (edge < .75) { column = 1 - (edge - .5) * 4; row = 1 }
      else { column = 0; row = 1 - (edge - .75) * 4 }
    }
    const [targetX, targetY] = mapBuildingPoint(zone.x + column * zone.width, zone.y + row * zone.height, compact)

    return {
      kind,
      startX: width * targetX,
      startY: height * targetY,
      targetX: width * targetX,
      targetY: height * targetY,
      size: 1.25 + Math.random() * 2.5,
      opacity: .5 + Math.random() * .4,
      phase,
      color: zone.color,
    }
  })
}

export function WaterBuildingParticles({ quantity = 520, className = '', ...canvasProps }: WaterBuildingParticlesProps) {
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
    let animationStartedAt: number | null = null

    const paintBuildingOutline = () => {
      const compact = width < MOBILE_BREAKPOINT
      context.save()
      context.globalAlpha = .22
      context.strokeStyle = 'rgb(8,47,73)'
      context.lineWidth = 1
      buildingZones.slice(0, 2).forEach((zone) => {
        const [left, top] = mapBuildingPoint(zone.x, zone.y, compact)
        const [right, bottom] = mapBuildingPoint(zone.x + zone.width, zone.y + zone.height, compact)
        context.strokeRect(left * width, top * height, (right - left) * width, (bottom - top) * height)
      })
      context.restore()
    }

    const paintFrame = (timestamp: number, staticFrame = false) => {
      context.clearRect(0, 0, width, height)
      paintBuildingOutline()
      const flowTime = staticFrame ? 0 : (timestamp % FLOW_DURATION) / FLOW_DURATION

      for (const particle of particles) {
        let currentX = particle.startX
        let currentY = particle.startY
        let color = particle.color
        let radius = particle.size

        if (particle.kind === 'water') {
          const motion = staticFrame ? 0 : timestamp * .0008
          currentX += Math.sin(motion + particle.phase * Math.PI * 2) * 8
          currentY += Math.cos(motion * .83 + particle.phase * Math.PI * 2) * 6
        } else if (particle.kind === 'bridge') {
          const rawProgress = staticFrame ? particle.phase : (flowTime + particle.phase) % 1
          const progress = easeInOut(rawProgress)
          currentX = mix(particle.startX, particle.targetX, progress)
          const bridgeLift = Math.sin(progress * Math.PI) * height * .055
          const ripple = staticFrame ? 0 : Math.sin(timestamp * .0018 + particle.phase * 20) * 5
          currentY = mix(particle.startY, particle.targetY, progress) - bridgeLift + ripple
          color = progress > .72 ? BUILDING_GREEN : particle.color
          radius *= .84 + Math.sin(progress * Math.PI) * .28
        } else if (!staticFrame) {
          const pulse = .9 + Math.sin(timestamp * .001 + particle.phase * Math.PI * 2) * .1
          radius *= pulse
        }

        context.beginPath()
        context.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${particle.opacity})`
        context.arc(currentX, currentY, radius, 0, Math.PI * 2)
        context.fill()
      }
    }

    const tick = (timestamp: number) => {
      if (!inView || document.hidden || reducedMotion) {
        animationFrame = null
        return
      }
      if (animationStartedAt === null) animationStartedAt = timestamp
      paintFrame(timestamp - animationStartedAt)
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
      paintFrame(0, reducedMotion)
      start()
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => {
      reducedMotion = motionQuery.matches
      animationStartedAt = null
      if (animationFrame !== null) cancelAnimationFrame(animationFrame)
      animationFrame = null
      paintFrame(0, reducedMotion)
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
    <div className="water-building-particles" role="img" aria-label="Water particles flowing into a building green wall">
      <canvas ref={canvasRef} aria-hidden="true" tabIndex={-1} className={`water-building-particles__canvas ${className}`.trim()} {...canvasProps} />
    </div>
  )
}
