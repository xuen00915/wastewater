import { describe, expect, it } from 'vitest'
import { bubbleSettings, deriveDeepDiveValues } from './deepDiveMath'

describe('deriveDeepDiveValues', () => {
  it('keeps the decoration hidden before the dive begins', () => {
    expect(deriveDeepDiveValues(0)).toMatchObject({
      progress: 0,
      tint: 0,
      rays: 0,
      bubbles: 0,
      rayShift: 0,
    })
  })

  it('matches the approved strengths and bubble travel at mid-scroll', () => {
    const values = deriveDeepDiveValues(0.5)

    expect(values).toMatchObject({
      progress: 0.5,
      tint: 0.726,
      rays: 0.658,
      bubbles: 0.776,
      rayShift: -22,
      bubbleScale: 1.12,
    })
    expect(values.bubbleY[0]).toBe(-54.6)
    expect(new Set(values.bubbleY).size).toBeGreaterThan(7)
  })

  it('fades the decoration away at the end while preserving reversible positions', () => {
    const values = deriveDeepDiveValues(1)

    expect(values.tint).toBe(0)
    expect(values.rays).toBe(0)
    expect(values.bubbles).toBe(0)
    expect(values.rayShift).toBe(-44)
    expect(values.bubbleScale).toBe(1.24)
    expect(values.bubbleY[0]).toBe(-109.2)
  })

  it('clamps out-of-range scroll values and defines fourteen bubbles', () => {
    expect(deriveDeepDiveValues(-2)).toEqual(deriveDeepDiveValues(0))
    expect(deriveDeepDiveValues(3)).toEqual(deriveDeepDiveValues(1))
    expect(bubbleSettings).toHaveLength(14)
  })
})
