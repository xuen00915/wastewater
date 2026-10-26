import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PsiSnapshot } from './PsiSnapshot'

const officialPsiResponse = {
  code: 0,
  errorMsg: '',
  data: {
    items: [{
      date: '2026-10-20',
      updatedTimestamp: '2026-10-20T15:15:42+08:00',
      timestamp: '2026-10-20T15:00:00+08:00',
      readings: {
        psi_twenty_four_hourly: {
          north: 89,
          south: 104,
          west: 138,
          east: 105,
          central: 123,
        },
      },
    }],
  },
}

afterEach(() => {
  localStorage.clear()
  vi.unstubAllGlobals()
})

describe('PsiSnapshot', () => {
  it('shows the latest official PSI range and every regional reading', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(officialPsiResponse),
    }))

    render(<PsiSnapshot />)

    expect(await screen.findByText('89–138')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Expand PSI panel' }))
    expect(screen.getByText('Moderate to Unhealthy')).toBeInTheDocument()
    expect(screen.getByText('Updated 3:15 PM SGT')).toBeInTheDocument()
    expect(screen.getByText('North').closest('li')).toHaveTextContent('89')
    expect(screen.getByText('South').closest('li')).toHaveTextContent('104')
    expect(screen.getByText('West').closest('li')).toHaveTextContent('138')
    expect(screen.getByText('East').closest('li')).toHaveTextContent('105')
    expect(screen.getByText('Central').closest('li')).toHaveTextContent('123')
    expect(screen.getByRole('link', { name: /view source data/i })).toHaveAttribute(
      'href',
      'https://data.gov.sg/datasets/d_fe37906a0182569d891506e815e819b7/view',
    )
  })

  it('reuses a recent reading instead of requesting the API again', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(officialPsiResponse),
    })
    vi.stubGlobal('fetch', fetchMock)

    const firstView = render(<PsiSnapshot />)
    expect(await screen.findByText('89–138')).toBeInTheDocument()
    firstView.unmount()

    render(<PsiSnapshot />)
    expect(await screen.findByText('89–138')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('announces an unavailable live feed without showing a fabricated reading', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network unavailable')))

    render(<PsiSnapshot />)
    await user.click(screen.getByRole('button', { name: 'Expand PSI panel' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Live PSI data is temporarily unavailable.')
    expect(screen.queryByText(/\d+–\d+/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view source data/i })).toBeInTheDocument()
  })

  it('starts folded and expands into the full PSI panel', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(officialPsiResponse),
    }))

    render(<PsiSnapshot />)

    expect(screen.queryByRole('heading', { name: 'Singapore Air Quality' })).not.toBeInTheDocument()
    const expandButton = screen.getByRole('button', { name: 'Expand PSI panel' })
    expect(expandButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(expandButton)

    expect(await screen.findByRole('heading', { name: 'Singapore Air Quality' })).toBeInTheDocument()
    const foldButton = screen.getByRole('button', { name: 'Fold PSI panel' })
    expect(foldButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('89–138')).toBeInTheDocument()
  })
})
