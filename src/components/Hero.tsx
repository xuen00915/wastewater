import { ButtonLink } from './ui/ButtonLink'
import { pageHref } from '../site'
import { LivingWaterPortal } from './water-story/LivingWaterPortal'
import { WaterStoryScroll } from './water-story/WaterStoryScroll'
import { WaterSurface } from './water-story/WaterSurface'

const heroImage = `${import.meta.env.BASE_URL}images/home-hero-wastewater.webp`

export function Hero() {
  return (
    <WaterStoryScroll>
      <div className="hero__ambient" aria-hidden="true"><i /><i /></div>
      <div className="hero__immersion" aria-hidden="true">
        <div className="hero__immersion-image">
          <img
            className="hero__immersion-photo"
            src={heroImage}
            alt=""
          />
        </div>
        <WaterSurface />
      </div>

      <div className="hero__inner">
        <div className="hero__copy">
          <h1>
            <span>Transforming Wastewater </span>
            <span>Into Resources for </span>
            <em>Greener Buildings</em>
          </h1>
          <p className="hero__description">Advancing wastewater treatment, resource recovery and green-wall research as one connected circular system for more sustainable built environments.</p>
          <div className="hero__actions">
            <ButtonLink href={pageHref('research')}>Explore Our Research</ButtonLink>
            <ButtonLink href={pageHref('projects')} variant="secondary">View Projects</ButtonLink>
          </div>
        </div>
        <div className="hero__portal"><LivingWaterPortal /></div>
      </div>
      <p className="hero__scroll-indicator"><span>Scroll to explore</span><i aria-hidden="true" /></p>
    </WaterStoryScroll>
  )
}
