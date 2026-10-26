import type { IconName } from '../components/ui/Icon'
import type { PageId } from '../site'
import type { ResearchChapterId } from './researchProgramme'

export type NavItem = { label: string; page: PageId }
export type ProcessStage = { number: string; title: string; description: string; icon: IconName }
export type ResearchArea = { id: ResearchChapterId; title: string; description: string; link: string; icon: IconName; image: string; alt: string }
export type Benefit = { number: string; title: string; description: string }
export type Project = { title: string; description: string; type: string; status: string; image: string; alt: string }
export type CollaborationType = { title: string; description: string; icon: IconName }
export type CollaborationPartner = { mark: string; name: string }
export type CollaborationPartnerGroup = { title: string; description: string; icon: IconName; direction: 'forward' | 'reverse'; partners: readonly CollaborationPartner[] }
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
  { number: '01', title: 'Wastewater', description: 'Understanding the water and resources entering the system.', icon: 'water' },
  { number: '02', title: 'Treatment', description: 'Exploring biological, filtration and disinfection approaches.', icon: 'treatment' },
  { number: '03', title: 'Water & Resource Recovery', description: 'Investigating opportunities to recover useful resources from treatment processes.', icon: 'recovery' },
  { number: '04', title: 'Reuse', description: 'Exploring suitable applications for treated water and recovered materials.', icon: 'water' },
  { number: '05', title: 'Green Infrastructure', description: 'Connecting recovered resources with living walls and planted systems.', icon: 'leaf' },
  { number: '06', title: 'Greener Building', description: 'Exploring how circular water systems can support more sustainable built environments.', icon: 'building' },
]

export const researchAreas: readonly ResearchArea[] = [
  {
    id: 'liquid-treatment',
    title: 'Liquid Treatment',
    description: 'Exploring treatment approaches that improve water quality and prepare treated water for suitable reuse applications.',
    link: 'Explore Liquid Treatment',
    icon: 'water', image: imagePath('research-liquid-treatment.webp'),
    alt: 'Representative wastewater treatment and water-quality research',
  },
  {
    id: 'solid-treatment',
    title: 'Solid Treatment & Resource Recovery',
    description: 'Exploring ways to manage and recover value from solids generated during wastewater treatment.',
    link: 'Explore Resource Recovery',
    icon: 'solids', image: imagePath('research-solid-treatment.webp'),
    alt: 'Representative solids and materials treatment research',
  },
  {
    id: 'living-walls',
    title: 'Living Walls & Green Infrastructure',
    description: 'Investigating how treated water and recovered resources can support living walls and other forms of urban greenery.',
    link: 'Explore Green Infrastructure',
    icon: 'leaf', image: imagePath('research-green-wall.webp'),
    alt: 'Representative green wall integrated into architecture',
  },
]

export const benefits: readonly Benefit[] = [
  { number: '01', title: 'Integrated Systems', description: 'Treat water, resource recovery and green infrastructure as connected components.' },
  { number: '02', title: 'Pilot Testing', description: 'Evaluate concepts through controlled and pilot-scale applications.' },
  { number: '03', title: 'Monitoring', description: 'Collect relevant environmental and treatment data to understand system behaviour.' },
  { number: '04', title: 'Continuous Improvement', description: 'Use observations and measurements to refine future system design and operation.' },
]

export const projects: readonly Project[] = [
  { title: 'Pilot Treatment Systems', description: 'Small-scale systems used to explore treatment processes, monitoring and operational performance.', type: 'Pilot Research', status: 'Research', image: imagePath('project-pilot-treatment.webp'), alt: 'Representative pilot treatment research system' },
  { title: 'Resource Recovery Studies', description: 'Research into the treatment and potential reuse of solids and other recovered resources.', type: 'Resource Recovery', status: 'Testing', image: imagePath('project-resource-recovery.webp'), alt: 'Representative resource recovery research materials' },
  { title: 'Green Infrastructure Pilots', description: 'Pilot applications exploring the integration of treated water, irrigation and living-wall systems.', type: 'Green Infrastructure', status: 'Research', image: imagePath('project-green-wall.webp'), alt: 'Representative green-wall pilot installation' },
]

export const collaborationPathways: readonly CollaborationType[] = [
  { title: 'Industry Partners', description: 'Explore real-world environmental challenges, treatment needs and potential applications', icon: 'industry' },
  { title: 'Research Partners', description: 'Collaborate on testing, monitoring, system development and knowledge exchange', icon: 'flask' },
]

