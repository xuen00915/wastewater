import { ButtonLink } from './ui/ButtonLink'
import { Floating3DParticles } from './ui/Floating3DParticles'
import { Icon } from './ui/Icon'
import { MediaPlaceholder } from './ui/MediaPlaceholder'

const circularStages = [
  ['water', 'Treatment'], ['recovery', 'Recovery'], ['leaf', 'Reuse'], ['building', 'Green Infrastructure'],
] as const

export function Hero() {
  return (
    <section className="hero" id="home">
      <Floating3DParticles className="hero__particles" />
      <div className="water-contours" aria-hidden="true"><i /><i /><i /></div>
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">Water <span>•</span> Resources <span>•</span> Greener Environments</p>
          <h1>Transforming <em>Wastewater</em> Into <em>Resources</em> for <em>Greener Buildings</em></h1>
          <p className="hero__description">Advancing wastewater treatment, resource recovery and green-wall research as one connected circular system for more sustainable built environments.</p>
          <div className="hero__actions">
            <ButtonLink href="#research">Explore Our Research</ButtonLink>
            <ButtonLink href="#projects" variant="secondary">View Projects</ButtonLink>
          </div>
          <p className="hero__topics">Liquid Treatment <span>•</span> Resource Recovery <span>•</span> Green Infrastructure</p>
        </div>
        <div className="hero__visual">
          <MediaPlaceholder src={`${import.meta.env.BASE_URL}images/home-hero-wastewater.webp`} alt="Representative pilot wastewater treatment system integrated with vegetation" requiredFilename="/images/home-hero-wastewater.webp" loading="eager" fetchPriority="high" />
          <div className="circular-card">
            <p>Circular Water System</p>
            <div className="circular-card__flow">
              {circularStages.map(([icon, label], index) => (
                <div className="circular-card__item" key={label}>
                  <span><Icon name={icon} size={20} /></span>
                  <small>{label}</small>
                  {index < circularStages.length - 1 && <Icon className="circular-card__arrow" name="arrow" size={16} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
