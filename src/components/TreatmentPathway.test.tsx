import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TreatmentPathway } from './TreatmentPathway'

describe('TreatmentPathway', () => {
  it('presents five ordered, selectable treatment stages', () => {
    render(<TreatmentPathway />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(5)
    expect(tabs.map((tab) => tab.getAttribute('aria-label'))).toEqual([
      '01 Wastewater enters',
      '02 Treatment',
      '03 Monitoring',
      '04 Resource recovery',
      '05 Reuse & green wall',
    ])
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs.slice(1).every((tab) => tab.getAttribute('aria-selected') === 'false')).toBe(true)
    expect(tabs.every((tab) => !tab.hasAttribute('disabled'))).toBe(true)
  })

  it('updates selection and the adjacent explanation after a click', async () => {
    const user = userEvent.setup()
    render(<TreatmentPathway />)
    await user.click(screen.getByRole('tab', { name: /04 resource recovery/i }))
    expect(screen.getByRole('tab', { name: /04 resource recovery/i })).toHaveAttribute('aria-selected', 'true')
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
    expect(tabs[4]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(tabs[4], { key: 'ArrowDown' })
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('supports Home and End keys', () => {
    render(<TreatmentPathway />)
    const tabs = screen.getAllByRole('tab')
    fireEvent.keyDown(tabs[0], { key: 'End' })
    expect(tabs[4]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(tabs[4], { key: 'Home' })
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('describes a generic research pathway without universal claims', () => {
    const { container } = render(<TreatmentPathway />)
    expect(container).toHaveTextContent('generic research pathway')
    expect(container).not.toHaveTextContent(/proprietary|universal treatment train/i)
  })
})
