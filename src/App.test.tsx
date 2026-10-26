import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { App } from './App'

const pages = [
  ['/', 'Transforming Wastewater Into Resources for Greener Buildings'],
  ['/services/', 'Treatment Capabilities for Connected Water Systems'],
  ['/research/', 'Research Across Water, Resources and Living Systems'],
  ['/projects/', 'Research Beyond the Laboratory'],
  ['/collaborate/', 'Research Works Better Through Collaboration'],
  ['/career/', 'Build Connected Environmental Systems'],
  ['/about/', 'Research for Circular Water Systems'],
] as const

function renderPath(pathname: string) {
  window.history.replaceState({}, '', pathname)
  return render(<App />)
}

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})))
})

afterEach(() => vi.unstubAllGlobals())

describe('seven-page site composition', () => {
  it.each(pages)('maps %s to one unique page heading', (pathname, heading) => {
    renderPath(pathname)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
  })

  it('keeps Home concise with one continuous water story and linked previews', () => {
    const { container } = renderPath('/')
    expect(container.querySelector('canvas.water-ripple-trail')).toBeInTheDocument()
    expect(container.querySelector('.water-story .challenge--overlay')).toBeInTheDocument()
    expect(container.querySelector('.water-story + .process')).toBeInTheDocument()
    expect(container.querySelector('.portal-transition-scene')).not.toBeInTheDocument()
    expect(container.querySelector('.hero-water-effect')).not.toBeInTheDocument()
    expect(within(screen.getByTestId('research-areas')).getAllByRole('article')).toHaveLength(3)
    expect(within(screen.getByTestId('projects')).getAllByRole('article')).toHaveLength(3)
    const collaboration = screen.getByTestId('collaboration-types')
    expect(within(collaboration).getAllByRole('heading', { level: 3 })).toHaveLength(2)
    expect(within(collaboration).getAllByRole('list')).toHaveLength(2)
    expect(within(collaboration).getAllByRole('listitem')).toHaveLength(8)
    expect(screen.queryByText('How Wastewater Treatment Works')).not.toBeInTheDocument()
    expect(screen.queryByText('Opportunities will be published when available.')).not.toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'Singapore Air Quality' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Expand PSI panel' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('presents the approved circular pathway and public-facing research areas on Home', () => {
    const { container } = renderPath('/')

    expect(screen.getByText('We explore how wastewater treatment, resource recovery and green infrastructure can work together as one connected circular system.')).toBeInTheDocument()
    expect(screen.queryByText('Integrated water system')).not.toBeInTheDocument()

    const process = container.querySelector<HTMLElement>('#process')
    expect(process).not.toBeNull()
    const processHeadings = within(process!).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    expect(processHeadings).toEqual(['Wastewater', 'Treatment', 'Water & Resource Recovery', 'Reuse', 'Green Infrastructure', 'Greener Building'])

    const researchAreas = within(screen.getByTestId('research-areas')).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    expect(researchAreas).toEqual(['Liquid Treatment', 'Solid Treatment & Resource Recovery', 'Living Walls & Green Infrastructure'])
  })

  it('presents the Research page as an overview followed by three scrolling chapters', () => {
    renderPath('/research/')

    const overview = document.getElementById('research-overview')
    const programme = document.getElementById('research-programme-detail')
    const editorial = screen.getByRole('heading', { level: 2, name: 'Connecting Water With Living Systems' }).closest('section')

    expect(overview).not.toBeNull()
    expect(programme).not.toBeNull()
    const navigation = within(programme!).getByRole('navigation', { name: 'Research programme sections' })
    expect(within(overview!).getAllByRole('link')).toHaveLength(3)
    expect(within(programme!).getAllByRole('article')).toHaveLength(3)
    expect(within(navigation).getAllByRole('link')).toHaveLength(3)
    expect(within(navigation).getAllByRole('link', { current: 'location' })).toHaveLength(1)
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument()
    expect(screen.queryByText('Questions That Connect the System')).not.toBeInTheDocument()

    expect(overview!.compareDocumentPosition(programme!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(programme!.compareDocumentPosition(editorial!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(programme).not.toHaveTextContent(/ISO certified|Class A achieved|>\s*10/i)
  })

  it('shows research and commercial collaboration tracks without claiming named partners', () => {
    renderPath('/')

    expect(screen.getByRole('heading', { level: 2, name: 'Who We Collaborate With' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Research Partners' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Industry & Commercial Partners' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 3, name: 'Pilot Sites' })).not.toBeInTheDocument()
    within(screen.getByTestId('collaboration-types')).getAllByRole('listitem').forEach((item) => expect(item).toHaveTextContent('Potential partner type'))
    expect(screen.queryByText(/University Research|Water Institute|Engineering Systems|Applied Science Centre/i)).not.toBeInTheDocument()
  })

  it('offers two collaboration pathways without a Pilot Sites option', () => {
    renderPath('/collaborate/')

    expect(screen.getByRole('heading', { level: 2, name: 'Two Ways to Work Together' })).toBeInTheDocument()
    expect(screen.queryByText('Pilot Sites')).not.toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'Industry Partners' })).toHaveLength(1)
    expect(screen.getByRole('heading', { name: 'Industry & Commercial Partners' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'Research Partners' })).toHaveLength(2)

    const startingPoint = screen.getByRole('heading', { level: 2, name: 'A Clear Starting Point for Collaboration' }).closest('section')
    expect(startingPoint).not.toBeNull()
    expect(within(startingPoint!).getByRole('heading', { level: 3, name: 'Research Partners' })).toBeInTheDocument()
    expect(within(startingPoint!).getByRole('heading', { level: 3, name: 'Industry & Commercial Partners' })).toBeInTheDocument()
    const partnerTracks = within(startingPoint!).getAllByRole('list')
    expect(partnerTracks).toHaveLength(2)
    partnerTracks.forEach((track) => expect(track).toHaveClass('partner-marquee--large'))
    const partnerExamples = within(startingPoint!).getAllByRole('listitem')
    expect(partnerExamples).toHaveLength(8)
    partnerExamples.forEach((item) => expect(item).toHaveTextContent('Potential partner type'))
    expect(within(startingPoint!).queryByText('Verified contact details will be published here when available.')).not.toBeInTheDocument()
  })

  it('does not stack the superseded immersion overlay over the cinematic hero', () => {
    const { container } = renderPath('/')

    expect(container.querySelector('.hero__immersion')).not.toBeInTheDocument()
    expect(container.querySelector('.hero__cinematic')).toBeInTheDocument()
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

  it.each(pages)('renders the collapsed PSI panel and links Live Project to the project data section on %s', (pathname) => {
    renderPath(pathname)

    expect(screen.getByRole('complementary', { name: 'Singapore Air Quality' })).toBeInTheDocument()
    const psiControl = screen.getByRole('button', { name: 'Expand PSI panel' })
    const liveProjectControl = screen.getByRole('link', { name: 'View live project environmental data' })
    expect(psiControl).toHaveAttribute('aria-expanded', 'false')
    expect(psiControl).toHaveClass('floating-control')
    expect(liveProjectControl).toHaveClass('floating-control')
    expect(liveProjectControl).toHaveAttribute('href', '/projects/#live-project')
  })

  it('scopes the wider capabilities heading to the Services page', () => {
    renderPath('/services/')

    const heading = screen.getByRole('heading', { name: 'From Treatment Questions to Pilot Learning' })
    expect(heading.closest('section')).toHaveClass('services-capabilities')
  })

  it.each(pages)('does not render eyebrow labels on %s', (pathname) => {
    const { container } = renderPath(pathname)
    expect(container.querySelector('.hero__eyebrow, .section-kicker, .section-number, .section-heading__eyebrow')).not.toBeInTheDocument()
  })

  it('keeps project and career availability honest', () => {
    renderPath('/projects/')
    expect(screen.getAllByText('Project details coming soon')).toHaveLength(3)
    expect(screen.queryByRole('link', { name: /view project/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Pilot Treatment Systems' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Resource Recovery Studies' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Green Infrastructure Pilots' })).toBeInTheDocument()

    renderPath('/career/')
    expect(screen.getByText('Opportunities will be published when available.')).toBeInTheDocument()
  })

  it('places verified SFA recognition before the ongoing project panel', () => {
    renderPath('/projects/')

    const recognitionHeading = screen.getByRole('heading', { level: 2, name: 'Recognised Sustainable Aquaculture Research' })
    const recognition = recognitionHeading.closest('section')
    const ongoingProject = screen.getByRole('region', { name: 'Current Ongoing Project' })

    expect(recognition).not.toBeNull()
    expect(screen.getAllByText('Singapore Food Agency · 26 April 2021')).toHaveLength(1)
    expect(recognition!.compareDocumentPosition(ongoingProject) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it.each(['/', '/projects/'])('shows the official environmental data area on %s', (pathname) => {
    renderPath(pathname)

    const panel = screen.getByRole('region', { name: 'Current Ongoing Project' })
    expect(panel).toHaveAttribute('id', 'live-project')
    expect(within(panel).getByRole('heading', { name: 'Live Singapore Environmental Conditions' })).toBeInTheDocument()
    expect(within(panel).getAllByText('Loading latest reading…')).toHaveLength(6)
    expect(within(panel).getByText('Source: NEA, MSS and PUB via data.gov.sg')).toBeInTheDocument()
    expect(within(panel).getByText(/These official observations provide environmental context/)).toBeInTheDocument()
  })

  it.each(pages)('does not invent contact or performance details on %s', (pathname) => {
    const { container } = renderPath(pathname)
    expect(container).not.toHaveTextContent(/\+65|client logo|% saved|verified result|current vacancy/i)
    expect(container.textContent).not.toMatch(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)
  })

  it('links to About Us from the footer', () => {
    renderPath('/')
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about/')
  })
})
