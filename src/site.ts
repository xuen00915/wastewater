export type PageId = 'home' | 'services' | 'research' | 'projects' | 'collaborate' | 'career' | 'about'

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
    description: 'Research connecting wastewater treatment, resource recovery, water reuse and green infrastructure for more sustainable built environments.',
  },
  {
    id: 'services',
    label: 'Services',
    segment: 'services',
    title: 'Wastewater Treatment Services | Pilot Testing & Monitoring',
    description: 'Explore wastewater assessment, treatment development, resource recovery, pilot testing, monitoring and green-wall integration capabilities.',
  },
  {
    id: 'research',
    label: 'Research',
    segment: 'research',
    title: 'Wastewater & Resource Recovery Research',
    description: 'Explore connected research in liquid treatment, resource recovery, water reuse, monitoring and green infrastructure.',
  },
  {
    id: 'projects',
    label: 'Projects',
    segment: 'projects',
    title: 'Wastewater Research Projects & Pilot Studies',
    description: 'Explore project directions for pilot treatment systems, resource recovery studies and green-infrastructure pilots.',
  },
  {
    id: 'collaborate',
    label: 'Collaborate',
    segment: 'collaborate',
    title: 'Collaborate on Wastewater & Green Infrastructure Research',
    description: 'Explore collaboration opportunities for industry partners and research organisations working across water and green infrastructure.',
  },
  {
    id: 'career',
    label: 'Career',
    segment: 'career',
    title: 'Careers in Water & Environmental Research',
    description: 'Learn about potential future opportunities across water treatment, environmental monitoring and green infrastructure.',
  },
  {
    id: 'about',
    label: 'About Us',
    segment: 'about',
    title: 'About Us | Circular Water & Environmental Research',
    description: 'Learn about our connected approach to wastewater treatment, resource recovery, water reuse and green infrastructure research.',
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
