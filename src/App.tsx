import type { ComponentType } from 'react'
import { SiteShell } from './components/SiteShell'
import { CareerPage } from './pages/CareerPage'
import { AboutPage } from './pages/AboutPage'
import { CollaboratePage } from './pages/CollaboratePage'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ResearchPage } from './pages/ResearchPage'
import { ServicesPage } from './pages/ServicesPage'
import { resolvePageId, type PageId } from './site'
import './components/interactive-sections.css'
import './components/content-sections.css'
import './components/page-sections.css'
import './components/research-scroll-story.css'

const pageComponents: Record<PageId, ComponentType> = {
  home: HomePage,
  services: ServicesPage,
  research: ResearchPage,
  projects: ProjectsPage,
  collaborate: CollaboratePage,
  career: CareerPage,
  about: AboutPage,
}

export function App() {
  const currentPage = resolvePageId(typeof window === 'undefined' ? '/' : window.location.pathname)
  const Page = pageComponents[currentPage]
  return <SiteShell currentPage={currentPage}><Page /></SiteShell>
}
