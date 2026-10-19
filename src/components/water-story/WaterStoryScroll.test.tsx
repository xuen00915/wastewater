import { act, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { WaterStoryScroll } from './WaterStoryScroll'

const FULL_FRAME_PATH =
  'M 0 0 C 0 0 250 0 500 0 C 750 0 1000 0 1000 0 C 1000 175 1000 350 1000 350 C 1000 525 1000 700 1000 700 C 750 700 500 700 500 700 C 250 700 0 700 0 700 C 0 525 0 350 0 350 C 0 175 0 0 0 0 Z'

type MediaListener = (event: MediaQueryListEvent) => void

function mockMotionPreference(matches = false, legacy = false) {
  const add = vi.fn()
  const remove = vi.fn()
  const addLegacy = vi.fn()
  const removeLegacy = vi.fn()
  const mediaQuery = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: legacy ? undefined : add,
    removeEventListener: legacy ? undefined : remove,
    addListener: addLegacy,
    removeListener: removeLegacy,
    dispatchEvent: vi.fn(() => true),
  } as unknown as MediaQueryList

  vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery))
  return { add, remove, addLegacy, removeLegacy, mediaQuery }
}

function mockAnimationFrame() {
  const callbacks: FrameRequestCallback[] = []
  const request = vi.fn((callback: FrameRequestCallback) => {
    callbacks.push(callback)
    return callbacks.length
  })
  const cancel = vi.fn()
  vi.stubGlobal('requestAnimationFrame', request)
  vi.stubGlobal('cancelAnimationFrame', cancel)

  return {
    request,
    cancel,
    flush(time = 100) {
      const callback = callbacks.shift()
      if (!callback) throw new Error('Expected an animation frame to be scheduled')
      act(() => callback(time))
    },
  }
}

function mockGeometry(offsetTop = 100, offsetHeight = 1800, viewportHeight = 800) {
  vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockReturnValue(offsetTop)
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(offsetHeight)
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: viewportHeight })
}

function StoryFixture() {
  return (
    <WaterStoryScroll>
      <svg><path data-water-mask /></svg>
      <p>Story content</p>
    </WaterStoryScroll>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
})

describe('WaterStoryScroll', () => {
  it('paints non-zero restored-scroll progress and stage variables on mount', () => {
    mockMotionPreference()
    mockGeometry()
    const frames = mockAnimationFrame()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 600 })

    const { container } = render(<StoryFixture />)
    frames.flush()

    const story = container.querySelector<HTMLElement>('.water-story')!
    expect(story).toHaveStyle({
      '--water-progress': '0.5',
      '--portal-scale': '1.22',
      '--copy-opacity': '0.2857142857142857',
      '--immersion-progress': '0',
      '--exit-progress': '0',
      '--waterline-percent': '60',
      '--image-scale': '1.015',
    })
  })

  it('updates the portal mask at the scheduled scroll position', () => {
    mockMotionPreference()
    mockGeometry()
    const frames = mockAnimationFrame()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 })

    const { container } = render(<StoryFixture />)
    frames.flush()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 750 })

    fireEvent.scroll(window)
    frames.flush(200)

    expect(container.querySelector('[data-water-mask]')).toHaveAttribute('d', FULL_FRAME_PATH)
  })

  it('recalculates after resize and clamps progress to the story range', () => {
    mockMotionPreference()
    mockGeometry()
    const frames = mockAnimationFrame()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 4000 })

    const { container } = render(<StoryFixture />)
    frames.flush()
    expect(container.querySelector('.water-story')).toHaveStyle('--water-progress: 1')

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    fireEvent.resize(window)
    frames.flush(200)
    expect(container.querySelector('.water-story')).toHaveStyle('--water-progress: 0')
  })

  it('uses static reduced-motion mode without scroll-driven listeners', () => {
    mockMotionPreference(true)
    mockGeometry()
    const frames = mockAnimationFrame()
    const addWindowListener = vi.spyOn(window, 'addEventListener')

    const { container } = render(<StoryFixture />)
    frames.flush()

    const story = container.querySelector('.water-story')
    expect(story).toHaveAttribute('data-reduced-motion', 'true')
    expect(story).toHaveStyle('--water-progress: 0')
    expect(addWindowListener).not.toHaveBeenCalledWith('scroll', expect.any(Function), expect.anything())
  })

  it('renders and updates without optional browser observer or media APIs', () => {
    vi.stubGlobal('matchMedia', undefined)
    vi.stubGlobal('IntersectionObserver', undefined)
    vi.stubGlobal('ResizeObserver', undefined)
    mockGeometry()
    const frames = mockAnimationFrame()

    const { container } = render(<StoryFixture />)
    frames.flush()

    expect(container.querySelector('.water-story')).toHaveAttribute('data-active', 'true')
    expect(container.querySelector('.water-story')).toHaveStyle('--water-progress: 0')
  })

  it('cleans up frames, observers, and modern listeners on unmount', () => {
    const motion = mockMotionPreference()
    mockGeometry()
    const frames = mockAnimationFrame()
    const disconnect = vi.fn()
    const observe = vi.fn()
    vi.stubGlobal('IntersectionObserver', vi.fn(function () {
      return { observe, disconnect, unobserve: vi.fn(), takeRecords: vi.fn(), root: null, rootMargin: '', thresholds: [] }
    }))
    const removeWindowListener = vi.spyOn(window, 'removeEventListener')
    const removeDocumentListener = vi.spyOn(document, 'removeEventListener')

    const { unmount } = render(<StoryFixture />)
    unmount()

    expect(observe).toHaveBeenCalledTimes(1)
    expect(disconnect).toHaveBeenCalledTimes(1)
    expect(frames.cancel).toHaveBeenCalledTimes(1)
    expect(removeWindowListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(removeWindowListener).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(removeDocumentListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    expect(motion.remove).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('cleans up legacy motion-query listeners', () => {
    const motion = mockMotionPreference(false, true)
    mockGeometry()
    mockAnimationFrame()

    const { unmount } = render(<StoryFixture />)
    unmount()

    expect(motion.addLegacy).toHaveBeenCalledWith(expect.any(Function) as MediaListener)
    expect(motion.removeLegacy).toHaveBeenCalledWith(expect.any(Function) as MediaListener)
  })
})
