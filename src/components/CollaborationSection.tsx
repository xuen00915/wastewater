import { collaborationTypes } from '../data/content'
import { pageHref } from '../site'
import { ButtonLink } from './ui/ButtonLink'
import { Icon } from './ui/Icon'
import { Reveal } from './ui/Reveal'

export function CollaborationSection({ heading = 'Research Works Better Through Collaboration' }: { heading?: string }) {
  return <section className="collaboration section" id="collaborate" aria-labelledby="collaboration-title"><div className="container collaboration__grid">
    <Reveal className="collaboration__intro"><p className="section-kicker">05 / Collaborate</p><h2 id="collaboration-title">{heading}</h2><p>We welcome opportunities to work with industry partners, research organisations and pilot-site partners interested in advancing wastewater treatment, resource recovery and green infrastructure.</p><ButtonLink href={pageHref('collaborate')}>Explore Collaboration</ButtonLink></Reveal>
    <div className="collaboration__types" id="collaboration-options" data-testid="collaboration-types">{collaborationTypes.map((type, index) => <Reveal key={type.title} delay={index * 80}><article><span><Icon name={type.icon} size={26} /></span><div><h3>{type.title}</h3><p>{type.description}</p></div><Icon className="collaboration__arrow" name="arrow" size={22} /></article></Reveal>)}</div>
  </div></section>
}
