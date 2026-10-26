import { describe, expect, it } from 'vitest'
import {
  defaultResearchChapterId,
  isResearchChapterId,
  researchChapters,
} from './researchProgramme'

describe('research programme content', () => {
  it('keeps the three public research programmes in their approved order', () => {
    expect(researchChapters.map(({ id, title }) => ({ id, title }))).toEqual([
      { id: 'liquid-treatment', title: 'Liquid Treatment' },
      { id: 'solid-treatment', title: 'Solid Treatment & Resource Recovery' },
      { id: 'living-walls', title: 'Living Walls & Green Infrastructure' },
    ])
    expect(defaultResearchChapterId).toBe('liquid-treatment')
  })

  it('recognises only supported deep-link fragments', () => {
    expect(isResearchChapterId('liquid-treatment')).toBe(true)
    expect(isResearchChapterId('solid-treatment')).toBe(true)
    expect(isResearchChapterId('living-walls')).toBe(true)
    expect(isResearchChapterId('unknown')).toBe(false)
    expect(isResearchChapterId('')).toBe(false)
  })

  it('provides complete pathways, evidence and public sources for every programme', () => {
    researchChapters.forEach((chapter) => {
      expect(chapter.pathway).toHaveLength(4)
      expect(chapter.questions.length).toBeGreaterThan(0)
      expect(chapter.evidence.length).toBeGreaterThan(0)
      expect(chapter.sources.length).toBeGreaterThan(0)
      expect(chapter.image).toMatch(/\/images\/research-.+\.webp$/)
      chapter.sources.forEach((source) => expect(new URL(source.url).protocol).toBe('https:'))
    })
  })

  it('keeps unpublished details and unsupported outcome claims out of public copy', () => {
    const publicCopy = JSON.stringify(researchChapters)

    expect(publicCopy).not.toMatch(/ISO certified/i)
    expect(publicCopy).not.toMatch(/Class A achieved/i)
    expect(publicCopy).not.toMatch(/>\s*10/i)
    expect(publicCopy).not.toMatch(/OQE Aug 26/i)
    expect(publicCopy).not.toMatch(/A0214209N/i)
    expect(publicCopy).not.toMatch(/supervisor/i)
  })
})
