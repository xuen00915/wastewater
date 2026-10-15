import { ChallengeSection } from '../components/ChallengeSection'
import { CollaborationSection } from '../components/CollaborationSection'
import { Hero } from '../components/Hero'
import { ProcessSection } from '../components/ProcessSection'
import { ProjectsSection } from '../components/ProjectsSection'
import { ResearchPillars } from '../components/ResearchPillars'

export function HomePage() {
  return <div className="home-page"><Hero /><ChallengeSection /><ProcessSection /><ResearchPillars /><ProjectsSection showPageLink /><CollaborationSection /></div>
}
