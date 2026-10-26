import { InternalPageHero } from '../components/InternalPageHero'
import { OngoingProjectPanel } from '../components/OngoingProjectPanel'
import { ProjectsSection } from '../components/ProjectsSection'
import { ResearchRecognition } from '../components/ResearchRecognition'

const image = `${import.meta.env.BASE_URL}images/project-pilot-treatment.webp`

export function ProjectsPage() {
  return <div className="internal-page"><InternalPageHero title="Research Beyond the Laboratory" description="A project space for pilot treatment systems, resource recovery studies and green-infrastructure pilots as verified information becomes available." image={image} alt="Representative pilot treatment research system" /><ResearchRecognition /><OngoingProjectPanel /><ProjectsSection heading="Current Project Directions" /></div>
}
