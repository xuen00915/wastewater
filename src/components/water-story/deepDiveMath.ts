export type BubbleSetting = readonly [
  xPercent: number,
  yPercent: number,
  diameter: number,
  travelCoefficient: number,
]

export type DeepDiveValues = {
  progress: number
  tint: number
  rays: number
  bubbles: number
  rayShift: number
  bubbleScale: number
  bubbleY: number[]
}

export const bubbleSettings: readonly BubbleSetting[] = [
  [12, 84, 8, 1.15], [19, 69, 5, 0.85], [28, 93, 9, 1.42],
  [37, 78, 4, 1.12], [44, 88, 7, 0.75], [55, 72, 5, 1.5],
  [61, 94, 11, 0.8], [67, 82, 5, 1.25], [73, 67, 7, 1.12],
  [80, 89, 9, 0.95], [86, 74, 4, 1.57], [91, 96, 6, 1.19],
  [49, 61, 3, 0.9], [31, 56, 5, 1.38],
]

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function smoothStep(start: number, end: number, value: number) {
  const progress = clamp01((value - start) / (end - start))
  return progress * progress * (3 - 2 * progress)
}

function round(value: number, precision: number) {
  return Number(value.toFixed(precision))
}

export function deriveDeepDiveValues(rawProgress: number): DeepDiveValues {
  const progress = clamp01(rawProgress)
  const entering = smoothStep(0.08, 0.64, progress)
  const leaving = 1 - smoothStep(0.78, 1, progress)
  const intensity = entering * leaving
  const bubbleScale = round(1 + progress * 0.24, 3)

  return {
    progress,
    tint: round(intensity * 0.86, 3),
    rays: round(intensity * 0.78, 3),
    bubbles: round(intensity * 0.92, 3),
    rayShift: round(-progress * 44, 1),
    bubbleScale,
    bubbleY: bubbleSettings.map(([, , , travelCoefficient], index) => {
      const travel = (95 + (index % 4) * 52) * travelCoefficient
      return round(-progress * travel, 1)
    }),
  }
}
