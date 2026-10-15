import { ButtonLink } from './ui/ButtonLink'
import { Icon } from './ui/Icon'
import { WaterBuildingParticles } from './ui/WaterBuildingParticles'
import { pageHref } from '../site'

const circularStages = [
  ['water', 'Treatment'], ['recovery', 'Recovery'], ['leaf', 'Reuse'], ['building', 'Green Infrastructure'],
] as const

export function Hero() {
  return (
    <section className="hero" id="home">
      <WaterBuildingParticles className="hero__transformation-canvas" />
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">Water <span>•</span> Resources <span>•</span> Greener Environments</p>
          <h1>Transforming <em>Wastewater</em> Into <em>Resources</em> for <em>Greener Buildings</em></h1>
          <p className="hero__description">Advancing wastewater treatment, resource recovery and green-wall research as one connected circular system for more sustainable built environments.</p>
          <div className="hero__actions">
            <ButtonLink href={pageHref('research')}>Explore Our Research</ButtonLink>
            <ButtonLink href={pageHref('projects')} variant="secondary">View Projects</ButtonLink>
          </div>
          <p className="hero__topics">Liquid Treatment <span>•</span> Resource Recovery <span>•</span> Green Infrastructure</p>
        </div>
        <div className="hero__visual">
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
