import { ButtonLink } from './ui/ButtonLink'
import { pageHref } from '../site'
import { ChallengeSection } from './ChallengeSection'
import { WaterStoryScroll } from './water-story/WaterStoryScroll'

const heroImage = `${import.meta.env.BASE_URL}images/home-hero-wastewater.webp`
const cinematicFrame = `${import.meta.env.BASE_URL}images/home-water-frame-dark.webp`

export function Hero() {
  return (
    <WaterStoryScroll>
      <div className="hero__ambient" aria-hidden="true"><i /><i /></div>
      <div
        className="hero__cinematic"
        role="img"
        aria-label="Representative pilot wastewater treatment system integrated with vegetation framed by water"
      >
        <img className="hero__cinematic-photo" src={heroImage} alt="" />
        <img className="hero__cinematic-frame" src={cinematicFrame} alt="" />
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
      </div>
      <ChallengeSection overlay />
      <p className="hero__scroll-indicator"><span>Scroll to explore</span><i aria-hidden="true" /></p>
    </WaterStoryScroll>
  )
}
