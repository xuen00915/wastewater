import { fireEvent, render, screen, within } from '@testing-library/react'
import { App } from './App'

const pages = [
  ['/', 'Transforming Wastewater Into Resources for Greener Buildings'],
  ['/services/', 'Treatment Capabilities for Connected Water Systems'],
  ['/research/', 'Research Across Water, Resources and Living Systems'],
  ['/projects/', 'Research Beyond the Laboratory'],
  ['/collaborate/', 'Progress Through Shared Research'],
  ['/career/', 'Build the Future of Environmental Research'],
  ['/about/', 'Research for Circular Water Systems'],
] as const

function renderPath(pathname: string) {
  window.history.replaceState({}, '', pathname)
  return render(<App />)
}

describe('seven-page site composition', () => {
  it.each(pages)('maps %s to one unique page heading', (pathname, heading) => {
    renderPath(pathname)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  })

  it('keeps Home concise with one continuous water story and linked previews', () => {
    const { container } = renderPath('/')
    expect(container.querySelector('canvas.water-ripple-trail')).toBeInTheDocument()
    expect(container.querySelector('.water-story + .challenge')).toBeInTheDocument()
    expect(container.querySelector('.portal-transition-scene')).not.toBeInTheDocument()
    expect(container.querySelector('.hero-water-effect')).not.toBeInTheDocument()
    expect(within(screen.getByTestId('research-areas')).getAllByRole('article')).toHaveLength(3)
    expect(within(screen.getByTestId('projects')).getAllByRole('article')).toHaveLength(3)
    expect(within(screen.getByTestId('collaboration-types')).getAllByRole('article')).toHaveLength(3)
    expect(screen.queryByText('How Wastewater Treatment Works')).not.toBeInTheDocument()
    expect(screen.queryByText('Opportunities will be published when available.')).not.toBeInTheDocument()
  })

  it('keeps the animated immersion overlay transparent so the portal remains visible', () => {
    const { container } = renderPath('/')
    const immersion = container.querySelector<HTMLElement>('.hero__immersion')!

    expect(getComputedStyle(immersion).backgroundColor).toBe('rgba(0, 0, 0, 0)')
  })

  it('retains the global page-navigation water transition on Home', () => {
    const { container } = renderPath('/')

    fireEvent.click(screen.getByRole('link', { name: 'Explore Our Research' }))

    expect(container.querySelector('.page-water-transition')).toBeInTheDocument()
  })

  it.each(pages.slice(1))('does not render Home particles on %s', (pathname) => {
    const { container } = renderPath(pathname)
    expect(container.querySelector('canvas.hero__particles')).not.toBeInTheDocument()
  })

  it.each(pages)('renders the global water ripple surface on %s', (pathname) => {
    const { container } = renderPath(pathname)
    expect(container.querySelector('canvas.water-ripple-trail')).toBeInTheDocument()
  })

  it.each(pages)('does not render eyebrow labels on %s', (pathname) => {
    const { container } = renderPath(pathname)
    expect(container.querySelector('.hero__eyebrow, .section-kicker, .section-number, .section-heading__eyebrow')).not.toBeInTheDocument()
  })

  it('keeps project and career availability honest', () => {
    renderPath('/projects/')
    expect(screen.getAllByText('Project details coming soon')).toHaveLength(3)
    expect(screen.queryByRole('link', { name: /view project/i })).not.toBeInTheDocument()

    renderPath('/career/')
    expect(screen.getByText('Opportunities will be published when available.')).toBeInTheDocument()
  })

  it.each(pages)('does not invent organisation or performance details on %s', (pathname) => {
    const { container } = renderPath(pathname)
    expect(container).not.toHaveTextContent(/\+65|Singapore|client logo|% saved|verified result|current vacancy/i)
    expect(container.textContent).not.toMatch(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)
  })

  it('links to About Us from the footer', () => {
    renderPath('/')
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about/')
  })
})
