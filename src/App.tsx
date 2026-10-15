import { BenefitsSection } from './components/BenefitsSection'
import { ChallengeSection } from './components/ChallengeSection'
import { CollaborationSection } from './components/CollaborationSection'
import { EditorialFeature } from './components/EditorialFeature'
import { FinalCta } from './components/FinalCta'
import { Hero } from './components/Hero'
import { ProcessSection } from './components/ProcessSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ResearchPillars } from './components/ResearchPillars'
import { SiteShell } from './components/SiteShell'
import { resolvePageId } from './site'
import './components/interactive-sections.css'
import './components/content-sections.css'

export function App() {
  const currentPage = resolvePageId(typeof window === 'undefined' ? '/' : window.location.pathname)
  return <SiteShell currentPage={currentPage}><Hero /><ChallengeSection /><ProcessSection /><ResearchPillars /><EditorialFeature /><BenefitsSection /><ProjectsSection /><CollaborationSection /><FinalCta /></SiteShell>
}
