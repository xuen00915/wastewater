import { render, screen } from '@testing-library/react'
import { InternalPageHero } from './InternalPageHero'

describe('InternalPageHero', () => {
  it('provides one shared image frame for consistent sizing across internal pages', () => {
    render(
      <InternalPageHero
        title="Example page"
        description="Example description"
        image="/images/example.webp"
        alt="Example environmental research"
      />,
    )

    expect(screen.getByRole('img', { name: 'Example environmental research' }).parentElement)
      .toHaveClass('internal-hero__media')
  })
})
