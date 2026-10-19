import { act, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PortalRippleCanvas } from './PortalRippleCanvas'

function mockMotionPreference(matches = false, legacy = false) {
  const addEventListener = vi.fn()
  const removeEventListener = vi.fn()
  const addListener = vi.fn()
  const removeListener = vi.fn()
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: legacy ? undefined : addEventListener,
    removeEventListener: legacy ? undefined : removeEventListener,
    addListener,
    removeListener,
    dispatchEvent: vi.fn(() => true),
  } as unknown as MediaQueryList)))
  return { addEventListener, removeEventListener, addListener, removeListener }
}

function mockCanvas(pathContains = true) {
  const ellipse = vi.fn()
  const setTransform = vi.fn()
  const isPointInPath = vi.fn(() => pathContains)
  const context = {
    beginPath: vi.fn(),
    bezierCurveTo: vi.fn(),
    clearRect: vi.fn(),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    ellipse,
    fill: vi.fn(),
    fillStyle: '',
    globalAlpha: 1,
    lineWidth: 1,
    isPointInPath,
    moveTo: vi.fn(),
    restore: vi.fn(),
    save: vi.fn(),
    setTransform,
    stroke: vi.fn(),
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context)
  return { ellipse, isPointInPath, setTransform }
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
    flush(time = 500) {
      const callback = callbacks.shift()
      if (!callback) throw new Error('Expected a pending animation frame')
      act(() => callback(time))
    },
  }
}

function renderCanvas(active = true, maskContains: boolean | null = true) {
  const rendered = render(
    <section className="water-story" data-active={String(active)}>
      <div className="living-water-portal__interaction">
        <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
          <path data-water-mask d="M 100 100 H 900 V 600 H 100 Z" />
        </svg>
        <PortalRippleCanvas />
      </div>
    </section>,
  )
  const interaction = rendered.container.querySelector<HTMLElement>('.living-water-portal__interaction')!
  const mask = rendered.container.querySelector<SVGGeometryElement>('[data-water-mask]')!
  const isPointInFill = vi.fn(() => maskContains ?? false)
  if (maskContains !== null) {
    Object.defineProperty(mask, 'isPointInFill', { configurable: true, value: isPointInFill })
  } else {
    Object.defineProperty(mask, 'isPointInFill', { configurable: true, value: undefined })
  }
  let rect = {
    left: 20,
    top: 30,
    width: 800,
    height: 600,
    right: 820,
    bottom: 630,
    x: 20,
    y: 30,
    toJSON: () => ({}),
  }
  vi.spyOn(interaction, 'getBoundingClientRect').mockImplementation(() => rect)
  fireEvent.resize(window)
  return {
    ...rendered,
    interaction,
    isPointInFill,
    setRect(nextRect: Partial<DOMRect>) {
      rect = { ...rect, ...nextRect }
    },
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  Object.defineProperty(document, 'hidden', { configurable: true, value: false })
  Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 1 })
})

