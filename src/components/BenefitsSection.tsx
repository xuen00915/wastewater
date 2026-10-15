import { benefits } from '../data/content'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

export function BenefitsSection() {
  return <section className="benefits section" aria-labelledby="benefits-title"><div className="container">
    <Reveal><SectionHeading id="benefits-title" align="center" title="Research Designed for Real-World Application" /></Reveal>
    <div className="benefits__grid" data-testid="benefits">{benefits.map((benefit, index) => <Reveal key={benefit.number} delay={index * 70}><article className="benefit"><div className="benefit__top"><span>{benefit.number}</span><i /></div><h3>{benefit.title}</h3><p>{benefit.description}</p></article></Reveal>)}</div>
  </div></section>
}
