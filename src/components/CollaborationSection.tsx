import { collaborationPartnerGroups, collaborationPathways, type CollaborationPartnerGroup } from '../data/content'
import { pageHref } from '../site'
import { ButtonLink } from './ui/ButtonLink'
import { Icon } from './ui/Icon'
import { Reveal } from './ui/Reveal'

type CollaborationSectionProps = {
  heading?: string
  variant?: 'partners' | 'pathways'
}

type PartnerMarqueeEntry = {
  partner: CollaborationPartnerGroup['partners'][number]
  label: string
}

function PartnerMarqueeTrack({ entries, label, direction, large = false }: { entries: readonly PartnerMarqueeEntry[]; label: string; direction: CollaborationPartnerGroup['direction']; large?: boolean }) {
  const repeatedPartners = [...entries, ...entries]

  return <div className={`partner-marquee${large ? ' partner-marquee--large' : ''} partner-marquee--${direction}`} role="list" aria-label={label} tabIndex={0}>
      <div className="partner-marquee__track">
        {repeatedPartners.map((entry, index) => {
          const isDuplicate = index >= entries.length
          return <div className="partner-logo" role={isDuplicate ? undefined : 'listitem'} aria-hidden={isDuplicate || undefined} key={`${entry.partner.mark}-${index}`}>
            <span className="partner-logo__mark" aria-hidden="true">{entry.partner.mark}</span>
            <span className="partner-logo__copy"><strong>{entry.partner.name}</strong><small>{entry.label}</small></span>
          </div>
        })}
      </div>
    </div>
}

export function PartnerMarquee({ group, large = false }: { group: CollaborationPartnerGroup; large?: boolean }) {
  return <PartnerMarqueeTrack entries={group.partners.map((partner) => ({ partner, label: 'Potential partner type' }))} label={`Potential ${group.title.toLowerCase()} types`} direction={group.direction} large={large} />
}

export function PartnerTrack({ group }: { group: CollaborationPartnerGroup }) {
  const headingId = `partner-group-${group.icon}`

  return <section className="partner-group" aria-labelledby={headingId}>
    <header className="partner-group__header">
      <span className="partner-group__icon"><Icon name={group.icon} size={24} /></span>
      <div><h3 id={headingId}>{group.title}</h3><p>{group.description}</p></div>
    </header>
    <PartnerMarquee group={group} large />
  </section>
}

export function CollaborationSection({ heading, variant = 'pathways' }: CollaborationSectionProps) {
  const resolvedHeading = heading ?? (variant === 'partners' ? 'Who We Collaborate With' : 'Research Works Better Through Collaboration')

  if (variant === 'partners') {
    return <section className="collaboration collaboration--partners section" id="collaborate" aria-labelledby="collaboration-title"><div className="container collaboration__grid">
      <Reveal className="collaboration__intro"><h2 id="collaboration-title">{resolvedHeading}</h2><p>We welcome opportunities to work with industry partners and research organisations interested in wastewater treatment, resource recovery, water reuse and green infrastructure.</p><ButtonLink href={pageHref('collaborate')}>Explore Collaboration</ButtonLink></Reveal>
      <div className="collaboration__partner-groups" id="collaboration-options" data-testid="collaboration-types">{collaborationPartnerGroups.map((group, index) => <Reveal key={group.title} delay={index * 80}><PartnerTrack group={group} /></Reveal>)}</div>
    </div></section>
  }

  return <section className="collaboration section" id="collaborate" aria-labelledby="collaboration-title"><div className="container collaboration__grid">
    <Reveal className="collaboration__intro"><h2 id="collaboration-title">{resolvedHeading}</h2><p>We welcome opportunities to collaborate with industry and research organisations interested in wastewater treatment, resource recovery, water reuse and green infrastructure.</p><ButtonLink href={pageHref('collaborate')}>Explore Collaboration</ButtonLink></Reveal>
    <div className="collaboration__types" id="collaboration-options" data-testid="collaboration-types">{collaborationPathways.map((type, index) => <Reveal key={type.title} delay={index * 80}><article><span><Icon name={type.icon} size={26} /></span><div><h3>{type.title}</h3><p>{type.description}</p></div><Icon className="collaboration__arrow" name="arrow" size={22} /></article></Reveal>)}</div>
  </div></section>
}
