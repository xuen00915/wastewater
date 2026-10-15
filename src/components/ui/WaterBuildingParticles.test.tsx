import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { WaterBuildingParticles } from './WaterBuildingParticles'

describe('WaterBuildingParticles', () => {
  it('starts with water particles on the left regardless of the browser animation timestamp', () => {
    let frameCallback: FrameRequestCallback = () => undefined
    const particlePositions: Array<[number, number]> = []
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { frameCallback = callback; return 1 }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('ResizeObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.stubGlobal('IntersectionObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      beginPath: vi.fn(), fill: vi.fn(), clearRect: vi.fn(), setTransform: vi.fn(), save: vi.fn(), restore: vi.fn(), strokeRect: vi.fn(), fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1,
      arc: vi.fn((x: number, y: number) => particlePositions.push([x, y])),
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 1000, height: 600 } as DOMRect)

    const { unmount } = render(<WaterBuildingParticles quantity={1} />)
    frameCallback(6_500)

    expect(particlePositions.at(-1)?.[0]).toBeLessThan(500)
    unmount()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('shows the completed green-building composition when reduced motion is requested', () => {
    const particlePositions: Array<[number, number]> = []
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('ResizeObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.stubGlobal('IntersectionObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      beginPath: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn((x: number, y: number) => particlePositions.push([x, y])),
      clearRect: vi.fn(),
      setTransform: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      strokeRect: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 1000, height: 600 } as DOMRect)

    const { unmount } = render(<WaterBuildingParticles quantity={80} />)

    expect(screen.getByRole('img', { name: /water particles flowing into a building green wall/i })).toBeInTheDocument()
    expect(particlePositions).toHaveLength(80)
    expect(particlePositions.some(([x]) => x < 350)).toBe(true)
    expect(particlePositions.some(([x]) => x >= 420 && x <= 580)).toBe(true)
    expect(particlePositions.some(([x]) => x > 600)).toBe(true)

    unmount()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('keeps water, bridge, and green-wall particles visible together during the settled phase', () => {
    let frameCallback: FrameRequestCallback = () => undefined
    const particlePositions: Array<[number, number]> = []
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { frameCallback = callback; return 1 }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('ResizeObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.stubGlobal('IntersectionObserver', class { observe = vi.fn(); disconnect = vi.fn() })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      beginPath: vi.fn(), fill: vi.fn(), clearRect: vi.fn(), setTransform: vi.fn(), save: vi.fn(), restore: vi.fn(), strokeRect: vi.fn(), fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1,
      arc: vi.fn((x: number, y: number) => particlePositions.push([x, y])),
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 1000, height: 600 } as DOMRect)

    const { unmount } = render(<WaterBuildingParticles quantity={120} />)
    frameCallback(10_000)
    particlePositions.length = 0
    frameCallback(18_050)

    expect(particlePositions.some(([x]) => x < 350)).toBe(true)
    expect(particlePositions.some(([x]) => x >= 420 && x <= 580)).toBe(true)
    expect(particlePositions.some(([x]) => x > 600)).toBe(true)

    unmount()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })
})
