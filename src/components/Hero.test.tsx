import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('replaces the project photograph with an accessible water-to-building particle scene', () => {
    const { container } = render(<Hero />)
    const scene = screen.getByRole('img', { name: /water particles forming a planted green building/i })
    expect(scene).toContainElement(container.querySelector('canvas.hero__transformation-canvas'))
    expect(screen.queryByRole('img', { name: /pilot wastewater treatment system/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Transforming Wastewater')
  })
})
