import { render, screen } from '@testing-library/react'
import { ProcessSection } from './ProcessSection'

describe('ProcessSection', () => {
  it('keeps all five stages visible and keyboard focusable without IntersectionObserver', () => {
    const original = window.IntersectionObserver
    // @ts-expect-error testing browser fallback
    delete window.IntersectionObserver
    render(<ProcessSection />)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
    for (const stage of screen.getAllByRole('listitem')) expect(stage).toHaveAttribute('tabindex', '0')
    window.IntersectionObserver = original
  })
})
