import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TreatmentPathway } from './TreatmentPathway'

describe('TreatmentPathway', () => {
  it('presents six ordered, selectable treatment zones on the island graphic', () => {
    render(<TreatmentPathway />)
    expect(screen.getByRole('img', { name: /isometric wastewater treatment island/i })).toHaveAttribute('src', '/images/treatment-island.webp')
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(6)
    expect(tabs.map((tab) => tab.getAttribute('aria-label'))).toEqual([
      '01 Influent',
      '02 Screening & settling',
      '03 Biological treatment',
      '04 Separation & monitoring',
      '05 Resource recovery',
      '06 Reuse & green wall',
    ])
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs.slice(1).every((tab) => tab.getAttribute('aria-selected') === 'false')).toBe(true)
    expect(tabs.every((tab) => !tab.hasAttribute('disabled'))).toBe(true)
  })

  it('updates selection and the adjacent explanation after a click', async () => {
    const user = userEvent.setup()
    render(<TreatmentPathway />)
    await user.click(screen.getByRole('tab', { name: /05 resource recovery/i }))
    expect(screen.getByRole('tab', { name: /05 resource recovery/i })).toHaveAttribute('aria-selected', 'true')
    const panel = screen.getByRole('tabpanel')
    expect(within(panel).getByRole('heading', { name: 'Resource recovery' })).toBeInTheDocument()
    expect(panel).toHaveTextContent('useful resources')
  })

  it('supports arrow-key movement with wraparound', () => {
    render(<TreatmentPathway />)
    const tabs = screen.getAllByRole('tab')
    tabs[0].focus()
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' })
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveFocus()
    fireEvent.keyDown(tabs[1], { key: 'ArrowLeft' })
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(tabs[0], { key: 'ArrowUp' })
    expect(tabs[5]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(tabs[5], { key: 'ArrowDown' })
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('supports Home and End keys', () => {
    render(<TreatmentPathway />)
    const tabs = screen.getAllByRole('tab')
    fireEvent.keyDown(tabs[0], { key: 'End' })
    expect(tabs[5]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(tabs[5], { key: 'Home' })
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('describes a generic research pathway without universal claims', () => {
    const { container } = render(<TreatmentPathway />)
    expect(container).toHaveTextContent('generic research pathway')
    expect(container).not.toHaveTextContent(/proprietary|universal treatment train/i)
  })
})
