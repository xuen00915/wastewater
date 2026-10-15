import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('layers an inert particle canvas behind the hero content', () => {
    const { container } = render(<Hero />)
    const particles = container.querySelector('canvas.hero__particles')
    expect(particles).toHaveAttribute('aria-hidden', 'true')
    expect(particles).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Transforming Wastewater')
  })
})
