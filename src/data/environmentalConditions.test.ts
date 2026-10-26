import { loadEnvironmentalConditions, resolveEnvironmentalEndpoint } from './environmentalConditions'

const stationPayload = (readingUnit: string, timestamp: string, values: number[]) => ({
  code: 0,
  errorMsg: '',
  data: {
    readingType: 'Official reading',
    readingUnit,
    stations: values.map((_, index) => ({
      id: `S${index + 1}`,
      deviceId: `S${index + 1}`,
      name: `Station ${index + 1}`,
      location: { latitude: 1.3 + index / 100, longitude: 103.8 + index / 100 },
    })),
    readings: [{
      timestamp,
      data: values.map((value, index) => ({ stationId: `S${index + 1}`, value })),
    }],
  },
})

const payloads = {
  rainfall: stationPayload('mm', '2026-10-21T09:55:00+08:00', [0, 4.6]),
  'air-temperature': stationPayload('deg C', '2026-10-21T09:58:00+08:00', [27.8, 31.2]),
  'relative-humidity': stationPayload('percentage', '2026-10-21T09:58:00+08:00', [66, 89]),
  pm25: {
    code: 0,
    errorMsg: '',
    data: {
      regionMetadata: [
        { name: 'north', labelLocation: { latitude: 1.41803, longitude: 103.82 } },
        { name: 'west', labelLocation: { latitude: 1.35735, longitude: 103.7 } },
      ],
      items: [{
        date: '2026-10-21',
        updatedTimestamp: '2026-10-21T10:00:55+08:00',
        timestamp: '2026-10-21T10:00:00+08:00',
        readings: { pm25_one_hourly: { north: 23, west: 42 } },
      }],
    },
  },
  wbgt: {
    code: 0,
    errorMsg: '',
    data: {
      records: [{
        datetime: '2026-10-21T09:45:00+08:00',
        item: {
          type: 'observation',
          isStationData: true,
          readings: [
            {
              station: { id: 'S128', name: 'Bishan Street', townCenter: 'Bishan Stadium' },
              location: { latitude: '1.354825', longitude: '103.852219' },
              wbgt: '29.0',
              heatStress: 'Low',
            },
            {
              station: { id: 'S147', name: 'Marina Barrage', townCenter: 'Marina Barrage' },
              location: { latitude: '1.280001', longitude: '103.8697302' },
              wbgt: '31.4',
              heatStress: 'Moderate',
            },
          ],
        },
        updatedTimestamp: '2026-10-21T09:55:03+08:00',
      }],
    },
  },
  'flood-alerts': {
    code: 0,
    errorMsg: '',
    data: {
      paginationToken: 'offset=25',
      records: [{
        datetime: '2026-10-21T10:02:54+08:00',
        item: { type: 'observation', readings: [], isStationData: false },
        updatedTimestamp: '2026-10-21T10:05:41+08:00',
      }],
    },
  },
} as const

function successfulFetcher(url: string | URL | Request) {
  const href = String(url)
  const key = href.includes('api=wbgt')
    ? 'wbgt'
    : href.split('/').at(-1) as keyof typeof payloads
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(payloads[key]),
  } as Response)
}

describe('official environmental condition feeds', () => {
  it('uses the same-origin environmental proxy on eastenv.com while keeping direct feeds for local development', () => {
    const directEndpoint = 'https://api-open.data.gov.sg/v2/real-time/api/rainfall'

    expect(resolveEnvironmentalEndpoint('eastenv.com', '/staging/', 'rainfall', directEndpoint))
      .toBe('/staging/api/environmental.php?feed=rainfall')
    expect(resolveEnvironmentalEndpoint('www.eastenv.com', '/', 'rainfall', directEndpoint))
      .toBe('/api/environmental.php?feed=rainfall')
    expect(resolveEnvironmentalEndpoint('127.0.0.1', '/', 'rainfall', directEndpoint))
      .toBe(directEndpoint)
  })

  it('turns official station, regional and alert payloads into labelled Singapore overview readings', async () => {
    const results = await loadEnvironmentalConditions(undefined, successfulFetcher as typeof fetch)

    expect(results).toEqual([
      expect.objectContaining({ status: 'ready', key: 'rainfall', value: '0–4.6', unit: 'mm', context: 'Across 2 reporting stations' }),
      expect.objectContaining({ status: 'ready', key: 'temperature', value: '27.8–31.2', unit: '°C', context: 'Across 2 reporting stations' }),
      expect.objectContaining({ status: 'ready', key: 'humidity', value: '66–89', unit: '%', context: 'Across 2 reporting stations' }),
      expect.objectContaining({ status: 'ready', key: 'wbgt', value: '31.4', unit: '°C', context: 'Moderate heat stress · Marina Barrage' }),
      expect.objectContaining({ status: 'ready', key: 'pm25', value: '42', unit: 'µg/m³', context: 'Highest regional reading · West' }),
      expect.objectContaining({ status: 'ready', key: 'floods', value: '0', unit: 'active alerts', context: 'No active flood alerts' }),
    ])
  })

  it('keeps one failed official feed from hiding the other readings', async () => {
    const fetcher = (url: string | URL | Request) => {
      if (String(url).includes('relative-humidity')) return Promise.resolve({ ok: false, status: 503 } as Response)
      return successfulFetcher(url)
    }

    const results = await loadEnvironmentalConditions(undefined, fetcher as typeof fetch, async () => {})

    expect(results.find((result) => result.key === 'humidity')).toEqual({
      status: 'error',
      key: 'humidity',
      title: 'Relative Humidity',
    })
    expect(results.filter((result) => result.status === 'ready')).toHaveLength(5)
  })

  it('retries a transient official-feed failure before showing the unavailable state', async () => {
    let rainfallAttempts = 0
    const fetcher = (url: string | URL | Request) => {
      if (String(url).endsWith('/rainfall') && rainfallAttempts++ === 0) {
        return Promise.resolve({ ok: false, status: 429 } as Response)
      }
      return successfulFetcher(url)
    }

    const results = await loadEnvironmentalConditions(undefined, fetcher as typeof fetch, async () => {})

    expect(rainfallAttempts).toBe(2)
    expect(results.find((result) => result.key === 'rainfall')).toEqual(
      expect.objectContaining({ status: 'ready', value: '0–4.6' }),
    )
  })
})
