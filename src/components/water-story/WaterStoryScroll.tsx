import { useEffect, useRef, type PropsWithChildren, type ReactElement } from 'react'
import { deriveWaterStoryValues } from './waterStoryMath'

const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function getDocumentTop(element: HTMLElement) {
  let top = 0
  let current: HTMLElement | null = element

  while (current) {
    top += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }

  return top
}

function getProgress(element: HTMLElement) {
  const scrollRange = Math.max(1, element.offsetHeight - window.innerHeight)
  return (window.scrollY - getDocumentTop(element)) / scrollRange
}

export function WaterStoryScroll({ children }: PropsWithChildren): ReactElement {
  const storyRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const story = storyRef.current
    if (!story) return

    const motionQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia(MOTION_QUERY)
      : null
    let reducedMotion = motionQuery?.matches ?? false
    let frameId: number | null = null
    let inViewport = true
    let scrollListenersAttached = false
    const heroCopy = story.querySelector<HTMLElement>('.hero__copy')

    const updateActivity = () => {
      story.dataset.active = String(inViewport && !document.hidden)
    }

    const paint = () => {
      frameId = null
      const values = deriveWaterStoryValues(reducedMotion ? 0 : getProgress(story))
      story.style.setProperty('--water-progress', String(values.progress))
      story.style.setProperty('--portal-progress', String(values.portalProgress))
      story.style.setProperty('--portal-scale', String(values.portalScale))
      story.style.setProperty('--copy-opacity', String(values.copyOpacity))
      story.style.setProperty('--copy-shift-x', `${values.progress * -10}px`)
      story.style.setProperty('--copy-shift-y', `${values.progress * -10}px`)
      story.style.setProperty('--immersion-progress', String(values.immersionProgress))
      story.style.setProperty('--exit-progress', String(values.exitProgress))
      story.style.setProperty('--waterline-percent', String(values.waterlinePercent))
      story.style.setProperty('--waterline-position', `${values.waterlinePercent}%`)
      story.style.setProperty('--image-scale', String(values.imageScale))
      story.style.setProperty('--cinematic-scale', String(1 + values.progress * 0.28))
      story.style.setProperty('--cinematic-scene-opacity', String(1 - values.exitProgress * 0.55))

      if (heroCopy) {
        const copyIsInteractive = reducedMotion || values.copyOpacity >= 0.15
        if (!copyIsInteractive && heroCopy.contains(document.activeElement)) {
          (document.activeElement as HTMLElement | null)?.blur()
        }
        heroCopy.toggleAttribute('inert', !copyIsInteractive)
        if (copyIsInteractive) heroCopy.removeAttribute('aria-hidden')
        else heroCopy.setAttribute('aria-hidden', 'true')
      }
    }

    const schedulePaint = () => {
      if (frameId !== null) return
      frameId = window.requestAnimationFrame(paint)
    }

    const attachScrollListeners = () => {
      if (scrollListenersAttached || reducedMotion) return
      window.addEventListener('scroll', schedulePaint, { passive: true })
      window.addEventListener('resize', schedulePaint, { passive: true })
      scrollListenersAttached = true
    }

    const detachScrollListeners = () => {
      if (!scrollListenersAttached) return
      window.removeEventListener('scroll', schedulePaint)
      window.removeEventListener('resize', schedulePaint)
      scrollListenersAttached = false
    }

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      story.dataset.reducedMotion = String(reducedMotion)
      story.dataset.staticStory = String(reducedMotion)
      if (reducedMotion) detachScrollListeners()
      else attachScrollListeners()
      schedulePaint()
    }

    const handleVisibilityChange = () => {
      updateActivity()
      if (!document.hidden) schedulePaint()
    }

    story.dataset.active = 'true'
    story.dataset.reducedMotion = String(reducedMotion)
    story.dataset.staticStory = String(reducedMotion)
    attachScrollListeners()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    let intersectionObserver: IntersectionObserver | null = null
    if (typeof window.IntersectionObserver === 'function') {
      intersectionObserver = new window.IntersectionObserver(([entry]) => {
        inViewport = entry?.isIntersecting ?? true
        updateActivity()
        if (inViewport) schedulePaint()
      })
      intersectionObserver.observe(story)
    }

    if (motionQuery) {
      if (typeof motionQuery.addEventListener === 'function') {
        motionQuery.addEventListener('change', handleMotionChange)
      } else {
        motionQuery.addListener(handleMotionChange)
      }
    }

    schedulePaint()

    return () => {
      detachScrollListeners()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      intersectionObserver?.disconnect()
      if (motionQuery) {
        if (typeof motionQuery.removeEventListener === 'function') {
          motionQuery.removeEventListener('change', handleMotionChange)
        } else {
          motionQuery.removeListener(handleMotionChange)
        }
      }
      if (frameId !== null) window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <section ref={storyRef} className="water-story" data-active="true">
      <div className="water-story__sticky">{children}</div>
    </section>
  )
}