describe('PortalRippleCanvas', () => {
  it('draws three elliptical rings at exact portal-local coordinates', () => {
    mockMotionPreference()
    const { ellipse } = mockCanvas()
    const frames = mockAnimationFrame()
    const { interaction } = renderCanvas()

    fireEvent.pointerDown(interaction, { clientX: 420, clientY: 330 })
    frames.flush()

    expect(ellipse).toHaveBeenCalledTimes(3)
    expect(ellipse).toHaveBeenNthCalledWith(1, 400, 300, expect.any(Number), expect.any(Number), 0, 0, Math.PI * 2)
    expect(ellipse.mock.calls[0][3]).toBeLessThan(ellipse.mock.calls[0][2])
  })

  it('rejects pointer positions outside the organic portal boundary', () => {
    mockMotionPreference()
    mockCanvas()
    const frames = mockAnimationFrame()
    const { interaction, isPointInFill } = renderCanvas(true, false)

    fireEvent.pointerDown(interaction, { clientX: 60, clientY: 240 })

    expect(isPointInFill).toHaveBeenCalledTimes(1)
    expect(frames.request).not.toHaveBeenCalled()
  })

  it('normalizes transformed pointer coordinates into the canvas coordinate space', () => {
    mockMotionPreference()
    const { ellipse } = mockCanvas()
    const frames = mockAnimationFrame()
    const { interaction, setRect } = renderCanvas()

    setRect({ width: 1600, height: 1200, right: 1620, bottom: 1230 })
    fireEvent.pointerDown(interaction, { clientX: 820, clientY: 630 })
    frames.flush()

    expect(ellipse).toHaveBeenNthCalledWith(1, 400, 300, expect.any(Number), expect.any(Number), 0, 0, Math.PI * 2)
  })

  it('uses the rendered mask path when SVG fill hit testing is unavailable', () => {
    mockMotionPreference()
    const { isPointInPath } = mockCanvas(false)
    mockAnimationFrame()
    vi.stubGlobal('Path2D', vi.fn())
    const { interaction } = renderCanvas(true, null)

    fireEvent.pointerDown(interaction, { clientX: 60, clientY: 240 })

    expect(isPointInPath).toHaveBeenCalledTimes(1)
  })

  it('caps active ripples at three', () => {
    mockMotionPreference()
    const { ellipse } = mockCanvas()
    const frames = mockAnimationFrame()
    const { interaction } = renderCanvas()

    for (let index = 0; index < 5; index += 1) {
      fireEvent.pointerDown(interaction, { clientX: 320 + index * 20, clientY: 300 })
    }
    frames.flush()

    expect(ellipse).toHaveBeenCalledTimes(9)
  })

  it('caps the backing canvas device pixel ratio at two', () => {
    mockMotionPreference()
    const { setTransform } = mockCanvas()
    mockAnimationFrame()
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 3 })

    const { container } = renderCanvas()
    const canvas = container.querySelector('canvas')!

    expect(canvas.width).toBe(1600)
    expect(canvas.height).toBe(1200)
    expect(setTransform).toHaveBeenLastCalledWith(2, 0, 0, 2, 0, 0)
  })

  it('suppresses interaction for reduced motion, hidden documents, and inactive stories', () => {
    const motion = mockMotionPreference(true)
    mockCanvas()
    const frames = mockAnimationFrame()
    const reduced = renderCanvas()
    fireEvent.pointerDown(reduced.interaction, { clientX: 420, clientY: 330 })
    expect(frames.request).not.toHaveBeenCalled()
    reduced.unmount()

    motion.removeEventListener.mockClear()
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })))
    Object.defineProperty(document, 'hidden', { configurable: true, value: true })
    const hidden = renderCanvas()
    fireEvent.pointerDown(hidden.interaction, { clientX: 420, clientY: 330 })
    expect(frames.request).not.toHaveBeenCalled()
    hidden.unmount()

    Object.defineProperty(document, 'hidden', { configurable: true, value: false })
    const inactive = renderCanvas(false)
    fireEvent.pointerDown(inactive.interaction, { clientX: 420, clientY: 330 })
    expect(frames.request).not.toHaveBeenCalled()
  })

  it('supports legacy motion listeners and cleans up every resource', () => {
    const motion = mockMotionPreference(false, true)
    mockCanvas()
    const frames = mockAnimationFrame()
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    const resizeDisconnect = vi.fn()
    const intersectionDisconnect = vi.fn()
    vi.stubGlobal('ResizeObserver', vi.fn(function () {
      return { observe: vi.fn(), disconnect: resizeDisconnect, unobserve: vi.fn() }
    }))
    vi.stubGlobal('IntersectionObserver', vi.fn(function () {
      return { observe: vi.fn(), disconnect: intersectionDisconnect, unobserve: vi.fn(), takeRecords: vi.fn(), root: null, rootMargin: '', thresholds: [] }
    }))

    const { interaction, unmount } = renderCanvas()
    fireEvent.pointerDown(interaction, { clientX: 420, clientY: 330 })
    unmount()

    expect(motion.addListener).toHaveBeenCalledWith(expect.any(Function))
    expect(motion.removeListener).toHaveBeenCalledWith(expect.any(Function))
    expect(frames.cancel).toHaveBeenCalledTimes(1)
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1)
    expect(resizeDisconnect).toHaveBeenCalledTimes(1)
    expect(intersectionDisconnect).toHaveBeenCalledTimes(1)
  })
})
