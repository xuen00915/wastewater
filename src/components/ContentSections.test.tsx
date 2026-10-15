import { render, screen } from '@testing-library/react'
import { FinalCta } from './FinalCta'
import { Footer } from './Footer'
import { ProjectsSection } from './ProjectsSection'

describe('homepage destination integrity', () => {
  it('marks placeholder projects as forthcoming instead of linking to themselves', () => {
    render(<ProjectsSection />)
    expect(screen.queryByRole('link', { name: /view project/i })).not.toBeInTheDocument()
    expect(screen.getAllByText('Project details coming soon')).toHaveLength(3)
  })

  it('routes collaboration and career actions to meaningful content', () => {
    render(<><FinalCta /><Footer /></>)
    expect(screen.getByRole('link', { name: 'Collaborate With Us' })).toHaveAttribute('href', '#collaboration-options')
    expect(screen.getByRole('link', { name: 'Career' })).toHaveAttribute('href', '/career/')
    expect(document.getElementById('career-opportunities')).toHaveTextContent('Opportunities will be shared here when available')
    expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument()
    expect(document.getElementById('contact-availability')).toHaveTextContent('Contact details will be published here when available')
  })
})
