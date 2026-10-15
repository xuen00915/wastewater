import { EditorialFeature } from '../components/EditorialFeature'
import { InternalPageHero } from '../components/InternalPageHero'
import { ResearchPillars } from '../components/ResearchPillars'
import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { researchThemes } from '../data/content'

const image = `${import.meta.env.BASE_URL}images/research-liquid-treatment.webp`

export function ResearchPage() {
  return <div className="internal-page"><InternalPageHero eyebrow="02 / Research" title="Research Across Water, Resources and Living Systems" description="Our research direction brings treatment, recovery, monitoring and green-wall applications into one connected environmental system." image={image} alt="Representative water-quality and treatment research" /><ResearchPillars /><section className="page-section section page-section--tint" aria-labelledby="research-themes-title"><div className="container"><Reveal><SectionHeading id="research-themes-title" eyebrow="Research Framework" title="Questions That Connect the System" description="The programme is organised around practical research themes without assuming outcomes before testing and monitoring are complete." /></Reveal><div className="page-card-grid">{researchThemes.map((theme, index) => <Reveal key={theme.title} delay={index * 60}><article className="info-card"><span className="info-card__number">{theme.number}</span><Icon name={theme.icon} size={28} /><h2>{theme.title}</h2><p>{theme.description}</p></article></Reveal>)}</div></div></section><EditorialFeature /></div>
}
