import { act, render } from '@testing-library/react'
import { vi } from 'vitest'
import { Floating3DParticles } from './Floating3DParticles'

describe('Floating3DParticles', () => {
  it('keeps each particle in a narrow buoyant lane instead of orbiting the hero', () => {
    let frameCallback: FrameRequestCallback = () => undefined
    const horizontalPositions: number[] = []
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { frameCallback = callback; return 1 }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('ResizeObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.stubGlobal('IntersectionObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      beginPath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn((x: number) => horizontalPositions.push(x)),
      clearRect: vi.fn(),
      setTransform: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 800, height: 600 } as DOMRect)

    const { unmount } = render(<Floating3DParticles quantity={1} />)
    for (let index = 0; index < 1_500; index += 1) act(() => frameCallback(index * 16))

    expect(Math.max(...horizontalPositions) - Math.min(...horizontalPositions)).toBeLessThan(32)
    unmount()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('draws a visible rim and highlight so particles read as water bubbles', () => {
    const arc = vi.fn()
    const stroke = vi.fn()
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('ResizeObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.stubGlobal('IntersectionObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      beginPath: vi.fn(),
      fill: vi.fn(),
      stroke,
      arc,
      clearRect: vi.fn(),
      setTransform: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 800, height: 600 } as DOMRect)

    const { unmount } = render(<Floating3DParticles quantity={1} />)

    expect(stroke).toHaveBeenCalledOnce()
    expect(arc).toHaveBeenCalledTimes(2)
    unmount()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('keeps one animation loop and cancels it when unmounted', () => {
    let intersectionCallback: IntersectionObserverCallback = () => undefined
    let nextFrame = 0
    const pendingFrames = new Set<number>()
    const requestFrame = vi.fn(() => {
      nextFrame += 1
      pendingFrames.add(nextFrame)
      return nextFrame
    })
    const cancelFrame = vi.fn((id: number) => pendingFrames.delete(id))
    const resizeDisconnect = vi.fn()
    const intersectionDisconnect = vi.fn()

    vi.stubGlobal('requestAnimationFrame', requestFrame)
    vi.stubGlobal('cancelAnimationFrame', cancelFrame)
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('ResizeObserver', class { observe = vi.fn(); disconnect = resizeDisconnect })
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { intersectionCallback = callback }
      observe = vi.fn()
      disconnect = intersectionDisconnect
    })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      beginPath: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      clearRect: vi.fn(),
      setTransform: vi.fn(),
      fillStyle: '',
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 800, height: 600 } as DOMRect)

    const { unmount } = render(<Floating3DParticles />)
    expect(pendingFrames.size).toBe(1)
    act(() => intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver))
    expect(pendingFrames.size).toBe(1)
    unmount()
    expect(pendingFrames.size).toBe(0)
    expect(resizeDisconnect).toHaveBeenCalledOnce()
    expect(intersectionDisconnect).toHaveBeenCalledOnce()
    vi.unstubAllGlobals()
  })

  it('renders one static particle frame when reduced motion is requested', () => {
    let frameCallback: FrameRequestCallback = () => undefined
    const arc = vi.fn()
    const clearRect = vi.fn()
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { frameCallback = callback; return 1 }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('ResizeObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.stubGlobal('IntersectionObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ beginPath: vi.fn(), fill: vi.fn(), stroke: vi.fn(), arc, clearRect, setTransform: vi.fn(), fillStyle: '', strokeStyle: '', lineWidth: 1 } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 320, height: 240 } as DOMRect)

    const { unmount } = render(<Floating3DParticles quantity={10} />)
    act(() => frameCallback(0))
    const firstArcCount = arc.mock.calls.length
    expect(firstArcCount).toBeGreaterThan(0)
    act(() => frameCallback(16))
    expect(arc).toHaveBeenCalledTimes(firstArcCount)
    expect(clearRect).toHaveBeenCalledOnce()
    unmount()
    vi.unstubAllGlobals()
  })
})
