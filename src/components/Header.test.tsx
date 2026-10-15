import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Header } from './Header'

describe('Header', () => {
  it('opens and closes the mobile navigation accessibly', async () => {
    const user = userEvent.setup()
    render(<Header />)
    const toggle = screen.getByRole('button', { name: 'Open navigation' })
    const mobileNavigation = document.getElementById('mobile-navigation')!
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(mobileNavigation).toHaveAttribute('inert')
    expect(mobileNavigation).toHaveAttribute('aria-hidden', 'true')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(mobileNavigation).not.toHaveAttribute('inert')
    expect(mobileNavigation).toHaveAttribute('aria-hidden', 'false')
    const firstLink = mobileNavigation.querySelector('a')!
    firstLink.focus()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()
  })

  it('closes the mobile menu after a destination is selected', async () => {
    const user = userEvent.setup()
    render(<Header />)
    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    await user.click(screen.getByRole('navigation', { name: 'Mobile navigation' }).querySelector('a')!)
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('changes visual state after the page-top sentinel leaves view', () => {
    const observerCallbacks: IntersectionObserverCallback[] = []
    class IntersectionObserverMock {
      root = null
      rootMargin = ''
      thresholds = []
      constructor(callback: IntersectionObserverCallback) { observerCallbacks.push(callback) }
      disconnect = vi.fn()
      observe = vi.fn()
      takeRecords = vi.fn(() => [])
      unobserve = vi.fn()
    }
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
    const sentinel = document.createElement('div')
    sentinel.className = 'page-top-sentinel'
    document.body.prepend(sentinel)
    render(<Header />)
    act(() => observerCallbacks[0]([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver))
    expect(screen.getByRole('banner')).not.toHaveClass('site-header--scrolled')
    act(() => observerCallbacks[0]([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver))
    expect(screen.getByRole('banner')).toHaveClass('site-header--scrolled')
    sentinel.remove()
    vi.unstubAllGlobals()
  })
})
