const API_ROOT = 'https://api-open.data.gov.sg/v2/real-time/api'

export const ENVIRONMENTAL_SOURCE_URL = 'https://data.gov.sg/'

export type EnvironmentalFeedKey = 'rainfall' | 'temperature' | 'humidity' | 'wbgt' | 'pm25' | 'floods'

export type EnvironmentalReading = {
  status: 'ready'
  key: EnvironmentalFeedKey
  title: string
  value: string
  unit: string
  context: string
  updatedAt: string
}

export type EnvironmentalFeedError = {
  status: 'error'
  key: EnvironmentalFeedKey
  title: string
}

export type EnvironmentalFeedResult = EnvironmentalReading | EnvironmentalFeedError

export const environmentalFeedMeta: ReadonlyArray<{
  key: EnvironmentalFeedKey
  title: string
  endpoint: string
}> = [
  { key: 'rainfall', title: 'Rainfall', endpoint: `${API_ROOT}/rainfall` },
  { key: 'temperature', title: 'Air Temperature', endpoint: `${API_ROOT}/air-temperature` },
  { key: 'humidity', title: 'Relative Humidity', endpoint: `${API_ROOT}/relative-humidity` },
  { key: 'wbgt', title: 'Heat Stress (WBGT)', endpoint: `${API_ROOT}/weather?api=wbgt` },
  { key: 'pm25', title: 'PM2.5', endpoint: `${API_ROOT}/pm25` },
  { key: 'floods', title: 'Flood Alerts', endpoint: `${API_ROOT}/weather/flood-alerts` },
]

const environmentalRetryDelays = [250, 750] as const
type RetryPause = (delay: number) => Promise<void>

function pauseForRetry(delay: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, delay))
}

async function requestEnvironmentalPayload(
  endpoint: string,
  title: string,
  signal: AbortSignal | undefined,
  request: typeof fetch,
  pause: RetryPause,
) {
  let lastError: unknown = new Error(`${title} request failed`)

  for (let attempt = 0; attempt <= environmentalRetryDelays.length; attempt += 1) {
    let response: Response
    try {
      response = await request(endpoint, { signal, cache: 'no-store' })
    } catch (error) {
      if (signal?.aborted) throw error
      lastError = error
      if (attempt < environmentalRetryDelays.length) {
        await pause(environmentalRetryDelays[attempt])
        continue
      }
      break
    }

    if (response.ok) return response.json()

    lastError = new Error(`${title} request failed with ${response.status}`)
    const retryable = response.status === 429 || response.status >= 500
    if (!retryable || attempt === environmentalRetryDelays.length) break
    await pause(environmentalRetryDelays[attempt])
  }

  throw lastError
}

export function resolveEnvironmentalEndpoint(
  hostname: string,
  basePath: string,
  key: EnvironmentalFeedKey,
  directEndpoint: string,
) {
  const normalizedHostname = hostname.toLowerCase().split(':')[0]
  const isProductionHost = normalizedHostname === 'eastenv.com' || normalizedHostname.endsWith('.eastenv.com')
  if (!isProductionHost) return directEndpoint

  const normalizedBase = `/${basePath.replace(/^\/+|\/+$/g, '')}`
  const proxyPath = normalizedBase === '/' ? '/api/environmental.php' : `${normalizedBase}/api/environmental.php`
  return `${proxyPath}?feed=${encodeURIComponent(key)}`
}

type UnknownRecord = Record<string, unknown>

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' ? value as UnknownRecord : null
}

function asRecordArray(value: unknown): UnknownRecord[] {
  return Array.isArray(value) ? value.map(asRecord).filter((item): item is UnknownRecord => item !== null) : []
}

function finiteNumber(value: unknown): number | null {
  const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN
  return Number.isFinite(number) ? number : null
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-SG', { maximumFractionDigits: 1 }).format(value)
}

function latestStationRange(payload: unknown, key: EnvironmentalFeedKey, title: string, unit: string): EnvironmentalReading {
  const root = asRecord(payload)
  const data = asRecord(root?.data)
  const reading = asRecord(asRecordArray(data?.readings)[0])
  const timestamp = nonEmptyString(reading?.timestamp)
  const values = asRecordArray(reading?.data)
    .map((item) => finiteNumber(item.value))
    .filter((value): value is number => value !== null)

  if (root?.code !== 0 || !timestamp || values.length === 0) throw new Error(`${title} data is unavailable`)

  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  const value = minimum === maximum
    ? formatNumber(maximum)
    : `${formatNumber(minimum)}–${formatNumber(maximum)}`

  return {
    status: 'ready',
    key,
    title,
    value,
    unit,
    context: `Across ${values.length} reporting stations`,
    updatedAt: timestamp,
  }
}

