import { Icon } from './ui/Icon'
import { Reveal } from './ui/Reveal'

const statements = [
  { title: 'Treat', text: 'Develop effective treatment approaches', icon: 'water' as const },
  { title: 'Recover', text: 'Explore opportunities to recover useful resources', icon: 'recovery' as const },
  { title: 'Reuse', text: 'Connect treated resources with green infrastructure', icon: 'leaf' as const },
]

export function ChallengeSection() {
  return (
    <section className="challenge section" aria-labelledby="challenge-title">
      <div className="container">
        <Reveal className="challenge__grid challenge__reveal">
          <div className="challenge__title">
            <h2 id="challenge-title">Water Shouldn’t End After Treatment</h2>
          </div>
          <div className="challenge__body">
            <p>Conventional wastewater treatment is often viewed as an end-of-pipe process. Our research explores how treated water, recovered resources and green infrastructure can become part of a broader circular system.</p>
            <p>By connecting treatment technologies with resource recovery and green-wall applications, the aim is to create practical solutions that support more sustainable buildings and environments.</p>
            <div className="challenge__statements">
              {statements.map((item) => (
                <article key={item.title}>
                  <Icon name={item.icon} size={30} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
