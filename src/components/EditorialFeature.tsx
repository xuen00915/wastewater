import { Icon } from './ui/Icon'
import { MediaPlaceholder } from './ui/MediaPlaceholder'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const rows = [
  { title: 'Water', text: 'Treatment and monitoring', icon: 'water' as const },
  { title: 'Resources', text: 'Recovery and reuse opportunities', icon: 'recovery' as const },
  { title: 'Environment', text: 'Green-wall and building integration', icon: 'leaf' as const },
]

export function EditorialFeature() {
  return <section className="editorial section" aria-labelledby="editorial-title"><div className="container editorial__grid">
    <Reveal className="editorial__media"><MediaPlaceholder src={`${import.meta.env.BASE_URL}images/home-green-wall.webp`} alt="Representative green wall and water system integrated into a building" icon="leaf" /></Reveal>
    <Reveal className="editorial__content"><SectionHeading id="editorial-title" inverted title="Connecting Water With Living Systems" description="Green infrastructure can provide more than visual value. By connecting treated water with living walls and planted systems, research can explore water reuse, plant performance and relationships with the built environment." />
      <div className="editorial__rows">{rows.map((row) => <div className="editorial__row" key={row.title}><Icon name={row.icon} /><div><h3>{row.title}</h3><p>{row.text}</p></div></div>)}</div>
    </Reveal>
  </div></section>
}
