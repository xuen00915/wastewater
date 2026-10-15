import { BenefitsSection } from './components/BenefitsSection'
import { ChallengeSection } from './components/ChallengeSection'
import { CollaborationSection } from './components/CollaborationSection'
import { EditorialFeature } from './components/EditorialFeature'
import { FinalCta } from './components/FinalCta'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProcessSection } from './components/ProcessSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ResearchPillars } from './components/ResearchPillars'
import './components/interactive-sections.css'
import './components/content-sections.css'

export function App() {
  return <><Header /><main><Hero /><ChallengeSection /><ProcessSection /><ResearchPillars /><EditorialFeature /><BenefitsSection /><ProjectsSection /><CollaborationSection /><FinalCta /></main><Footer /></>
}
