import { CollaborationSection, PartnerTrack } from '../components/CollaborationSection'
import { FinalCta } from '../components/FinalCta'
import { InternalPageHero } from '../components/InternalPageHero'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { collaborationPartnerGroups } from '../data/content'

const image = `${import.meta.env.BASE_URL}images/home-green-wall.webp`

export function CollaboratePage() {
  return <div className="internal-page"><InternalPageHero title="Research Works Better Through Collaboration" description="We welcome opportunities to collaborate with industry and research organisations interested in wastewater treatment, resource recovery, water reuse and green infrastructure." image={image} alt="Representative green-wall system integrated into a building" /><CollaborationSection heading="Two Ways to Work Together" /><section className="page-section section" aria-labelledby="collaboration-expectations-title"><div className="container"><Reveal><SectionHeading id="collaboration-expectations-title" title="A Clear Starting Point for Collaboration" description="Early conversations can establish the research question, available setting, monitoring needs and a realistic path toward pilot learning." /></Reveal><div className="collaboration__partner-groups collaboration__partner-groups--page">{collaborationPartnerGroups.map((group, index) => <Reveal key={group.title} delay={index * 80}><PartnerTrack group={group} /></Reveal>)}</div></div></section><FinalCta /></div>
}
