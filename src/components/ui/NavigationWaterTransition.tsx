import { useEffect, useState, type CSSProperties } from 'react'

type TransitionState = {
  x: number
  y: number
} | null

const NAVIGATION_DELAY = 360

function isInternalPageLink(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== '_self') return false
  if (anchor.hasAttribute('download')) return false

  const destination = new URL(anchor.href, window.location.href)
  if (destination.origin !== window.location.origin) return false

  const current = new URL(window.location.href)
  if (destination.pathname === current.pathname && destination.search === current.search) return false

  return true
}

export function NavigationWaterTransition() {
  const [transition, setTransition] = useState<TransitionState>(null)

  useEffect(() => {
    const motionQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null
    let navigationTimer: number | null = null

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (motionQuery?.matches) return

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a')
      if (!(anchor instanceof HTMLAnchorElement) || !isInternalPageLink(anchor)) return

      event.preventDefault()

      const rect = anchor.getBoundingClientRect()
      const hasPointerPosition = event.clientX > 0 || event.clientY > 0
      const x = hasPointerPosition ? event.clientX : rect.left + rect.width / 2
      const y = hasPointerPosition ? event.clientY : rect.top + rect.height / 2
      const destination = anchor.href

      document.documentElement.classList.add('water-page-leaving')
      setTransition({ x, y })

      if (navigationTimer !== null) window.clearTimeout(navigationTimer)
      navigationTimer = window.setTimeout(() => {
        window.location.assign(destination)
      }, NAVIGATION_DELAY)
    }

    document.addEventListener('click', onClick, true)

    return () => {
      document.removeEventListener('click', onClick, true)
      if (navigationTimer !== null) window.clearTimeout(navigationTimer)
      document.documentElement.classList.remove('water-page-leaving')
    }
  }, [])

  if (!transition) return null

  const style = {
    '--water-transition-x': `${transition.x}px`,
    '--water-transition-y': `${transition.y}px`,
  } as CSSProperties

  return (
    <div className="page-water-transition" style={style} aria-hidden="true">
      <span className="page-water-transition__wash" />
      <span className="page-water-transition__ring page-water-transition__ring--one" />
      <span className="page-water-transition__ring page-water-transition__ring--two" />
      <span className="page-water-transition__ring page-water-transition__ring--three" />
    </div>
  )
}