function parseWbgt(payload: unknown): EnvironmentalReading {
  const root = asRecord(payload)
  const data = asRecord(root?.data)
  const record = asRecord(asRecordArray(data?.records)[0])
  const item = asRecord(record?.item)
  const timestamp = nonEmptyString(record?.updatedTimestamp) ?? nonEmptyString(record?.datetime)
  const readings = asRecordArray(item?.readings)
    .map((reading) => ({
      value: finiteNumber(reading.wbgt),
      heatStress: nonEmptyString(reading.heatStress),
      station: asRecord(reading.station),
    }))
    .filter((reading): reading is { value: number; heatStress: string | null; station: UnknownRecord | null } => reading.value !== null)

  if (root?.code !== 0 || !timestamp || readings.length === 0) throw new Error('WBGT data is unavailable')

  const highest = readings.reduce((current, reading) => reading.value > current.value ? reading : current)
  const location = nonEmptyString(highest.station?.townCenter) ?? nonEmptyString(highest.station?.name) ?? 'Singapore'
  const heatStress = highest.heatStress ? `${highest.heatStress} heat stress` : 'Highest station reading'

  return {
    status: 'ready',
    key: 'wbgt',
    title: 'Heat Stress (WBGT)',
    value: formatNumber(highest.value),
    unit: '°C',
    context: `${heatStress} · ${location}`,
    updatedAt: timestamp,
  }
}

function parsePm25(payload: unknown): EnvironmentalReading {
  const root = asRecord(payload)
  const data = asRecord(root?.data)
  const item = asRecord(asRecordArray(data?.items)[0])
  const readings = asRecord(asRecord(item?.readings)?.pm25_one_hourly)
  const timestamp = nonEmptyString(item?.updatedTimestamp) ?? nonEmptyString(item?.timestamp)
  const regions = Object.entries(readings ?? {})
    .map(([region, value]) => ({ region, value: finiteNumber(value) }))
    .filter((reading): reading is { region: string; value: number } => reading.value !== null)

  if (root?.code !== 0 || !timestamp || regions.length === 0) throw new Error('PM2.5 data is unavailable')

  const highest = regions.reduce((current, reading) => reading.value > current.value ? reading : current)
  const region = highest.region[0].toUpperCase() + highest.region.slice(1)

  return {
    status: 'ready',
    key: 'pm25',
    title: 'PM2.5',
    value: formatNumber(highest.value),
    unit: 'µg/m³',
    context: `Highest regional reading · ${region}`,
    updatedAt: timestamp,
  }
}

function parseFloodAlerts(payload: unknown): EnvironmentalReading {
  const root = asRecord(payload)
  const data = asRecord(root?.data)
  const record = asRecord(asRecordArray(data?.records)[0])
  const item = asRecord(record?.item)
  const readings = asRecordArray(item?.readings)
  const timestamp = nonEmptyString(record?.updatedTimestamp) ?? nonEmptyString(record?.datetime)

  if (root?.code !== 0 || !timestamp || !Array.isArray(item?.readings)) throw new Error('Flood alert data is unavailable')

  const count = readings.length
  return {
    status: 'ready',
    key: 'floods',
    title: 'Flood Alerts',
    value: String(count),
    unit: 'active alerts',
    context: count === 0 ? 'No active flood alerts' : `${count} active flood ${count === 1 ? 'alert' : 'alerts'}`,
    updatedAt: timestamp,
  }
}

function parseFeed(key: EnvironmentalFeedKey, payload: unknown) {
  switch (key) {
    case 'rainfall':
      return latestStationRange(payload, key, 'Rainfall', 'mm')
    case 'temperature':
      return latestStationRange(payload, key, 'Air Temperature', '°C')
    case 'humidity':
      return latestStationRange(payload, key, 'Relative Humidity', '%')
    case 'wbgt':
      return parseWbgt(payload)
    case 'pm25':
      return parsePm25(payload)
    case 'floods':
      return parseFloodAlerts(payload)
  }
}

export async function loadEnvironmentalConditions(
  signal?: AbortSignal,
  request: typeof fetch = fetch,
  pause: RetryPause = pauseForRetry,
): Promise<EnvironmentalFeedResult[]> {
  return Promise.all(environmentalFeedMeta.map(async ({ key, title, endpoint }) => {
    try {
      const hostname = typeof window === 'undefined' ? '' : window.location.hostname
      const requestEndpoint = resolveEnvironmentalEndpoint(hostname, import.meta.env.BASE_URL, key, endpoint)
      const payload = await requestEnvironmentalPayload(requestEndpoint, title, signal, request, pause)
      return parseFeed(key, payload)
    } catch (error) {
      if (signal?.aborted) throw error
      return { status: 'error', key, title } as const
    }
  }))
}
