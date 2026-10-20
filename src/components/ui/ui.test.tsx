import { fireEvent, render, screen } from '@testing-library/react'
import { StrictMode } from 'react'
import { vi } from 'vitest'
import { ButtonLink } from './ButtonLink'
import { MediaPlaceholder } from './MediaPlaceholder'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

describe('shared homepage UI', () => {
  it('keeps button links navigable and exposes their visual variant', () => {
    render(<ButtonLink href="#research" variant="secondary">Explore research</ButtonLink>)
    const link = screen.getByRole('link', { name: 'Explore research' })
    expect(link).toHaveAttribute('href', '#research')
    expect(link).toHaveClass('button-link--secondary')
  })

  it('uses the requested semantic heading level', () => {
    render(<SectionHeading id="focused-heading" level={3} title="A focused heading" />)
    const heading = screen.getByRole('heading', { level: 3, name: 'A focused heading' })
    expect(heading).toHaveAttribute('id', 'focused-heading')
    expect(heading.closest('header')).toHaveClass('section-heading--strong')
  })

  it('shows a descriptive and replaceable fallback when media cannot load', () => {
    render(
      <MediaPlaceholder
        src="/images/missing.webp"
        alt="Pilot wastewater treatment equipment"
        requiredFilename="/images/missing.webp"
      />,
    )
    expect(screen.getByRole('img', { name: 'Pilot wastewater treatment equipment' })).toHaveAttribute('loading', 'lazy')
    fireEvent.error(screen.getByRole('img', { name: 'Pilot wastewater treatment equipment' }))
    expect(screen.getByText('Pilot wastewater treatment equipment')).toBeInTheDocument()
    expect(screen.getByText('/images/missing.webp')).toBeInTheDocument()
  })

  it('renders reveal content visibly when observers are unavailable', () => {
    render(<Reveal><p>Research content</p></Reveal>)
    expect(screen.getByText('Research content').parentElement).toHaveClass('reveal--visible')
  })

  it('disconnects reveal observers during Strict Mode cleanup', () => {
    const disconnect = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      observe = vi.fn()
      disconnect = disconnect
    })
    const { unmount } = render(<StrictMode><Reveal><p>Observed content</p></Reveal></StrictMode>)
    unmount()
    expect(disconnect).toHaveBeenCalledTimes(2)
    vi.unstubAllGlobals()
  })
})
