import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('assembles one accessible full-scene zoom story', () => {
    const { container } = render(<Hero />)

    expect(container.querySelectorAll('.water-story')).toHaveLength(1)
    expect(container.querySelector('.living-water-portal')).not.toBeInTheDocument()
    expect(container.querySelector('.hero__immersion')).not.toBeInTheDocument()
    expect(container.querySelector('.water-surface')).not.toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(1)
    expect(screen.getByRole('img', { name: /representative pilot wastewater treatment system integrated with vegetation/i })).toBeInTheDocument()
    expect(container.querySelector('.hero__scroll-indicator')).toHaveTextContent(/scroll to explore/i)
  })

  it('keeps the approved copy and destinations while highlighting only greener buildings', () => {
    render(<Hero />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Transforming Wastewater Into Resources for Greener Buildings')
    expect(heading.querySelectorAll('em')).toHaveLength(1)
    expect(heading.querySelector('em')).toHaveTextContent('Greener Buildings')
    expect(screen.getByRole('link', { name: 'Explore Our Research' })).toHaveAttribute('href', '/research/')
    expect(screen.getByRole('link', { name: 'View Projects' })).toHaveAttribute('href', '/projects/')
  })

  it('does not stack superseded scene, particle, contour, or card effects', () => {
    const { container } = render(<Hero />)

    expect(container.querySelector('.portal-transition-scene')).not.toBeInTheDocument()
    expect(container.querySelector('.hero__particles')).not.toBeInTheDocument()
    expect(container.querySelector('.water-contours')).not.toBeInTheDocument()
    expect(container.querySelector('.portal-card')).not.toBeInTheDocument()
  })

  it('uses only the approved full-width cinematic composition', () => {
    const { container } = render(<Hero />)

    expect(container.querySelector('.hero__cinematic-photo')).toHaveAttribute('src', '/images/home-hero-wastewater.webp')
    expect(container.querySelector('.hero__cinematic-frame')).toHaveAttribute('src', '/images/home-water-frame-dark.webp')
    expect(container.querySelector('.hero__cinematic')).toHaveAttribute('role', 'img')
    expect(container.querySelector('.living-water-portal__frame--light')).not.toBeInTheDocument()
  })
})
