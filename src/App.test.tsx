import { render, screen, within } from '@testing-library/react'
import { App } from './App'

describe('homepage composition', () => {
  it('presents one primary story in the required section order', () => {
    const { container } = render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const titles = [...container.querySelectorAll('h2')].map((heading) => heading.textContent)
    expect(titles).toEqual([
      'Water Shouldn’t End After Treatment',
      'From Wastewater to Greener Buildings',
      'Three Research Areas. One Circular System.',
      'Connecting Water Research With Living Systems',
      'Research Designed for Real-World Application',
      'Research Beyond the Laboratory',
      'Research Works Better Through Collaboration',
      'Let’s Build Better Water Systems Together',
    ])
  })

  it('renders the complete data-driven research content', () => {
    render(<App />)
    expect(within(screen.getByTestId('research-areas')).getAllByRole('article')).toHaveLength(3)
    expect(within(screen.getByTestId('benefits')).getAllByRole('article')).toHaveLength(4)
    expect(within(screen.getByTestId('projects')).getAllByRole('article')).toHaveLength(3)
    expect(within(screen.getByTestId('collaboration-types')).getAllByRole('article')).toHaveLength(3)
    const projectRegion = screen.getByTestId('projects')
    expect(within(projectRegion).getAllByText('Pilot Research')).toHaveLength(2)
    expect(within(projectRegion).getAllByText('Research')).toHaveLength(2)
    expect(screen.getByText(String(new Date().getFullYear()), { exact: false })).toBeInTheDocument()
  })

  it('does not invent organisation contact, location, client, or result details', () => {
    const { container } = render(<App />)
    expect(container).not.toHaveTextContent(/@|\+65|Singapore|client|percent|% saved/i)
  })
})