export const collaborationPartnerGroups: readonly CollaborationPartnerGroup[] = [
  {
    title: 'Research Partners',
    description: 'Testing, monitoring, system development and knowledge exchange',
    icon: 'flask',
    direction: 'forward',
    partners: [
      { mark: 'U', name: 'University' },
      { mark: 'RI', name: 'Research Institute' },
      { mark: 'EL', name: 'Environmental Lab' },
      { mark: 'AS', name: 'Applied Science Team' },
    ],
  },
  {
    title: 'Industry & Commercial Partners',
    description: 'Real-world environmental challenges, technology and potential applications',
    icon: 'industry',
    direction: 'reverse',
    partners: [
      { mark: 'WT', name: 'Water Technology Provider' },
      { mark: 'EC', name: 'Engineering Consultancy' },
      { mark: 'GI', name: 'Green Infrastructure Specialist' },
      { mark: 'BE', name: 'Built-Environment Organisation' },
    ],
  },
]

export const services: readonly ServiceCapability[] = [
  { number: '01', title: 'Wastewater Assessment', description: 'Review water characteristics, treatment objectives and potential reuse opportunities to identify suitable treatment approaches.', icon: 'water' },
  { number: '02', title: 'Liquid Treatment Development', description: 'Explore biological, filtration and disinfection approaches for wastewater treatment and reuse.', icon: 'treatment' },
  { number: '03', title: 'Resource Recovery', description: 'Investigate opportunities to recover value from solids and other treatment by-products.', icon: 'recovery' },
  { number: '04', title: 'Green-Wall Integration', description: 'Explore how treated water and recovered resources can be integrated with vertical greenery and sustainable building systems.', icon: 'leaf' },
  { number: '05', title: 'Pilot Testing', description: 'Develop and evaluate pilot-scale systems before wider implementation.', icon: 'solids' },
  { number: '06', title: 'Monitoring', description: 'Use environmental and water-quality monitoring to better understand system behaviour and performance.', icon: 'flask' },
]

export const researchThemes: readonly ResearchTheme[] = [
  { number: '01', title: 'Liquid Treatment', description: 'Explore wastewater treatment, filtration, disinfection and suitable reuse applications.', icon: 'water' },
  { number: '02', title: 'Solid Treatment & Resource Recovery', description: 'Investigate the treatment and potential reuse of solids and other recovered resources.', icon: 'treatment' },
  { number: '03', title: 'Water Reuse', description: 'Evaluate suitable applications for treated water within circular environmental systems.', icon: 'recovery' },
  { number: '04', title: 'Living Walls & Green Infrastructure', description: 'Explore how treated water, irrigation and environmental monitoring can support vertical greenery.', icon: 'leaf' },
  { number: '05', title: 'Connected Monitoring', description: 'Use water-quality and environmental data to understand system behaviour over time.', icon: 'flask' },
]

export const careerAreas: readonly CareerArea[] = [
  { title: 'Environmental Engineering', description: 'Connecting treatment questions with practical environmental systems.', icon: 'recovery' },
  { title: 'Water Treatment', description: 'Exploring biological, filtration and disinfection approaches.', icon: 'water' },
  { title: 'Laboratory Research', description: 'Supporting careful testing, observation and research documentation.', icon: 'flask' },
  { title: 'Pilot Testing', description: 'Evaluating concepts through controlled and pilot-scale applications.', icon: 'treatment' },
  { title: 'Environmental Monitoring', description: 'Collecting data to understand water quality and environmental performance.', icon: 'water' },
  { title: 'Sensors & Data Collection', description: 'Supporting remote observation and future environmental-system automation.', icon: 'flask' },
  { title: 'Green Infrastructure', description: 'Connecting planted systems, water reuse and sustainable building applications.', icon: 'leaf' },
  { title: 'Research Support', description: 'Helping multidisciplinary teams investigate connected environmental questions.', icon: 'industry' },
]

export const aboutPrinciples: readonly AboutPrinciple[] = [
  { number: '01', title: 'Integrated Systems', description: 'Treat water, resource recovery and green infrastructure as connected components.', icon: 'recovery' },
  { number: '02', title: 'Pilot Testing', description: 'Evaluate concepts through controlled and pilot-scale applications.', icon: 'treatment' },
  { number: '03', title: 'Monitoring', description: 'Collect relevant environmental and treatment data to understand system behaviour.', icon: 'flask' },
  { number: '04', title: 'Continuous Improvement', description: 'Use observations and measurements to refine future system design and operation.', icon: 'industry' },
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
