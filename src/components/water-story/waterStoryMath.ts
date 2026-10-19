export type WaterStoryValues = {
  progress: number
  portalProgress: number
  portalScale: number
  copyOpacity: number
  immersionProgress: number
  exitProgress: number
  waterlinePercent: number
  imageScale: number
}

type Point = readonly [x: number, y: number]

const INITIAL_PORTAL_POINTS: readonly Point[] = [
  [112, 92], [196, 34], [326, 42], [414, 58],
  [526, 18], [690, 42], [768, 86], [876, 146],
  [914, 246], [888, 350], [916, 458], [852, 574],
  [754, 618], [646, 666], [512, 646], [424, 628],
  [312, 660], [180, 610], [116, 532], [46, 446],
  [58, 326], [82, 248], [54, 186], [70, 126], [112, 92],
]

const WIDE_PORTAL_POINTS: readonly Point[] = [
  [24, 54], [124, 18], [258, 24], [366, 34],
  [512, 8], [704, 18], [838, 46], [944, 76],
  [990, 156], [986, 248], [996, 380], [978, 510],
  [930, 594], [808, 660], [648, 674], [498, 654],
  [342, 676], [164, 650], [58, 590], [8, 488],
  [2, 360], [14, 248], [4, 154], [8, 92], [24, 54],
]

const FULL_FRAME_POINTS: readonly Point[] = [
  [0, 0], [0, 0], [250, 0], [500, 0],
  [750, 0], [1000, 0], [1000, 0], [1000, 175],
  [1000, 350], [1000, 350], [1000, 525], [1000, 700],
  [1000, 700], [750, 700], [500, 700], [500, 700],
  [250, 700], [0, 700], [0, 700], [0, 525],
  [0, 350], [0, 350], [0, 175], [0, 0], [0, 0],
]

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function rangeProgress(value: number, start: number, end: number) {
  return clamp01((value - start) / (end - start))
}

function interpolate(value: number, from: number, to: number) {
  return from + (to - from) * value
}

function interpolateStops(progress: number, stops: readonly Point[]) {
  const clamped = clamp01(progress)

  for (let index = 1; index < stops.length; index += 1) {
    const [endProgress, endValue] = stops[index]
    const [startProgress, startValue] = stops[index - 1]

    if (clamped <= endProgress) {
      return interpolate(
        rangeProgress(clamped, startProgress, endProgress),
        startValue,
        endValue,
      )
    }
  }

  return stops.at(-1)?.[1] ?? 0
}

export function deriveWaterStoryValues(rawProgress: number): WaterStoryValues {
  const progress = clamp01(rawProgress)
  const exitProgress = rangeProgress(progress, 0.8, 1)

  return {
    progress,
    portalProgress: rangeProgress(progress, 0.15, 0.6),
    portalScale: interpolateStops(progress, [
      [0, 1],
      [0.15, 1],
      [0.2, 1.04],
      [0.28, 1.09],
      [0.34, 1.15],
      [0.4, 1.22],
      [1, 1.22],
    ]),
    copyOpacity: 1 - rangeProgress(progress, 0.25, 0.6),
    immersionProgress: rangeProgress(progress, 0.6, 0.8),
    exitProgress,
    waterlinePercent: interpolate(exitProgress, 60, 23),
    imageScale: interpolate(rangeProgress(progress, 0.4, 0.8), 1, 1.06),
  }
}

function formatCoordinate(value: number) {
  return Number(value.toFixed(2)).toString()
}

function serializePath(points: readonly Point[]) {
  const [start, ...curvePoints] = points
  let path = `M ${formatCoordinate(start[0])} ${formatCoordinate(start[1])}`

  for (let index = 0; index < curvePoints.length; index += 3) {
    const [first, second, end] = curvePoints.slice(index, index + 3)
    path += ` C ${formatCoordinate(first[0])} ${formatCoordinate(first[1])}`
    path += ` ${formatCoordinate(second[0])} ${formatCoordinate(second[1])}`
    path += ` ${formatCoordinate(end[0])} ${formatCoordinate(end[1])}`
  }

  return `${path} Z`
}

function interpolatePoints(from: readonly Point[], to: readonly Point[], progress: number) {
  return from.map(([fromX, fromY], index) => {
    const [toX, toY] = to[index]
    return [
      interpolate(progress, fromX, toX),
      interpolate(progress, fromY, toY),
    ] as const
  })
}

export function interpolatePortalPath(rawProgress: number) {
  const progress = clamp01(rawProgress)

  if (progress <= 0.45) {
    return serializePath(interpolatePoints(
      INITIAL_PORTAL_POINTS,
      WIDE_PORTAL_POINTS,
      rangeProgress(progress, 0.15, 0.45),
    ))
  }

  return serializePath(interpolatePoints(
    WIDE_PORTAL_POINTS,
    FULL_FRAME_POINTS,
    rangeProgress(progress, 0.45, 0.65),
  ))
}
