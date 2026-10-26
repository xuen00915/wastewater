import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TreatmentPathway } from './TreatmentPathway'

describe('TreatmentPathway', () => {
  it('presents the original integrated treatment infographic without cropping it', () => {
    render(<TreatmentPathway />)

    const image = screen.getByRole('img', { name: /integrated in-situ wastewater treatment and reuse system/i })
    expect(image).toHaveAttribute('src', '/images/integrated-treatment-reuse-diagram.webp')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(screen.getByRole('button', { name: 'Enlarge treatment diagram' })).toBeInTheDocument()
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })

  it('keeps the embedded diagram in a scrollable preview separate from the enlarge control', () => {
    render(<TreatmentPathway />)

    const preview = screen.getByRole('region', { name: 'Scrollable treatment diagram preview' })
    const image = within(preview).getByRole('img', { name: /integrated in-situ wastewater treatment and reuse system/i })
    const enlarge = screen.getByRole('button', { name: 'Enlarge treatment diagram' })

    expect(preview).toHaveAttribute('tabindex', '0')
    expect(enlarge).not.toContainElement(image)
  })

  it('opens and closes an accessible enlarged diagram', async () => {
    const user = userEvent.setup()
    render(<TreatmentPathway />)

    await user.click(screen.getByRole('button', { name: 'Enlarge treatment diagram' }))

    const dialog = screen.getByRole('dialog', { name: 'Integrated treatment and reuse diagram' })
    expect(within(dialog).getByRole('img', { name: /integrated in-situ wastewater treatment and reuse system/i })).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Close enlarged diagram' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the enlarged diagram with Escape', async () => {
    const user = userEvent.setup()
    render(<TreatmentPathway />)

    await user.click(screen.getByRole('button', { name: 'Enlarge treatment diagram' }))
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
