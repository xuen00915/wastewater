import { describe, expect, it } from 'vitest'
import contentSectionStyles from './content-sections.css?raw'
import pageSectionStyles from './page-sections.css?raw'
import researchScrollStoryStyles from './research-scroll-story.css?raw'
import treatmentPathwayStyles from './treatment-pathway.css?raw'

describe('presentation style safeguards', () => {
  it('does not animate layout properties when the PSI panel changes state', () => {
    const psiWidgetRule = contentSectionStyles.match(/\.psi-widget\s*{[^}]*}/)?.[0] ?? ''
    expect(psiWidgetRule).not.toMatch(/transition:[^;}]*\b(?:width|height|padding|margin)\b/)
  })

  it('keeps information cards visually stable on hover', () => {
    expect(pageSectionStyles).not.toMatch(/\.info-card:hover/)
  })

  it('keeps the treatment heading on one desktop line and restores responsive wrapping', () => {
    expect(treatmentPathwayStyles).toMatch(
      /\.treatment-pathway__intro\s*{[^}]*max-width:\s*none/,
    )
    expect(treatmentPathwayStyles).toMatch(
      /\.treatment-pathway__intro h2\s*{[^}]*white-space:\s*nowrap/,
    )
    expect(treatmentPathwayStyles).toMatch(
      /@media\s*\(max-width:\s*1100px\)[\s\S]*?\.treatment-pathway__intro h2\s*{[^}]*white-space:\s*normal/,
    )
  })

  it('keeps the research overview in one row and the detailed story in two columns', () => {
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__overview\s*{[^}]*grid-template-columns:\s*repeat\(3,/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__detail\s*{[^}]*grid-template-columns:\s*minmax\(/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__index\s*{[^}]*position:\s*sticky/,
    )
  })

  it('uses typography and opacity for the active research title without side accents', () => {
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__index-link\s*{[^}]*opacity:\s*\.4/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__index-link--active\s*{[^}]*opacity:\s*1/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__index-link--active[^}]*font-size:\s*clamp\(/,
    )
    expect(researchScrollStoryStyles).not.toMatch(/border-(?:left|right):/)
  })

  it('adds restrained chapter zoom and a mobile native-scroll fallback', () => {
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__chapter\s*{[^}]*opacity:\s*\.6[^}]*transform:\s*scale\(\.965\)/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__chapter--active\s*{[^}]*opacity:\s*1[^}]*transform:\s*scale\(1\)/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__chapter\s*{[^}]*scroll-margin-top:/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /@media\s*\(max-width:\s*760px\)[\s\S]*?\.research-story__overview\s*{[^}]*overflow-x:\s*auto[^}]*flex-wrap:\s*nowrap/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /@media\s*\(max-width:\s*760px\)[\s\S]*?\.research-story__detail\s*{[^}]*grid-template-columns:\s*1fr/,
    )
  })

  it('keeps pathway cards compact and chapter media at bounded responsive heights', () => {
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__pathway li\s*{[^}]*min-height:\s*0/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__pathway li strong\s*{[^}]*margin-top:\s*18px/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /\.research-story__chapter-header\s*>\s*\.media\s*{[^}]*height:\s*440px[^}]*min-height:\s*0/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /@media\s*\(max-width:\s*1080px\)[\s\S]*?\.research-story__chapter-header\s*>\s*\.media\s*{[^}]*height:\s*clamp\(260px,\s*32vw,\s*320px\)/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /@media\s*\(max-width:\s*760px\)[\s\S]*?\.research-story__chapter-header\s*>\s*\.media\s*{[^}]*height:\s*240px/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /@media\s*\(max-width:\s*420px\)[\s\S]*?\.research-story__chapter-header\s*>\s*\.media\s*{[^}]*height:\s*210px/,
    )
  })

  it('removes scroll and zoom motion when reduced motion is preferred', () => {
    expect(researchScrollStoryStyles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?scroll-behavior:\s*auto/,
    )
    expect(researchScrollStoryStyles).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.research-story__chapter\s*{[^}]*opacity:\s*1[^}]*transform:\s*none[^}]*transition:\s*none/,
    )
  })
})
