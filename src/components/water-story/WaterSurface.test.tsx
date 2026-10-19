import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WaterSurface } from './WaterSurface'

describe('WaterSurface', () => {
  it('renders an irregular two-layer waterline and underwater depth effects', () => {
    const { container } = render(<WaterSurface />)
    const surface = container.querySelector('.water-surface')
    const waves = container.querySelectorAll('.water-surface__wave')

    expect(surface).toHaveAttribute('aria-hidden', 'true')
    expect(waves).toHaveLength(2)
    expect(waves[0].getAttribute('d')).not.toBe(waves[1].getAttribute('d'))
    expect(container.querySelectorAll('.water-surface__underwater')).toHaveLength(1)
    expect(container.querySelector('.water-surface__caustics')).toBeInTheDocument()
    expect(container.querySelector('.water-surface__rays')).toBeInTheDocument()
    expect(container.querySelector('.water-surface__refraction')).toBeInTheDocument()
  })

  it('provides ten deterministic decorative bubbles without accessible content', () => {
    const { container } = render(<WaterSurface />)
    const bubbles = container.querySelectorAll('.water-surface__bubble')

    expect(bubbles).toHaveLength(10)
    expect(bubbles[0]).toHaveStyle({ '--bubble-size': '4px', '--bubble-x': '8%' })
    expect(container.querySelectorAll('[role="img"]')).toHaveLength(0)
    expect(container).toHaveTextContent('')
  })
})
