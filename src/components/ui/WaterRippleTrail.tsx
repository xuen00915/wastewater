import { useEffect, useRef } from 'react'

type Ripple = {
  x: number
  y: number
  age: number
  life: number
  seed: number
}

const MAX_RIPPLES = 18
const MOVE_THRESHOLD = 26
const MAX_DPR = 2

function easeOut(progress: number) {
  return 1 - Math.pow(1 - progress, 3)
}

export function WaterRippleTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !context) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const ripples: Ripple[] = []
    let width = 0
    let height = 0
    let frameId: number | null = null
    let previousFrame = 0
    let lastX: number | null = null
    let lastY: number | null = null

    const resize = () => {
      width = Math.max(1, window.innerWidth)
      height = Math.max(1, window.innerHeight)
      const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, MAX_DPR))
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const drawRipple = (ripple: Ripple) => {
      const progress = Math.min(1, ripple.age / ripple.life)
      const eased = easeOut(progress)
      const alpha = Math.pow(1 - progress, 1.7)
      const radius = 7 + eased * 45

      context.globalAlpha = alpha * .42
      context.strokeStyle = 'rgb(14, 165, 233)'
      context.lineWidth = 1.25 - progress * .45
      context.beginPath()
      context.arc(ripple.x, ripple.y, radius, 0, Math.PI * 2)
      context.stroke()

      if (progress < .68) {
        context.globalAlpha = alpha * .2
        context.strokeStyle = 'rgb(45, 212, 191)'
        context.beginPath()
        context.arc(ripple.x, ripple.y, radius * .58, 0, Math.PI * 2)
        context.stroke()
      }

      for (let index = 0; index < 2; index += 1) {
        const angle = ripple.seed + index * 2.4
        const distance = radius * (.62 + index * .2)
        context.globalAlpha = alpha * .34
        context.fillStyle = index === 0 ? 'rgb(45, 212, 191)' : 'rgb(14, 165, 233)'
        context.beginPath()
        context.arc(ripple.x + Math.cos(angle) * distance, ripple.y + Math.sin(angle) * distance, 1.8 - progress * .7, 0, Math.PI * 2)
        context.fill()
      }
    }

    const tick = (timestamp: number) => {
      const elapsed = previousFrame === 0 ? 16 : Math.min(34, timestamp - previousFrame)
      previousFrame = timestamp
      context.clearRect(0, 0, width, height)

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index]
        ripple.age += elapsed
        if (ripple.age >= ripple.life) {
          ripples.splice(index, 1)
        } else {
          drawRipple(ripple)
        }
      }

      context.globalAlpha = 1
      if (ripples.length > 0 && !document.hidden && !motionQuery.matches) {
        frameId = requestAnimationFrame(tick)
      } else {
        frameId = null
        previousFrame = 0
      }
    }

    const addRipple = (x: number, y: number) => {
      if (motionQuery.matches || document.hidden) return
      ripples.push({ x, y, age: 0, life: 680, seed: (x * .017 + y * .011) % (Math.PI * 2) })
      if (ripples.length > MAX_RIPPLES) ripples.shift()
      if (frameId === null) frameId = requestAnimationFrame(tick)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      if (lastX !== null && lastY !== null && Math.hypot(event.clientX - lastX, event.clientY - lastY) < MOVE_THRESHOLD) return
      lastX = event.clientX
      lastY = event.clientY
      addRipple(event.clientX, event.clientY)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') addRipple(event.clientX, event.clientY)
    }

    const onVisibilityChange = () => {
      if (document.hidden && frameId !== null) {
        cancelAnimationFrame(frameId)
        frameId = null
        previousFrame = 0
      }
    }

    const onMotionChange = () => {
      if (!motionQuery.matches) return
      ripples.length = 0
      context.clearRect(0, 0, width, height)
      if (frameId !== null) cancelAnimationFrame(frameId)
      frameId = null
      previousFrame = 0
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionQuery.addEventListener('change', onMotionChange)

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])

  return <canvas ref={canvasRef} className="water-ripple-trail" aria-hidden="true" tabIndex={-1} />
}
