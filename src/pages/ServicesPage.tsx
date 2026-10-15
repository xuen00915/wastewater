import { BenefitsSection } from '../components/BenefitsSection'
import { InternalPageHero } from '../components/InternalPageHero'
import { TreatmentPathway } from '../components/TreatmentPathway'
import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { services } from '../data/content'

const image = `${import.meta.env.BASE_URL}images/home-hero-wastewater.webp`

export function ServicesPage() {
  return <div className="internal-page"><InternalPageHero eyebrow="01 / Services" title="Treatment Capabilities for Connected Water Systems" description="Research-led capabilities connecting wastewater and solids treatment with pilot testing, monitoring, resource recovery and green infrastructure." image={image} alt="Representative pilot wastewater treatment installation" /><section className="page-section section" aria-labelledby="services-capabilities-title"><div className="container"><Reveal><SectionHeading id="services-capabilities-title" eyebrow="Connected Capabilities" title="From Treatment Questions to Pilot Learning" description="Each capability can stand alone, but the strongest research questions often connect several parts of the water system." /></Reveal><div className="page-card-grid page-card-grid--three">{services.map((service, index) => <Reveal key={service.title} delay={index * 60}><article className="info-card"><span className="info-card__number">{service.number}</span><Icon name={service.icon} size={28} /><h2>{service.title}</h2><p>{service.description}</p></article></Reveal>)}</div></div></section><TreatmentPathway /><BenefitsSection /></div>
}
