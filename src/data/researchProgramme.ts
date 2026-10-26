import type { IconName } from '../components/ui/Icon'

export type ResearchChapterId = 'liquid-treatment' | 'solid-treatment' | 'living-walls'

export type ResearchPathwayStep = {
  title: string
  description: string
}

export type PublishedSource = {
  title: string
  citation: string
  url: string
}

export type ResearchChapter = {
  id: ResearchChapterId
  number: string
  title: string
  shortDescription: string
  purpose: string
  image: string
  alt: string
  icon: IconName
  pathway: readonly ResearchPathwayStep[]
  questions: readonly string[]
  evidence: readonly string[]
  foundation: string
  statusNote: string
  sources: readonly PublishedSource[]
}

const imagePath = (filename: string) => `${import.meta.env.BASE_URL}images/${filename}`

const researchChapterIds: readonly ResearchChapterId[] = [
  'liquid-treatment',
  'solid-treatment',
  'living-walls',
]

export const defaultResearchChapterId: ResearchChapterId = 'liquid-treatment'

export function isResearchChapterId(value: string): value is ResearchChapterId {
  return researchChapterIds.includes(value as ResearchChapterId)
}

export const researchChapters: readonly ResearchChapter[] = [
  {
    id: 'liquid-treatment',
    number: '01',
    title: 'Liquid Treatment',
    shortDescription: 'Biological treatment, planted stages, filtration and disinfection considered as one connected water pathway.',
    purpose: 'This programme investigates an integrated treatment train that combines biological batch treatment, planted treatment, filtration and disinfection to prepare treated water for suitable reuse applications.',
    image: imagePath('research-liquid-treatment.webp'),
    alt: 'Representative wastewater treatment and water-quality research',
    icon: 'water',
    pathway: [
      { title: 'Biological treatment', description: 'Sequencing and aeration support controlled treatment of wastewater.' },
      { title: 'Planted treatment', description: 'Roots and associated biofilms create additional treatment surfaces and nutrient-removal pathways.' },
      { title: 'Filtration', description: 'A vegetated slow-sand stage targets remaining suspended matter and supports polishing.' },
      { title: 'Disinfection and reuse evaluation', description: 'Ultraviolet treatment and water-quality monitoring inform whether water is suitable for an intended reuse.' },
    ],
    questions: [
      'How do airflow, cycle time and solids-retention time affect treatment stability?',
      'How do planted treatment stages affect nutrient and suspended-solids removal?',
      'How do filtration and ultraviolet treatment change turbidity and microbiological water quality?',
      'Which monitored parameters are needed to assess safe, suitable reuse?',
    ],
    evidence: [
      'Water-quality change across each treatment stage',
      'Operational stability under different settings',
      'Turbidity and microbiological indicators before and after polishing and disinfection',
      'Sensor data that can support repeatable operation and future control',
    ],
    foundation: 'ISO 30500:2025 sets safety and performance requirements for prefabricated integrated non-sewered sanitation systems, including output quality and selected sustainability considerations. It provides relevant principles for evaluation, while formal scope and conformity require separate verification.',
    statusNote: 'Research direction: treatment performance and reuse suitability remain subjects for testing. No certification or compliance outcome is stated.',
    sources: [
      {
        title: 'ISO 30500:2025 — Non-sewered sanitation systems',
        citation: 'International Organization for Standardization, 2025',
        url: 'https://www.iso.org/standard/87343.html',
      },
    ],
  },
  {
    id: 'solid-treatment',
    number: '02',
    title: 'Solid Treatment & Resource Recovery',
    shortDescription: 'Solar-assisted drying, thermal treatment and evidence-led assessment before any potential material use.',
    purpose: 'This programme investigates solar-assisted drying and thermal treatment of wastewater solids, followed by chemical, microbiological and plant-uptake assessment before any potential non-food greenery application is considered.',
    image: imagePath('research-solid-treatment.webp'),
    alt: 'Representative solids and materials treatment research',
    icon: 'solids',
    pathway: [
      { title: 'Characterise', description: 'Establish the moisture, nutrient, pollutant and microbiological profile of the wet material.' },
      { title: 'Dry and heat', description: 'Evaluate solar-assisted moisture reduction and controlled thermal exposure.' },
      { title: 'Verify', description: 'Test the treated material for pathogen indicators, pollutants and other relevant quality criteria.' },
      { title: 'Assess potential use', description: 'Examine whether suitably treated material could support non-food plants, including controlled plant-uptake trials where relevant.' },
    ],
    questions: [
      'How do solar exposure, temperature, ventilation and drying time affect moisture reduction?',
      'What treatment conditions are needed to achieve measurable pathogen reduction?',
      'How do nutrient and pollutant concentrations change as the material dries?',
      'What evidence is needed before a recovered material can be considered for a specific use?',
    ],
    evidence: [
      'Moisture content and drying rate',
      'Time–temperature history',
      'Microbiological indicators before and after treatment',
      'Nutrients, heavy metals and other relevant pollutants',
      'Plant response and uptake in controlled trials',
    ],
    foundation: 'Public biosolids frameworks combine pollutant limits, pathogen and vector-attraction reduction, management practices, monitoring and recordkeeping. Published studies also show that solar drying can reduce sludge moisture and volume, while pathogen outcomes depend on treatment configuration and environmental conditions.',
    statusNote: 'Research direction: drying or reaching one temperature does not by itself establish a biosolids class or approval for use.',
    sources: [
      {
        title: 'US EPA — Sewage Sludge Laws and Regulations',
        citation: '40 CFR Part 503 overview',
        url: 'https://www.epa.gov/biosolids/sewage-sludge-laws-and-regulations',
      },
      {
        title: 'US EPA — Land Application of Biosolids',
        citation: 'Classes and land-application requirements',
        url: 'https://www.epa.gov/biosolids/land-application-biosolids',
      },
      {
        title: 'Extended Dewatering of Sewage Sludge in Solar Drying Plants',
        citation: 'Mathioudakis et al., Desalination, 2009',
        url: 'https://doi.org/10.1016/j.desal.2009.01.011',
      },
    ],
  },
  {
    id: 'living-walls',
    number: '03',
    title: 'Living Walls & Green Infrastructure',
    shortDescription: 'Treated-water irrigation, plant health and environmental monitoring brought together at the building edge.',
    purpose: 'This programme examines how living walls can receive suitably treated water while supporting research into plant health, irrigation demand, façade conditions and environmental monitoring.',
    image: imagePath('research-green-wall.webp'),
    alt: 'Representative green wall integrated into architecture',
    icon: 'leaf',
    pathway: [
      { title: 'Supply', description: 'Deliver suitably treated water through a controlled irrigation system.' },
      { title: 'Grow', description: 'Use planted modules and engineered media as the living-wall environment.' },
      { title: 'Compare', description: 'Evaluate wall configurations, irrigation strategies and reference surfaces.' },
      { title: 'Monitor', description: 'Log water use, plant condition and external or internal surface and air temperatures over time.' },
    ],
    questions: [
      'How do wall configuration, plant choice, media and irrigation affect system behaviour?',
      'How does treated-water irrigation influence plant health and water demand?',
      'How do planted and reference surfaces differ under comparable weather conditions?',
      'Which sensors and sampling intervals provide useful long-term evidence?',
    ],
    evidence: [
      'Plant health and vitality',
      'Irrigation volume and water-quality observations',
      'External and internal surface or air temperature',
      'Weather, shading and evapotranspiration context',
      'Repeatability across configurations and seasons',
    ],
    foundation: 'Published studies show that living-wall thermal and treatment behaviour varies with climate, orientation, construction, vegetation, media and hydraulic operation. These findings support comparative monitoring rather than a universal performance value.',
    statusNote: 'Research direction: the programme evaluates relationships between water, plants and building conditions without stating a predetermined cooling or treatment outcome.',
    sources: [
      {
        title: 'Green wall height and design optimisation for greywater treatment',
        citation: 'Prodanovic et al., Journal of Environmental Management, 2020',
        url: 'https://doi.org/10.1016/j.jenvman.2020.110173',
      },
      {
        title: 'Nitrogen Removal in Greywater Living Wall Systems',
        citation: 'Prodanovic et al., Water, 2018',
        url: 'https://doi.org/10.3390/w10040527',
      },
      {
        title: 'Thermal Influence of a Continuous Living Wall in a Subtropical Climate',
        citation: 'Sustainability, 2023',
        url: 'https://doi.org/10.3390/su15042985',
      },
    ],
  },
]

export const monitoringAcrossSystem = 'Monitoring links the treatment train. Water-quality observations, operating conditions, plant response and environmental data help the team compare stages, identify change and refine future tests.'
