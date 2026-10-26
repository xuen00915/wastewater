import { render, screen } from '@testing-library/react'
import { ResearchRecognition } from './ResearchRecognition'

describe('ResearchRecognition', () => {
  it('presents the verified SFA project attribution without overstating the wider grant call', () => {
    render(<ResearchRecognition />)

    expect(screen.getByRole('heading', { level: 2, name: 'Recognised Sustainable Aquaculture Research' })).toBeInTheDocument()
    expect(screen.getByText('Achieving a sustainable aquaculture environment by specialized microbes')).toBeInTheDocument()
    expect(screen.getByText(/National University of Singapore \(NUS\) and E and ST Environmental Pte Ltd/)).toBeInTheDocument()
    expect(screen.getByText(/one of 12 projects awarded under the Sustainable Urban Food Production grant call/)).toBeInTheDocument()
    expect(screen.getByText('Singapore Food Agency · 26 April 2021')).toBeInTheDocument()

    const release = screen.getByRole('link', { name: 'Read the SFA media release' })
    expect(release).toHaveAttribute('href', '/documents/sfa-sustainable-aquaculture-media-release-2021.pdf')
    expect(release).toHaveAttribute('target', '_blank')
    expect(release).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.getByText('PDF · 4 pages · 184 KB')).toBeInTheDocument()
  })
})
