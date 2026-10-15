import { act, render } from '@testing-library/react'
import { vi } from 'vitest'
import { Floating3DParticles } from './Floating3DParticles'

describe('Floating3DParticles', () => {
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
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ beginPath: vi.fn(), fill: vi.fn(), arc, clearRect, setTransform: vi.fn(), fillStyle: '' } as unknown as CanvasRenderingContext2D)
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
