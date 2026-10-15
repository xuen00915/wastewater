import type { IconName } from '../components/ui/Icon'
import type { PageId } from '../site'

export type NavItem = { label: string; page: PageId }
export type ProcessStage = { number: string; title: string; description: string; icon: IconName }
export type ResearchArea = { title: string; description: string; link: string; icon: IconName; image: string; alt: string }
export type Benefit = { number: string; title: string; description: string }
export type Project = { title: string; description: string; type: string; status: string; image: string; alt: string }
export type CollaborationType = { title: string; description: string; icon: IconName }
export type ServiceCapability = { number: string; title: string; description: string; icon: IconName }
export type ResearchTheme = { number: string; title: string; description: string; icon: IconName }
export type CareerArea = { title: string; description: string; icon: IconName }
export type AboutPrinciple = { number: string; title: string; description: string; icon: IconName }
export type TreatmentStage = { id: string; number: string; title: string; summary: string; detail: string; icon: IconName; hotspot: { x: number; y: number } }

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

export const collaborationPathways: readonly CollaborationType[] = [
  { title: 'Industry Partners', description: 'Explore practical applications and industry challenges', icon: 'industry' },
  { title: 'Research Partners', description: 'Collaborate on research, testing and knowledge development', icon: 'flask' },
  { title: 'Pilot Sites', description: 'Explore opportunities for real-world trials and monitoring', icon: 'site' },
]

export const collaborationTypes = collaborationPathways

export const services: readonly ServiceCapability[] = [
  { number: '01', title: 'Liquid Treatment', description: 'Develop and evaluate approaches for wastewater treatment, water quality and treatment performance.', icon: 'water' },
  { number: '02', title: 'Solid Treatment', description: 'Study solids management and treatment as part of the wider water system.', icon: 'solids' },
  { number: '03', title: 'Pilot Testing', description: 'Translate research concepts into pilot-scale systems for structured evaluation.', icon: 'treatment' },
  { number: '04', title: 'Monitoring', description: 'Use measurements and observation to understand system behavior and guide learning.', icon: 'flask' },
  { number: '05', title: 'Resource Recovery', description: 'Explore useful resources within treated liquid and solid streams.', icon: 'recovery' },
  { number: '06', title: 'Green Integration', description: 'Connect treated outputs with planted systems and greener building environments.', icon: 'leaf' },
]

export const researchThemes: readonly ResearchTheme[] = [
  { number: '01', title: 'Water Quality', description: 'Study water characteristics, treatment requirements and indicators of treatment performance.', icon: 'water' },
  { number: '02', title: 'Treatment Processes', description: 'Develop and compare liquid and solids treatment approaches at research and pilot scale.', icon: 'treatment' },
  { number: '03', title: 'Resource Pathways', description: 'Investigate how treated streams may connect with recovery and responsible reuse.', icon: 'recovery' },
  { number: '04', title: 'Living Systems', description: 'Explore relationships between treated resources, planted systems and the built environment.', icon: 'leaf' },
  { number: '05', title: 'Monitoring & Learning', description: 'Use measurement to understand performance, refine questions and support continued research.', icon: 'flask' },
]

export const careerAreas: readonly CareerArea[] = [
  { title: 'Research', description: 'Investigating practical questions across water treatment, resource recovery and environmental systems.', icon: 'flask' },
  { title: 'Pilot Systems', description: 'Supporting the design, operation and learning around pilot-scale treatment installations.', icon: 'treatment' },
  { title: 'Monitoring', description: 'Collecting and interpreting measurements that help research teams understand system performance.', icon: 'water' },
  { title: 'Green Infrastructure', description: 'Connecting planted systems, water research and sustainable building applications.', icon: 'leaf' },
]

export const aboutPrinciples: readonly AboutPrinciple[] = [
  { number: '01', title: 'Research Led', description: 'Start with clear questions, relevant evidence and methods suited to the treatment context.', icon: 'flask' },
  { number: '02', title: 'System Connected', description: 'Consider liquid treatment, solids, resource recovery and living systems as related parts of one pathway.', icon: 'recovery' },
  { number: '03', title: 'Pilot Informed', description: 'Use pilot-scale testing and observation to explore how research concepts behave in practical settings.', icon: 'treatment' },
  { number: '04', title: 'Open to Collaboration', description: 'Work with research, industry and pilot-site partners around shared environmental questions.', icon: 'industry' },
]

export const treatmentStages: readonly TreatmentStage[] = [
  { id: 'influent', number: '01', title: 'Influent', summary: 'Understand the incoming wastewater', detail: 'The pathway begins by characterising incoming wastewater and defining the treatment questions for the research or pilot context.', icon: 'water', hotspot: { x: 9, y: 34 } },
  { id: 'screening', number: '02', title: 'Screening & settling', summary: 'Remove larger material and balance flow', detail: 'Preliminary stages can separate larger solids and create a more consistent stream for the treatment steps that follow.', icon: 'solids', hotspot: { x: 25, y: 39 } },
  { id: 'biological', number: '03', title: 'Biological treatment', summary: 'Study treatment within active tanks', detail: 'Biological treatment approaches can be evaluated to understand how the water responds under controlled research conditions.', icon: 'treatment', hotspot: { x: 48, y: 42 } },
  { id: 'separation', number: '04', title: 'Separation & monitoring', summary: 'Separate streams and observe performance', detail: 'Liquid and solid streams are separated while measurements and observations help researchers understand system performance.', icon: 'flask', hotspot: { x: 66, y: 29 } },
  { id: 'recovery', number: '05', title: 'Resource recovery', summary: 'Explore value within treated streams', detail: 'Research can explore whether useful resources within treated liquid or solid streams are suitable for further study.', icon: 'recovery', hotspot: { x: 72, y: 67 } },
  { id: 'reuse', number: '06', title: 'Reuse & green wall', summary: 'Connect treated outputs with living systems', detail: 'Treated outputs can be studied in relation to reuse, planted systems and greener building applications.', icon: 'leaf', hotspot: { x: 91, y: 45 } },
]

export const footerGroups = [
  { title: 'Explore', links: [...navItems.slice(0, 4), { label: 'About Us', page: 'about' as const }] },
  { title: 'Connect', links: navItems.filter(({ page }) => page === 'collaborate' || page === 'career') },
  { title: 'Research Areas', links: researchAreas.map((area) => ({ label: area.title, page: 'research' as const })) },
] as const
