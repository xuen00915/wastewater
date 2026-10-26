import { render, screen } from '@testing-library/react'
import { ProcessSection } from './ProcessSection'

describe('ProcessSection', () => {
  it('presents the integrated treatment diagram as the primary process visual', () => {
    render(<ProcessSection />)

    expect(screen.getByRole('img', {
      name: /integrated in-situ treatment and reuse of municipal wastewater on living walls/i,
    })).toHaveAttribute('src', expect.stringContaining('integrated-treatment-reuse-diagram.webp'))
    expect(screen.getByRole('list', { name: /circular water research pathway/i })).toBeInTheDocument()
  })

  it('keeps all six stages visible and keyboard focusable without IntersectionObserver', () => {
    const original = window.IntersectionObserver
    // @ts-expect-error testing browser fallback
    delete window.IntersectionObserver
    render(<ProcessSection />)
    expect(screen.queryByText('Integrated water system')).not.toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(6)
    for (const stage of screen.getAllByRole('listitem')) expect(stage).toHaveAttribute('tabindex', '0')
    window.IntersectionObserver = original
  })
})
