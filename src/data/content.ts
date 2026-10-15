import type { IconName } from '../components/ui/Icon'
import type { PageId } from '../site'

export type NavItem = { label: string; page: PageId }
export type ProcessStage = { number: string; title: string; description: string; icon: IconName }
export type ResearchArea = { title: string; description: string; link: string; icon: IconName; image: string; alt: string }
export type Benefit = { number: string; title: string; description: string }
export type Project = { title: string; description: string; type: string; status: string; image: string; alt: string }
export type CollaborationType = { title: string; description: string; icon: IconName }

const imagePath = (filename: string) => `${import.meta.env.BASE_URL}images/${filename}`

export const navItems: readonly NavItem[] = [
  { label: 'Home', page: 'home' },
  { label: 'Services', page: 'services' },
  { label: 'Research', page: 'research' },
  { label: 'Projects', page: 'projects' },
  { label: 'Collaborate', page: 'collaborate' },
  { label: 'Career', page: 'career' },
]

export const processStages: readonly ProcessStage[] = [
  { number: '01', title: 'Wastewater', description: 'Understanding water characteristics and treatment requirements', icon: 'water' },
  { number: '02', title: 'Treatment', description: 'Developing and evaluating liquid and solid treatment approaches', icon: 'treatment' },
  { number: '03', title: 'Resource Recovery', description: 'Investigating useful resources within treated streams', icon: 'recovery' },
  { number: '04', title: 'Green Wall', description: 'Connecting recovered water and resources with planted systems', icon: 'leaf' },
  { number: '05', title: 'Greener Building', description: 'Exploring integration within sustainable built environments', icon: 'building' },
]

export const researchAreas: readonly ResearchArea[] = [
  {
    title: 'Liquid Treatment',
    description: 'Research into wastewater treatment processes, water quality and treatment performance.',
    link: 'Explore Liquid Treatment',
    icon: 'water', image: imagePath('research-liquid-treatment.webp'),
    alt: 'Representative wastewater treatment and water-quality research',
  },
  {
    title: 'Solid Treatment',
    description: 'Research into solids management, treatment and opportunities for resource recovery.',
    link: 'Explore Solid Treatment',
    icon: 'solids', image: imagePath('research-solid-treatment.webp'),
    alt: 'Representative solids and materials treatment research',
  },
  {
    title: 'Green Wall',
    description: 'Research into the integration of recovered resources with planted vertical systems and building environments.',
    link: 'Explore Green Wall',
    icon: 'leaf', image: imagePath('research-green-wall.webp'),
    alt: 'Representative green wall integrated into architecture',
  },
]

export const benefits: readonly Benefit[] = [
  { number: '01', title: 'Circular Resource Thinking', description: 'Explore ways to move from disposal-focused systems toward recovery and reuse.' },
  { number: '02', title: 'Integrated Research', description: 'Connect water, solids and green infrastructure instead of treating them as isolated subjects.' },
  { number: '03', title: 'Pilot Testing', description: 'Evaluate concepts through pilot-scale systems and real-world applications.' },
  { number: '04', title: 'Monitoring & Learning', description: 'Use measurements and monitoring to understand system performance and support continued research.' },
]

export const projects: readonly Project[] = [
  { title: 'Pilot Treatment Project', description: 'A replaceable project entry for future pilot treatment research and testing.', type: 'Pilot Research', status: 'Research', image: imagePath('project-pilot-treatment.webp'), alt: 'Representative pilot treatment research system' },
  { title: 'Resource Recovery Study', description: 'A replaceable project entry for future resource recovery research.', type: 'Research Study', status: 'Testing', image: imagePath('project-resource-recovery.webp'), alt: 'Representative resource recovery research materials' },
  { title: 'Green-Wall Integration Pilot', description: 'A replaceable project entry for future green-wall integration research.', type: 'Pilot Research', status: 'Research', image: imagePath('project-green-wall.webp'), alt: 'Representative green-wall pilot installation' },
]

export const collaborationTypes: readonly CollaborationType[] = [
  { title: 'Industry Partners', description: 'Explore practical applications and industry challenges', icon: 'industry' },
  { title: 'Research Partners', description: 'Collaborate on research, testing and knowledge development', icon: 'flask' },
  { title: 'Pilot Sites', description: 'Explore opportunities for real-world trials and monitoring', icon: 'site' },
]

export const footerGroups = [
  { title: 'Explore', links: navItems.slice(0, 4) },
  { title: 'Connect', links: navItems.filter(({ page }) => page === 'collaborate' || page === 'career') },
  { title: 'Research Areas', links: researchAreas.map((area) => ({ label: area.title, page: 'research' as const })) },
] as const
