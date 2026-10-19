import { useEffect, useRef, type ReactElement } from 'react'

type Ripple = {
  x: number
  y: number
  age: number
}

type FallingDrop = {
  x: number
  y: number
  targetY: number
  age: number
  life: number
}

const MAX_RIPPLES = 3
const RIPPLE_LIFE = 1700
const MAX_DPR = 2
const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function isInsideOrganicPortal(x: number, y: number, width: number, height: number) {
  if (width <= 0 || height <= 0) return false
  const normalizedX = (x - width / 2) / (width * 0.48)
  const normalizedY = (y - height / 2) / (height * 0.44)
  return normalizedX * normalizedX + normalizedY * normalizedY <= 1
}

function storyIsActive(element: HTMLElement) {
  return element.closest<HTMLElement>('.water-story')?.dataset.active !== 'false'
}

export function PortalRippleCanvas(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const interaction = root?.closest<HTMLElement>('.living-water-portal__interaction')
    const context = canvas?.getContext('2d', { alpha: true })
    if (!root || !canvas || !interaction || !context) return

    const ctx = context
    const motionQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia(MOTION_QUERY)
      : null
    const ripples: Ripple[] = []
    const drops: FallingDrop[] = []
    let reducedMotion = motionQuery?.matches ?? false
    let inView = true
    let width = 1
    let height = 1
    let previousTime = 0
    let frameId: number | null = null
    let ambientTimer: number | null = null

    const canAnimate = () => (
      !reducedMotion
      && !document.hidden
      && inView
      && storyIsActive(root)
    )

    const resize = () => {
      const rect = interaction.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, MAX_DPR))
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const drawRipple = (ripple: Ripple) => {
      const progress = Math.min(1, ripple.age / RIPPLE_LIFE)
      const eased = 1 - Math.pow(1 - progress, 3)

      for (let ring = 0; ring < 3; ring += 1) {
        const radius = 12 + eased * (58 + ring * 15)
        ctx.globalAlpha = Math.pow(1 - progress, 1.7) * (0.38 - ring * 0.08)
        ctx.strokeStyle = ring === 1 ? 'rgb(94, 234, 212)' : 'rgb(125, 211, 252)'
        ctx.lineWidth = Math.max(0.7, 1.5 - progress * 0.6)
        ctx.beginPath()
        ctx.ellipse(ripple.x, ripple.y, radius, radius * 0.36, 0, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    const drawDrop = (drop: FallingDrop) => {
      const progress = Math.min(1, drop.age / drop.life)
      const y = drop.y + (drop.targetY - drop.y) * progress * progress
      const radius = 4 + progress * 1.5
      const gradient = ctx.createRadialGradient(drop.x - 1, y - 2, 1, drop.x, y, radius * 1.4)
      gradient.addColorStop(0, 'rgba(255,255,255,.9)')
      gradient.addColorStop(0.55, 'rgba(125,211,252,.48)')
      gradient.addColorStop(1, 'rgba(14,165,233,.04)')
      ctx.globalAlpha = 0.9
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.ellipse(drop.x, y, radius * 0.78, radius, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    const startAnimation = () => {
      if (frameId !== null || !canAnimate() || (ripples.length === 0 && drops.length === 0)) return
      frameId = window.requestAnimationFrame(tick)
    }

    const addRipple = (x: number, y: number) => {
      if (!canAnimate()) return
      ripples.push({ x, y, age: 0 })
      if (ripples.length > MAX_RIPPLES) ripples.shift()
      startAnimation()
    }

    const addAmbientDrop = () => {
      if (!canAnimate() || drops.length > 0 || width < 2 || height < 2) return
      const targetY = height * (0.55 + Math.random() * 0.16)
      drops.push({
        x: width * (0.28 + Math.random() * 0.5),
        y: Math.max(18, targetY - Math.min(120, height * 0.22)),
        targetY,
        age: 0,
        life: 820,
      })
      startAnimation()
    }

    const scheduleAmbientDrop = () => {
      if (ambientTimer !== null) window.clearTimeout(ambientTimer)
      if (reducedMotion) {
        ambientTimer = null
        return
      }
      ambientTimer = window.setTimeout(() => {
        ambientTimer = null
        addAmbientDrop()
        scheduleAmbientDrop()
      }, 4000 + Math.random() * 3000)
    }

    function tick(timestamp: number) {
      frameId = null
      const elapsed = previousTime === 0 ? 16 : Math.min(34, timestamp - previousTime)
      previousTime = timestamp
      ctx.clearRect(0, 0, width, height)

      for (let index = drops.length - 1; index >= 0; index -= 1) {
        const drop = drops[index]
        drop.age += elapsed
        if (drop.age >= drop.life) {
          drops.splice(index, 1)
          addRipple(drop.x, drop.targetY)
        } else {
          drawDrop(drop)
        }
      }

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index]
        ripple.age += elapsed
        if (ripple.age >= RIPPLE_LIFE) ripples.splice(index, 1)
        else drawRipple(ripple)
      }

      ctx.globalAlpha = 1
      if (canAnimate() && (ripples.length > 0 || drops.length > 0)) {
        frameId = window.requestAnimationFrame(tick)
      } else {
        previousTime = 0
      }
    }

    const stopAnimation = () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      frameId = null
      previousTime = 0
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!canAnimate()) return
      const rect = interaction.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (!isInsideOrganicPortal(x, y, rect.width, rect.height)) return
      addRipple(x, y)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) stopAnimation()
      else startAnimation()
    }

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      if (reducedMotion) {
        ripples.length = 0
        drops.length = 0
        stopAnimation()
        ctx.clearRect(0, 0, width, height)
      }
      scheduleAmbientDrop()
    }

    const resizeObserver = typeof window.ResizeObserver === 'function'
      ? new window.ResizeObserver(resize)
      : null
    const intersectionObserver = typeof window.IntersectionObserver === 'function'
      ? new window.IntersectionObserver(([entry]) => {
          inView = entry?.isIntersecting ?? true
          if (inView) startAnimation()
          else stopAnimation()
        }, { threshold: 0.08 })
      : null

    resizeObserver?.observe(interaction)
    if (!resizeObserver) window.addEventListener('resize', resize, { passive: true })
    intersectionObserver?.observe(interaction)
    interaction.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    if (motionQuery) {
      if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', handleMotionChange)
      } else {
        motionQuery.addListener(handleMotionChange)
      }
    }

    resize()
    scheduleAmbientDrop()

    return () => {
      stopAnimation()
      if (ambientTimer !== null) window.clearTimeout(ambientTimer)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      if (!resizeObserver) window.removeEventListener('resize', resize)
      interaction.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (motionQuery) {
        if (typeof motionQuery.removeEventListener === 'function') {
          motionQuery.removeEventListener('change', handleMotionChange)
        } else {
          motionQuery.removeListener(handleMotionChange)
        }
      }
    }
  }, [])

  return (
    <div ref={rootRef} className="portal-ripple-canvas" data-ripple-canvas-mount aria-hidden="true">
      <canvas ref={canvasRef} className="portal-ripple-canvas__surface" tabIndex={-1} />
    </div>
  )
}
