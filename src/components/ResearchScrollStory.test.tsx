import { act, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ResearchScrollStory } from './ResearchScrollStory'

let deliverIntersections: IntersectionObserverCallback
const scrollIntoViewMock = vi.fn()
const originalFontsDescriptor = Object.getOwnPropertyDescriptor(document, 'fonts')
const originalScrollToDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollTo')

class ControlledIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin: string
  readonly scrollMargin = '0px'
  readonly thresholds: readonly number[]

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    deliverIntersections = callback
    this.rootMargin = options?.rootMargin ?? '0px'
    this.thresholds = Array.isArray(options?.threshold) ? options.threshold : [options?.threshold ?? 0]
  }

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}

function entry(target: Element, intersectionRatio: number): IntersectionObserverEntry {
  const rect = target.getBoundingClientRect()
  return {
    boundingClientRect: rect,
    intersectionRatio,
    intersectionRect: rect,
    isIntersecting: intersectionRatio > 0,
    rootBounds: null,
    target,
    time: 0,
  }
}

function chapterRect(top: number, bottom: number): DOMRect {
  return {
    x: 0,
    y: top,
    top,
    bottom,
    left: 0,
    right: 800,
    width: 800,
    height: bottom - top,
    toJSON: () => ({}),
  }
}

function replacePath(path: string) {
  window.history.replaceState({}, '', path)
}

