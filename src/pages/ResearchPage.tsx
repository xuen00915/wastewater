import { EditorialFeature } from '../components/EditorialFeature'
import { InternalPageHero } from '../components/InternalPageHero'
import { ResearchScrollStory } from '../components/ResearchScrollStory'

const image = `${import.meta.env.BASE_URL}images/research-liquid-treatment.webp`

export function ResearchPage() {
  return <div className="internal-page"><InternalPageHero title="Research Across Water, Resources and Living Systems" description="Our work connects water treatment, resource recovery and living systems to support more circular and resilient environments." image={image} alt="Representative water-quality and treatment research" /><ResearchScrollStory /><EditorialFeature /></div>
}
