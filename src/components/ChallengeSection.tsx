import { Icon } from './ui/Icon'
import { Reveal } from './ui/Reveal'

const statements = [
  { title: 'Treat', text: 'Develop effective treatment approaches', icon: 'water' as const },
  { title: 'Recover', text: 'Explore opportunities to recover useful resources', icon: 'recovery' as const },
  { title: 'Reuse', text: 'Connect treated resources with green infrastructure', icon: 'leaf' as const },
]

type ChallengeSectionProps = {
  overlay?: boolean
}

export function ChallengeSection({ overlay = false }: ChallengeSectionProps) {
  return (
    <section className={`challenge section${overlay ? ' challenge--overlay' : ''}`} aria-labelledby="challenge-title">
      <div className="container">
        <Reveal className="challenge__grid challenge__reveal">
          <div className="challenge__title">
            <h2 id="challenge-title">Water Shouldn’t End After Treatment</h2>
          </div>
          <div className="challenge__body">
            <p>Wastewater treatment is often seen as the end of a process. We are interested in what can happen next — how treated water and recovered resources can support greenery, environmental performance and more circular built environments.</p>
            <p>By connecting treatment, reuse, resource recovery and green infrastructure, the aim is to explore practical systems that make better use of water and material resources.</p>
          </div>
          <div className="challenge__statements">
            {statements.map((item) => (
              <article key={item.title}>
                <Icon name={item.icon} size={30} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
