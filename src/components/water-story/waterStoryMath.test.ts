import { describe, expect, it } from 'vitest'
import {
  clamp01,
  deriveWaterStoryValues,
  interpolatePortalPath,
} from './waterStoryMath'

const INITIAL_PORTAL_PATH =
  'M 112 92 C 196 34 326 42 414 58 C 526 18 690 42 768 86 C 876 146 914 246 888 350 C 916 458 852 574 754 618 C 646 666 512 646 424 628 C 312 660 180 610 116 532 C 46 446 58 326 82 248 C 54 186 70 126 112 92 Z'

const WIDE_PORTAL_PATH =
  'M 24 54 C 124 18 258 24 366 34 C 512 8 704 18 838 46 C 944 76 990 156 986 248 C 996 380 978 510 930 594 C 808 660 648 674 498 654 C 342 676 164 650 58 590 C 8 488 2 360 14 248 C 4 154 8 92 24 54 Z'

const FULL_FRAME_PATH =
  'M 0 0 C 0 0 250 0 500 0 C 750 0 1000 0 1000 0 C 1000 175 1000 350 1000 350 C 1000 525 1000 700 1000 700 C 750 700 500 700 500 700 C 250 700 0 700 0 700 C 0 525 0 350 0 350 C 0 175 0 0 0 0 Z'

describe('water story interpolation', () => {
  it('clamps story progress to zero and one', () => {
    expect(clamp01(-0.2)).toBe(0)
    expect(clamp01(0.48)).toBe(0.48)
    expect(clamp01(1.4)).toBe(1)
    expect(deriveWaterStoryValues(-1).progress).toBe(0)
    expect(deriveWaterStoryValues(2).progress).toBe(1)
  })

  it('keeps the initial portal stable through the opening beat', () => {
    const initial = deriveWaterStoryValues(0)
    const openingBeat = deriveWaterStoryValues(0.15)

    expect(initial.portalProgress).toBe(0)
    expect(openingBeat.portalProgress).toBe(0)
    expect(initial.portalScale).toBe(1)
    expect(openingBeat.portalScale).toBe(1)
    expect(initial.copyOpacity).toBe(1)
  })

  it('reaches the specified expansion and immersion values at stage boundaries', () => {
    const scaleCases = [
      [0, 1],
      [0.2, 1.04],
      [0.28, 1.09],
      [0.34, 1.15],
      [0.4, 1.22],
    ] as const

    scaleCases.forEach(([progress, scale]) => {
      expect(deriveWaterStoryValues(progress).portalScale).toBeCloseTo(scale, 2)
    })

    expect(deriveWaterStoryValues(0.6).copyOpacity).toBeLessThanOrEqual(0.01)
    expect(deriveWaterStoryValues(0.6).immersionProgress).toBe(0)
    expect(deriveWaterStoryValues(0.8).immersionProgress).toBe(1)
    expect(deriveWaterStoryValues(0.8).exitProgress).toBe(0)
    expect(deriveWaterStoryValues(1).exitProgress).toBe(1)

    for (let step = 0; step <= 10; step += 1) {
      expect(deriveWaterStoryValues(step / 10).imageScale).toBeLessThanOrEqual(1.06)
    }
  })

  it('moves the waterline from 60 to 23 percent during exit', () => {
    expect(deriveWaterStoryValues(0.6).waterlinePercent).toBe(60)
    expect(deriveWaterStoryValues(0.8).waterlinePercent).toBe(60)
    expect(deriveWaterStoryValues(0.9).waterlinePercent).toBeCloseTo(41.5, 1)
    expect(deriveWaterStoryValues(1).waterlinePercent).toBe(23)
  })

  it('returns the initial organic path, a wide midpoint, and a full-frame final path', () => {
    expect(interpolatePortalPath(0)).toBe(INITIAL_PORTAL_PATH)
    expect(interpolatePortalPath(0.45)).toBe(WIDE_PORTAL_PATH)
    expect(interpolatePortalPath(0.65)).toBe(FULL_FRAME_PATH)
    expect(interpolatePortalPath(1)).toBe(FULL_FRAME_PATH)
  })
})
