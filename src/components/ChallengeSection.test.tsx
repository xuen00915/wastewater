import { render } from '@testing-library/react'
import { ChallengeSection } from './ChallengeSection'

describe('ChallengeSection', () => {
  it('marks the first content reveal for an opacity-only transition', () => {
    const { container } = render(<ChallengeSection overlay />)

    expect(container.querySelector('.challenge__grid')).toHaveClass('challenge__reveal')
    expect(container.querySelector('.challenge')).toHaveClass('challenge--overlay')
  })
})
