import { MediaPlaceholder } from './ui/MediaPlaceholder'

export type InternalPageHeroProps = {
  title: string
  description: string
  image: string
  alt: string
}

export function InternalPageHero({ title, description, image, alt }: InternalPageHeroProps) {
  return (
    <section className="internal-hero">
      <div className="container internal-hero__grid">
        <div className="internal-hero__copy">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <MediaPlaceholder className="internal-hero__media" src={image} alt={alt} requiredFilename={image} loading="eager" fetchPriority="high" />
      </div>
    </section>
  )
}
