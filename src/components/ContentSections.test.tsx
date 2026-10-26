import { render, screen } from '@testing-library/react'
import { CollaborationSection } from './CollaborationSection'
import { FinalCta } from './FinalCta'
import { Footer } from './Footer'
import { ProjectsSection } from './ProjectsSection'
import { ResearchPillars } from './ResearchPillars'

describe('homepage destination integrity', () => {
  it('marks placeholder projects as forthcoming instead of linking to themselves', () => {
    render(<ProjectsSection />)
    expect(screen.queryByRole('link', { name: /view project/i })).not.toBeInTheDocument()
    expect(screen.getAllByText('Project details coming soon')).toHaveLength(3)
  })

  it('routes collaboration and career actions to meaningful content', () => {
    render(<><FinalCta /><Footer /></>)
    expect(screen.getByRole('link', { name: 'Collaborate With Us' })).toHaveAttribute('href', '/collaborate/')
    expect(screen.getByRole('link', { name: 'Collaborate' })).toHaveAttribute('href', '/collaborate/')
    expect(screen.getByRole('link', { name: 'Career' })).toHaveAttribute('href', '/career/')
    expect(screen.queryByText('Opportunities will be published on our Career page when available.')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument()
    expect(document.getElementById('contact-availability')).not.toBeInTheDocument()
  })

  it('shows the organisation name in the footer wordmark and copyright', () => {
    render(<Footer />)

    const wordmark = screen.getByRole('link', { name: 'E & ST Environmental' })
    expect(wordmark).toHaveAttribute('href', '/')
    expect(wordmark.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} E & ST Environmental`))).toBeInTheDocument()
  })

  it('uses the large running-panel treatment for both homepage partner tracks', () => {
    render(<CollaborationSection variant="partners" />)

    expect(screen.getAllByRole('list')).toHaveLength(2)
    screen.getAllByRole('list').forEach((track) => expect(track).toHaveClass('partner-marquee--large'))
    screen.getAllByRole('listitem').forEach((item) => expect(item).toHaveTextContent('Potential partner type'))
  })

  it('keeps the research heading in two intentional lines', () => {
    render(<ResearchPillars />)

    const heading = screen.getByRole('heading', { name: 'Three Research Areas. One Circular System.' })
    expect(heading.children).toHaveLength(2)
    expect(heading.children[0]).toHaveTextContent('Three Research Areas.')
    expect(heading.children[1]).toHaveTextContent('One Circular System.')
  })

  it('deep-links each homepage research card to its matching programme', () => {
    render(<ResearchPillars />)

    expect(screen.getByRole('link', { name: /Explore Liquid Treatment/i })).toHaveAttribute('href', '/research/#liquid-treatment')
    expect(screen.getByRole('link', { name: /Explore Resource Recovery/i })).toHaveAttribute('href', '/research/#solid-treatment')
    expect(screen.getByRole('link', { name: /Explore Green Infrastructure/i })).toHaveAttribute('href', '/research/#living-walls')
  })
})
