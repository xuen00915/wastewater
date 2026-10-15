import { InternalPageHero } from '../components/InternalPageHero'
import { ProjectsSection } from '../components/ProjectsSection'

const image = `${import.meta.env.BASE_URL}images/project-pilot-treatment.webp`

export function ProjectsPage() {
  return <div className="internal-page"><InternalPageHero eyebrow="03 / Projects" title="Research Beyond the Laboratory" description="A project space for pilot treatment, resource recovery and green-wall integration work as verified research information becomes available." image={image} alt="Representative pilot treatment research system" /><ProjectsSection heading="Current Project Directions" /></div>
}
