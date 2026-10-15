import { CollaborationSection } from '../components/CollaborationSection'
import { FinalCta } from '../components/FinalCta'
import { InternalPageHero } from '../components/InternalPageHero'
import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { collaborationPathways } from '../data/content'

const image = `${import.meta.env.BASE_URL}images/home-green-wall.webp`

export function CollaboratePage() {
  return <div className="internal-page"><InternalPageHero eyebrow="04 / Collaborate" title="Progress Through Shared Research" description="We welcome conversations with organisations interested in practical wastewater research, pilot testing, resource recovery and greener built environments." image={image} alt="Representative green-wall system integrated into a building" /><CollaborationSection heading="Three Ways to Work Together" /><section className="page-section section" aria-labelledby="collaboration-expectations-title"><div className="container"><Reveal><SectionHeading id="collaboration-expectations-title" eyebrow="Working Together" title="A Clear Starting Point for Collaboration" description="Early conversations can establish the research question, available setting, monitoring needs and a realistic path toward pilot learning." /></Reveal><div className="page-card-grid page-card-grid--three">{collaborationPathways.map((pathway, index) => <Reveal key={pathway.title} delay={index * 70}><article className="info-card"><Icon name={pathway.icon} size={28} /><h2>{pathway.title}</h2><p>{pathway.description}.</p></article></Reveal>)}</div><p className="availability-note">Verified contact details will be published here when available.</p></div></section><FinalCta /></div>
}
