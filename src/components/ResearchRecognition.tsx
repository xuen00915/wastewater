import { ButtonLink } from './ui/ButtonLink'
import { Reveal } from './ui/Reveal'

const releaseHref = `${import.meta.env.BASE_URL}documents/sfa-sustainable-aquaculture-media-release-2021.pdf`

export function ResearchRecognition() {
  return (
    <section className="research-recognition page-section section" aria-labelledby="research-recognition-title">
      <div className="container">
        <Reveal className="research-recognition__grid">
          <div className="research-recognition__heading">
            <p className="research-recognition__label">Research recognition</p>
            <h2 id="research-recognition-title">Recognised Sustainable Aquaculture Research</h2>
          </div>
          <div className="research-recognition__content">
            <p className="research-recognition__source">Singapore Food Agency · 26 April 2021</p>
            <h3>Achieving a sustainable aquaculture environment by specialized microbes</h3>
            <p>The Singapore Food Agency media release lists the National University of Singapore (NUS) and E and ST Environmental Pte Ltd as the team for this research project.</p>
            <p className="research-recognition__context">The project was one of 12 projects awarded under the Sustainable Urban Food Production grant call, which provided more than S$23 million across the full group of awarded projects.</p>
            <div className="research-recognition__action">
              <ButtonLink href={releaseHref} variant="secondary" target="_blank" rel="noopener noreferrer">
                Read the SFA media release
              </ButtonLink>
              <span>PDF · 4 pages · 184 KB</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
