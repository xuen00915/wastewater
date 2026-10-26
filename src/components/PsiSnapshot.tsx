import { useEffect, useState } from 'react'

const PSI_API_URL = 'https://api-open.data.gov.sg/v2/real-time/api/psi'
const PSI_SOURCE_URL = 'https://data.gov.sg/datasets/d_fe37906a0182569d891506e815e819b7/view'
const PSI_CACHE_KEY = 'eastenv:psi-snapshot:v1'
const PSI_CACHE_TTL = 15 * 60 * 1000

const regionNames = ['north', 'south', 'east', 'west', 'central'] as const
type RegionName = typeof regionNames[number]
type RegionReadings = Record<RegionName, number>

type PsiReading = {
  regions: RegionReadings
  updatedTimestamp: string
}

type SnapshotState =
  | { status: 'loading' }
  | { status: 'ready'; reading: PsiReading }
  | { status: 'error' }

function parsePsiResponse(payload: unknown): PsiReading {
  const item = (payload as { data?: { items?: unknown[] } })?.data?.items?.[0] as {
    updatedTimestamp?: unknown
    readings?: { psi_twenty_four_hourly?: Partial<Record<RegionName, unknown>> }
  } | undefined
  const values = item?.readings?.psi_twenty_four_hourly

  if (typeof item?.updatedTimestamp !== 'string' || !values) throw new Error('PSI data is unavailable')

  const regions = Object.fromEntries(regionNames.map((region) => {
    const value = values[region]
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('PSI data is invalid')
    return [region, value]
  })) as RegionReadings

  return { regions, updatedTimestamp: item.updatedTimestamp }
}

function psiDescriptor(value: number) {
  if (value <= 50) return 'Good'
  if (value <= 100) return 'Moderate'
  if (value <= 200) return 'Unhealthy'
  if (value <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

function formatUpdatedTime(timestamp: string) {
  return new Intl.DateTimeFormat('en-SG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Singapore',
  }).format(new Date(timestamp)).toUpperCase()
}

function readCachedPsi(): PsiReading | null {
  if (typeof window === 'undefined') return null
  try {
    const cached = JSON.parse(localStorage.getItem(PSI_CACHE_KEY) ?? 'null') as {
      cachedAt?: unknown
      reading?: Partial<PsiReading>
    } | null
    if (!cached || typeof cached.cachedAt !== 'number' || Date.now() - cached.cachedAt >= PSI_CACHE_TTL) return null
    if (typeof cached.reading?.updatedTimestamp !== 'string' || !cached.reading.regions) return null
    if (!regionNames.every((region) => typeof cached.reading?.regions?.[region] === 'number')) return null
    return cached.reading as PsiReading
  } catch {
    return null
  }
}

function cachePsi(reading: PsiReading) {
  try {
    localStorage.setItem(PSI_CACHE_KEY, JSON.stringify({ cachedAt: Date.now(), reading }))
  } catch {
    // Live data remains usable when storage is unavailable.
  }
}

export function PsiSnapshot() {
  const [state, setState] = useState<SnapshotState>(() => {
    const cached = readCachedPsi()
    return cached ? { status: 'ready', reading: cached } : { status: 'loading' }
  })
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (state.status !== 'loading') return
    const controller = new AbortController()

    fetch(PSI_API_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('PSI request failed')
        return response.json()
      })
      .then((payload: unknown) => {
        const reading = parsePsiResponse(payload)
        cachePsi(reading)
        setState({ status: 'ready', reading })
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setState({ status: 'error' })
      })

    return () => controller.abort()
  }, [state.status])

  const readings = state.status === 'ready' ? Object.values(state.reading.regions) : []
  const minimum = readings.length ? Math.min(...readings) : 0
  const maximum = readings.length ? Math.max(...readings) : 0
  const descriptor = minimum === maximum
    ? psiDescriptor(maximum)
    : `${psiDescriptor(minimum)} to ${psiDescriptor(maximum)}`

  if (!expanded) {
    return (
      <aside className="psi-widget psi-widget--collapsed" aria-label="Singapore Air Quality">
        <button
          className="floating-control psi-widget__collapsed-control"
          type="button"
          aria-label="Expand PSI panel"
          aria-expanded="false"
          onClick={() => setExpanded(true)}
        >
          <span>PSI</span>
          <strong>{state.status === 'ready' ? `${minimum}–${maximum}` : state.status === 'loading' ? 'Loading' : 'Unavailable'}</strong>
          <i aria-hidden="true">+</i>
        </button>
      </aside>
    )
  }

  return (
    <aside className="psi-widget" aria-labelledby="psi-title">
      <header className="psi-widget__header">
        <div>
          <span>Live environmental data</span>
          <h2 id="psi-title">Singapore Air Quality</h2>
        </div>
        <button
          className="psi-widget__toggle"
          type="button"
          aria-label="Fold PSI panel"
          aria-expanded="true"
          onClick={() => setExpanded(false)}
        >
          <span aria-hidden="true">−</span>
        </button>
      </header>

      <div className="psi-widget__body" aria-live="polite">
          {state.status === 'loading' && <p className="psi-snapshot__message">Loading the latest official readings…</p>}

          {state.status === 'error' && (
            <p className="psi-snapshot__message" role="status">Live PSI data is temporarily unavailable.</p>
          )}

          {state.status === 'ready' && (
            <>
              <div className="psi-snapshot__summary">
                <span>24-hour PSI across Singapore</span>
                <strong>{minimum}–{maximum}</strong>
                <em>{descriptor}</em>
                <small>Updated {formatUpdatedTime(state.reading.updatedTimestamp)} SGT</small>
              </div>
              <ul className="psi-snapshot__regions" aria-label="Regional 24-hour PSI readings">
                {regionNames.map((region) => (
                  <li key={region}>
                    <span>{region[0].toUpperCase() + region.slice(1)}</span>
                    <strong>{state.reading.regions[region]}</strong>
                    <small>{psiDescriptor(state.reading.regions[region])}</small>
                  </li>
                ))}
              </ul>
            </>
          )}

          <a className="psi-snapshot__source" href={PSI_SOURCE_URL} target="_blank" rel="noreferrer">
            View source data <span aria-hidden="true">↗</span>
          </a>
      </div>
    </aside>
  )
}
