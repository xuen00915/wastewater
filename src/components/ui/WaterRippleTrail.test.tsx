import { fireEvent, render } from '@testing-library/react'
import { vi } from 'vitest'
import { WaterRippleTrail } from './WaterRippleTrail'

describe('WaterRippleTrail', () => {
  it('draws a ripple after the mouse moves across the page', () => {
    let frameCallback: FrameRequestCallback = () => undefined
    const arc = vi.fn()
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { frameCallback = callback; return 1 }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      arc,
      beginPath: vi.fn(),
      clearRect: vi.fn(),
      fill: vi.fn(),
      setTransform: vi.fn(),
      stroke: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D)

    const { unmount } = render(<WaterRippleTrail />)
    fireEvent.pointerMove(window, { clientX: 120, clientY: 80, pointerType: 'mouse' })
    frameCallback(100)

    expect(arc).toHaveBeenCalled()
    unmount()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('draws one ripple when a touch pointer taps the page', () => {
    let frameCallback: FrameRequestCallback = () => undefined
    const arc = vi.fn()
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { frameCallback = callback; return 1 }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      arc, beginPath: vi.fn(), clearRect: vi.fn(), fill: vi.fn(), setTransform: vi.fn(), stroke: vi.fn(), fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D)

    const { unmount } = render(<WaterRippleTrail />)
    fireEvent.pointerDown(window, { clientX: 90, clientY: 140, pointerType: 'touch' })
    frameCallback(100)

    expect(arc).toHaveBeenCalled()
    unmount()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('does not draw ripples when reduced motion is requested', () => {
    let frameCallback: FrameRequestCallback = () => undefined
    const arc = vi.fn()
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { frameCallback = callback; return 1 }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      arc, beginPath: vi.fn(), clearRect: vi.fn(), fill: vi.fn(), setTransform: vi.fn(), stroke: vi.fn(), fillStyle: '', strokeStyle: '', lineWidth: 1, globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D)

    const { unmount } = render(<WaterRippleTrail />)
    fireEvent.pointerMove(window, { clientX: 120, clientY: 80, pointerType: 'mouse' })
    frameCallback(100)

    expect(arc).not.toHaveBeenCalled()
    unmount()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })
})
