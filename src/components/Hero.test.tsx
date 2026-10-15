import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('combines the wastewater image with floating particles and water contours', () => {
    const { container } = render(<Hero />)
    expect(screen.getByRole('img', { name: /pilot wastewater treatment system integrated with vegetation/i })).toBeInTheDocument()
    expect(container.querySelector('canvas.hero__particles')).toBeInTheDocument()
    expect(container.querySelector('.water-contours')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /water particles flowing into a building green wall/i })).not.toBeInTheDocument()
    expect(container.querySelector('.hero__eyebrow')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Transforming Wastewater')
  })
})
