export type PageId = 'home' | 'services' | 'research' | 'projects' | 'collaborate' | 'career'

export type SitePage = {
  id: PageId
  label: string
  segment: string
  title: string
  description: string
}

export const sitePages: readonly SitePage[] = [
  {
    id: 'home',
    label: 'Home',
    segment: '',
    title: 'Wastewater Treatment | Research for Greener Buildings',
    description: 'Wastewater treatment, resource recovery and green infrastructure research for more sustainable built environments.',
  },
  {
    id: 'services',
    label: 'Services',
    segment: 'services',
    title: 'Wastewater Treatment Services | Pilot Testing & Monitoring',
    description: 'Explore wastewater treatment, pilot testing, monitoring, resource recovery and green-wall integration capabilities.',
  },
  {
    id: 'research',
    label: 'Research',
    segment: 'research',
    title: 'Wastewater & Resource Recovery Research',
    description: 'Explore connected research in liquid treatment, solids, resource recovery, monitoring and green-wall systems.',
  },
  {
    id: 'projects',
    label: 'Projects',
    segment: 'projects',
    title: 'Wastewater Research Projects & Pilot Studies',
    description: 'Discover representative pilot treatment, resource recovery and green-wall integration research projects.',
  },
  {
    id: 'collaborate',
    label: 'Collaborate',
    segment: 'collaborate',
    title: 'Collaborate on Wastewater & Green Infrastructure Research',
    description: 'Explore collaboration pathways for industry partners, research organisations and pilot-site partners.',
  },
  {
    id: 'career',
    label: 'Career',
    segment: 'career',
    title: 'Careers in Water & Environmental Research',
    description: 'Learn about future opportunities in wastewater research, pilot systems, monitoring and green infrastructure.',
  },
]

const pageById = new Map(sitePages.map((page) => [page.id, page]))
const pageBySegment = new Map(sitePages.filter((page) => page.segment).map((page) => [page.segment, page.id]))

function normalizeBase(base: string) {
  const segments = base.split('/').filter(Boolean)
  const deduplicated = segments.filter((segment, index) => segment !== segments[index - 1])
  return deduplicated.length ? `/${deduplicated.join('/')}/` : '/'
}

export function resolvePageId(pathname: string, base = import.meta.env.BASE_URL): PageId {
  const normalizedBase = normalizeBase(base)
  const normalizedPath = `/${pathname.split('?')[0].split('#')[0].split('/').filter(Boolean).join('/')}/`
  const relativePath = normalizedBase !== '/' && normalizedPath.startsWith(normalizedBase)
    ? normalizedPath.slice(normalizedBase.length)
    : normalizedPath.slice(1)
  const segment = relativePath.split('/').filter(Boolean)[0] ?? ''
  return pageBySegment.get(segment) ?? 'home'
}

export function pageHref(pageId: PageId, base = import.meta.env.BASE_URL) {
  const page = pageById.get(pageId)
  const normalizedBase = normalizeBase(base)
  if (!page || !page.segment) return normalizedBase
  return `${normalizedBase}${page.segment}/`
}
