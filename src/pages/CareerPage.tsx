import { InternalPageHero } from '../components/InternalPageHero'
import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { careerAreas } from '../data/content'

const image = `${import.meta.env.BASE_URL}images/research-green-wall.webp`

export function CareerPage() {
  return <div className="internal-page"><InternalPageHero eyebrow="05 / Career" title="Build the Future of Environmental Research" description="Future opportunities may connect water technology, field learning, monitoring and living infrastructure in a collaborative research environment." image={image} alt="Representative green infrastructure research environment" /><section className="page-section section" aria-labelledby="career-areas-title"><div className="container"><Reveal><SectionHeading id="career-areas-title" eyebrow="Areas of Work" title="Research With Practical Context" description="Our areas of interest span laboratory questions, pilot systems, monitoring and environmental applications." /></Reveal><div className="page-card-grid page-card-grid--four">{careerAreas.map((area, index) => <Reveal key={area.title} delay={index * 70}><article className="info-card"><Icon name={area.icon} size={28} /><h2>{area.title}</h2><p>{area.description}</p></article></Reveal>)}</div><Reveal className="career-availability"><p className="section-kicker">Current Opportunities</p><h2>Opportunities will be published when available.</h2><p>No vacancies are being advertised on this website at present. Future verified opportunities and application details will be shared on this page.</p></Reveal></div></section></div>
}
