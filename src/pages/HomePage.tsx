import { CollaborationSection } from '../components/CollaborationSection'
import { Hero } from '../components/Hero'
import { OngoingProjectPanel } from '../components/OngoingProjectPanel'
import { ProcessSection } from '../components/ProcessSection'
import { ProjectsSection } from '../components/ProjectsSection'
import { ResearchPillars } from '../components/ResearchPillars'

export function HomePage() {
  return <div className="home-page"><Hero /><ProcessSection /><ResearchPillars /><OngoingProjectPanel /><ProjectsSection showPageLink /><CollaborationSection variant="partners" /></div>
}
