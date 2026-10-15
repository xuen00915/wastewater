import { researchAreas } from '../data/content'
import { Icon } from './ui/Icon'
import { MediaPlaceholder } from './ui/MediaPlaceholder'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { pageHref } from '../site'

export function ResearchPillars() {
  return <section className="research section" id="research" aria-labelledby="research-title"><div className="container">
    <Reveal><SectionHeading id="research-title" align="center" title="Three Research Areas. One Circular System." description="Liquid treatment, solid treatment and green-wall research are developed as connected parts of the same environmental system." /></Reveal>
    <div className="research__grid" data-testid="research-areas">{researchAreas.map((area, index) => <Reveal key={area.title} delay={index * 90}><article className="research-card">
      <MediaPlaceholder src={area.image} alt={area.alt} requiredFilename={area.image} icon={area.icon === 'solids' ? 'solids' : area.icon} />
      <div className="research-card__body"><span className="research-card__icon"><Icon name={area.icon} size={25} /></span><h3>{area.title}</h3><p>{area.description}</p><a href={pageHref('research')}>{area.link}<Icon name="arrow" size={18} /></a></div>
    </article></Reveal>)}</div>
  </div></section>
}
