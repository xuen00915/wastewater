import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LivingWaterPortal } from './LivingWaterPortal'

describe('LivingWaterPortal', () => {
  it('presents the existing wastewater image as one meaningful visual', () => {
    const { container } = render(<LivingWaterPortal />)

    const image = screen.getByRole('img', {
      name: 'Representative pilot wastewater treatment system integrated with vegetation',
    })
    expect(image).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(1)
    expect(container.querySelector('.living-water-portal__image')).toHaveAttribute(
      'href',
      expect.stringContaining('/images/home-hero-wastewater.webp'),
    )
  })

  it('uses one mutable organic mask with layered liquid edges', () => {
    const { container } = render(<LivingWaterPortal />)

    expect(container.querySelector('clipPath [data-water-mask]')).toHaveAttribute('d')
    expect(container.querySelector('.living-water-portal__edge--outer')).toBeInTheDocument()
    expect(container.querySelector('.living-water-portal__edge--highlight')).toBeInTheDocument()
    expect(container.querySelector('.living-water-portal__refraction')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('.living-water-portal__droplet').length).toBeLessThanOrEqual(5)
    expect(container.querySelector('[data-ripple-canvas-mount]')).toBeInTheDocument()
  })

  it('keeps only the transition frame inside the animated portal', () => {
    const { container } = render(<LivingWaterPortal />)
    const darkFrame = container.querySelector('.living-water-portal__frame--dark')
    const lightFrame = container.querySelector('.living-water-portal__frame--light')

    expect(darkFrame).not.toBeInTheDocument()
    expect(lightFrame).toHaveAttribute('src', '/images/home-water-frame-light.webp')
    expect(lightFrame).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not reintroduce competing cards, contours, particles, or factual copy', () => {
    const { container } = render(<LivingWaterPortal />)

    expect(container).not.toHaveTextContent('Circular Water System')
    expect(container.querySelector('.portal-card')).not.toBeInTheDocument()
    expect(container.querySelector('.hero__particles')).not.toBeInTheDocument()
    expect(container.querySelector('.water-contours')).not.toBeInTheDocument()
  })
})
