import { MediaPlaceholder } from './ui/MediaPlaceholder'

export type InternalPageHeroProps = {
  eyebrow: string
  title: string
  description: string
  image: string
  alt: string
}

export function InternalPageHero({ eyebrow, title, description, image, alt }: InternalPageHeroProps) {
  return (
    <section className="internal-hero">
      <div className="container internal-hero__grid">
        <div className="internal-hero__copy">
          <p className="section-kicker">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <MediaPlaceholder src={image} alt={alt} requiredFilename={image} loading="eager" fetchPriority="high" />
      </div>
    </section>
  )
}
