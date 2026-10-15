import { pageHref, resolvePageId, sitePages } from './site'

describe('site page routing', () => {
  it('resolves_all_six_local_and_production_paths', () => {
    expect(resolvePageId('/')).toBe('home')
    expect(resolvePageId('/services/')).toBe('services')
    expect(resolvePageId('/research')).toBe('research')
    expect(resolvePageId('/projects/')).toBe('projects')
    expect(resolvePageId('/collaborate/')).toBe('collaborate')
    expect(resolvePageId('/career/')).toBe('career')
    expect(resolvePageId('/wastewater/', '/wastewater/')).toBe('home')
    expect(resolvePageId('/wastewater/services/', '/wastewater/')).toBe('services')
  })

  it('falls_back_to_home_for_unknown_paths', () => {
    expect(resolvePageId('/unknown/')).toBe('home')
    expect(resolvePageId('/wastewater/unknown/', '/wastewater/')).toBe('home')
  })

  it('builds_base_aware_page_links', () => {
    expect(pageHref('home', '/')).toBe('/')
    expect(pageHref('services', '/')).toBe('/services/')
    expect(pageHref('home', '/wastewater/')).toBe('/wastewater/')
    expect(pageHref('services', '/wastewater/')).toBe('/wastewater/services/')
    expect(pageHref('research', '/wastewater')).toBe('/wastewater/research/')
    expect(pageHref('projects', '/wastewater/wastewater/')).toBe('/wastewater/projects/')
    expect(sitePages).toHaveLength(6)
  })
})