describe('ResearchScrollStory', () => {
  beforeEach(() => {
    replacePath('/research/')
    vi.stubGlobal('IntersectionObserver', ControlledIntersectionObserver)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    })
    scrollIntoViewMock.mockClear()
  })

  afterEach(() => {
    replacePath('/research/')
    if (originalFontsDescriptor) Object.defineProperty(document, 'fonts', originalFontsDescriptor)
    else Reflect.deleteProperty(document, 'fonts')
    if (originalScrollToDescriptor) Object.defineProperty(HTMLElement.prototype, 'scrollTo', originalScrollToDescriptor)
    else Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo')
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('keeps the overview and all three detailed research chapters in the document', () => {
    render(<ResearchScrollStory />)

    const overview = document.getElementById('research-overview')
    expect(overview).not.toBeNull()
    expect(within(overview!).getAllByRole('link')).toHaveLength(3)
    expect(within(overview!).getByRole('link', { name: /Liquid Treatment/i })).toHaveAttribute('href', '#liquid-treatment')
    expect(within(overview!).getByRole('link', { name: /Solid Treatment & Resource Recovery/i })).toHaveAttribute('href', '#solid-treatment')
    expect(within(overview!).getByRole('link', { name: /Living Walls & Green Infrastructure/i })).toHaveAttribute('href', '#living-walls')

    const programme = document.getElementById('research-programme-detail')
    expect(programme).not.toBeNull()
    const navigation = within(programme!).getByRole('navigation', { name: 'Research programme sections' })
    expect(within(navigation).getAllByRole('link')).toHaveLength(3)

    const articles = within(programme!).getAllByRole('article')
    expect(articles.map((article) => article.id)).toEqual(['liquid-treatment', 'solid-treatment', 'living-walls'])
    expect(within(programme!).getAllByRole('listitem', { name: /Step \d:/i })).toHaveLength(12)
    expect(within(programme!).getAllByRole('link', { name: /ISO 30500|US EPA|Dewatering|Green wall height|Nitrogen Removal|Thermal Influence/i })).toHaveLength(7)

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
    expect(document.body).not.toHaveTextContent(/ISO certified|Class A achieved|>\s*10/i)
  })

  it('starts from a valid deep link and falls back to Liquid for an unknown fragment', () => {
    replacePath('/research/#solid-treatment')
    const { unmount } = render(<ResearchScrollStory />)

    expect(screen.getByRole('link', { name: 'Solid Treatment & Resource Recovery', current: 'location' })).toBeInTheDocument()
    expect(document.getElementById('solid-treatment')).toHaveClass('research-story__chapter--active')
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ block: 'start', behavior: 'instant' })
    expect(scrollIntoViewMock.mock.instances[0]).toBe(document.getElementById('solid-treatment'))
    unmount()

    replacePath('/research/#unknown')
    render(<ResearchScrollStory />)
    expect(screen.getByRole('link', { name: 'Liquid Treatment', current: 'location' })).toBeInTheDocument()
  })

  it('activates the most visible chapter without adding a history entry', () => {
    render(<ResearchScrollStory />)
    const historyLength = window.history.length
    const liquid = document.getElementById('liquid-treatment')!
    const solid = document.getElementById('solid-treatment')!
    vi.spyOn(liquid, 'getBoundingClientRect').mockReturnValue(chapterRect(100, 250))
    vi.spyOn(solid, 'getBoundingClientRect').mockReturnValue(chapterRect(300, 620))

    act(() => deliverIntersections([
      entry(liquid, 0.31),
      entry(solid, 0.72),
    ], {} as IntersectionObserver))

    expect(screen.getByRole('link', { name: 'Solid Treatment & Resource Recovery', current: 'location' })).toBeInTheDocument()
    expect(solid).toHaveClass('research-story__chapter--active')
    expect(liquid).not.toHaveClass('research-story__chapter--active')
    expect(window.location.hash).toBe('#solid-treatment')
    expect(window.history.length).toBe(historyLength)
  })

  it('uses current geometry when observer callbacks contain only changed chapters', () => {
    render(<ResearchScrollStory />)
    const liquid = document.getElementById('liquid-treatment')!
    const solid = document.getElementById('solid-treatment')!
    vi.spyOn(liquid, 'getBoundingClientRect').mockReturnValue(chapterRect(100, 340))
    vi.spyOn(solid, 'getBoundingClientRect').mockReturnValue(chapterRect(335, 620))

    act(() => deliverIntersections([
      entry(liquid, 0.72),
      entry(solid, 0.31),
    ], {} as IntersectionObserver))
    expect(screen.getByRole('link', { name: 'Liquid Treatment', current: 'location' })).toBeInTheDocument()

    act(() => deliverIntersections([entry(solid, 0.35)], {} as IntersectionObserver))
    expect(screen.getByRole('link', { name: 'Liquid Treatment', current: 'location' })).toBeInTheDocument()

    vi.mocked(liquid.getBoundingClientRect).mockReturnValue(chapterRect(-20, 229))
    vi.mocked(solid.getBoundingClientRect).mockReturnValue(chapterRect(300, 620))
    act(() => deliverIntersections([entry(liquid, 0)], {} as IntersectionObserver))
    expect(screen.getByRole('link', { name: 'Solid Treatment & Resource Recovery', current: 'location' })).toBeInTheDocument()
  })

  it('measures the current reading-zone overlap on scroll between observer thresholds', () => {
    render(<ResearchScrollStory />)
    const liquid = document.getElementById('liquid-treatment')!
    const solid = document.getElementById('solid-treatment')!
    vi.spyOn(liquid, 'getBoundingClientRect').mockReturnValue(chapterRect(100, 340))
    vi.spyOn(solid, 'getBoundingClientRect').mockReturnValue(chapterRect(335, 620))

    act(() => window.dispatchEvent(new Event('scroll')))
    expect(screen.getByRole('link', { name: 'Liquid Treatment', current: 'location' })).toBeInTheDocument()

    vi.mocked(liquid.getBoundingClientRect).mockReturnValue(chapterRect(-20, 250))
    vi.mocked(solid.getBoundingClientRect).mockReturnValue(chapterRect(300, 620))
    act(() => window.dispatchEvent(new Event('scroll')))

    expect(screen.getByRole('link', { name: 'Solid Treatment & Resource Recovery', current: 'location' })).toBeInTheDocument()
  })

  it('does not let the observer replace a deep link before its deferred scroll settles', () => {
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })
    replacePath('/research/#solid-treatment')
    render(<ResearchScrollStory />)

    const liquid = document.getElementById('liquid-treatment')!
    act(() => deliverIntersections([entry(liquid, 0.8)], {} as IntersectionObserver))

    expect(window.location.hash).toBe('#solid-treatment')
    expect(screen.getByRole('link', { name: 'Solid Treatment & Resource Recovery', current: 'location' })).toBeInTheDocument()

    act(() => {
      frames.shift()?.(0)
      frames.shift()?.(16)
    })
    expect(scrollIntoViewMock.mock.instances[0]).toBe(document.getElementById('solid-treatment'))

    act(() => deliverIntersections([entry(liquid, 0.8)], {} as IntersectionObserver))
    expect(window.location.hash).toBe('#solid-treatment')

    act(() => frames.shift()?.(32))
    vi.spyOn(liquid, 'getBoundingClientRect').mockReturnValue(chapterRect(100, 340))
    act(() => {
      deliverIntersections([entry(liquid, 0.8)], {} as IntersectionObserver)
      frames.shift()?.(48)
    })
    expect(window.location.hash).toBe('#liquid-treatment')
  })

  it('waits for web fonts before positioning a deep-linked chapter', async () => {
    const frames: FrameRequestCallback[] = []
    let resolveFonts!: () => void
    const fontsReady = new Promise<void>((resolve) => { resolveFonts = resolve })
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { status: 'loading', ready: fontsReady },
    })
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })
    replacePath('/research/#living-walls')
    render(<ResearchScrollStory />)

    expect(frames).toHaveLength(0)
    await act(async () => resolveFonts())
    expect(frames).toHaveLength(1)
  })

  it('keeps the active chapter title visible in the mobile index', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('innerWidth', 320)
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    })
    replacePath('/research/#living-walls')

    render(<ResearchScrollStory />)

    expect(scrollTo).toHaveBeenCalled()
    expect(scrollTo.mock.instances[0]).toHaveClass('research-story__index')
  })

  it('remains readable and keeps Liquid active without Intersection Observer', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<ResearchScrollStory />)

    expect(screen.getByRole('link', { name: 'Liquid Treatment', current: 'location' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('heading', { name: 'Solid Treatment & Resource Recovery', level: 3 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Living Walls & Green Infrastructure', level: 3 })).toBeInTheDocument()
  })
})
