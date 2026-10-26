import { FinalCta } from '../components/FinalCta'
import { InternalPageHero } from '../components/InternalPageHero'
import { Icon } from '../components/ui/Icon'
import { Reveal } from '../components/ui/Reveal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { aboutPrinciples } from '../data/content'

const image = `${import.meta.env.BASE_URL}images/home-green-wall.webp`

export function AboutPage() {
  return (
    <div className="internal-page about-page">
      <InternalPageHero
        title="Research for Circular Water Systems"
        description="We connect wastewater treatment, resource recovery, water reuse and green infrastructure as parts of one circular environmental system."
        image={image}
        alt="Representative green-wall system integrated with architecture"
      />

      <section className="about-story section" aria-labelledby="about-purpose-title">
        <div className="container about-story__grid">
          <Reveal>
            <SectionHeading
              id="about-purpose-title"
              title="Treatment Is the Beginning of a Larger Story"
              description="Our focus is the pathway beyond conventional end-of-pipe thinking: understanding wastewater, evaluating treatment, exploring recovery and reuse, and connecting treated resources with living infrastructure."
            />
          </Reveal>
          <Reveal className="about-story__pathway" delay={100}>
            <p>Wastewater</p>
            <span aria-hidden="true" />
            <p>Treatment</p>
            <span aria-hidden="true" />
            <p>Resource Recovery</p>
            <span aria-hidden="true" />
            <p>Reuse</p>
            <span aria-hidden="true" />
            <p>Green Infrastructure</p>
            <span aria-hidden="true" />
            <p>Greener Building</p>
          </Reveal>
        </div>
      </section>

      <section className="page-section page-section--tint section" aria-labelledby="about-approach-title">
        <div className="container">
          <Reveal>
            <SectionHeading
              id="about-approach-title"
              title="How We Approach the Work"
              description="A practical research approach that connects scientific questions with pilot learning and potential real-world application."
            />
          </Reveal>
          <div className="page-card-grid page-card-grid--four">
            {aboutPrinciples.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 70}>
                <article className="info-card">
                  <span className="info-card__number">{principle.number}</span>
                  <Icon name={principle.icon} size={28} />
                  <h2>{principle.title}</h2>
                  <p>{principle.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </div>
  )
}
