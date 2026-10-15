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

    vi.stubGlobal('requestAnimationFrame', requestFrame)
    vi.stubGlobal('cancelAnimationFrame', cancelFrame)
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('ResizeObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { intersectionCallback = callback }
      observe = vi.fn()
      disconnect = vi.fn()
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
    vi.unstubAllGlobals()
  })
})
