import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { Reveal } from './ui/Reveal'
import './treatment-pathway.css'

const diagramAlt = 'Integrated in-situ wastewater treatment and reuse system connecting filtration, disinfection, resource recovery and living walls'

export function TreatmentPathway() {
  const [isExpanded, setIsExpanded] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isExpanded) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isExpanded])

  const closeDiagram = () => {
    setIsExpanded(false)
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') closeDiagram()
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) closeDiagram()
  }

  const imageSrc = `${import.meta.env.BASE_URL}images/integrated-treatment-reuse-diagram.webp`

  return (
    <section className="treatment-pathway section" aria-labelledby="treatment-pathway-title">
      <div className="container treatment-pathway__container">
        <Reveal className="treatment-pathway__intro">
          <h2 id="treatment-pathway-title">How Wastewater Treatment Works</h2>
          <p>Explore an illustrative research and development framework connecting treatment, recovery, reuse and living walls. Scroll the preview or open the full diagram to inspect the pathway in detail.</p>
        </Reveal>

        <Reveal className="treatment-diagram">
          <div className="treatment-diagram__trigger">
            <div className="treatment-diagram__scroll" role="region" aria-label="Scrollable treatment diagram preview" tabIndex={0}>
              <img src={imageSrc} alt={diagramAlt} loading="lazy" />
            </div>
            <button ref={triggerRef} className="treatment-diagram__action" type="button" aria-label="Enlarge treatment diagram" aria-haspopup="dialog" onClick={() => setIsExpanded(true)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4M11 8v6M8 11h6" /></svg>
              View full diagram
            </button>
          </div>
        </Reveal>
      </div>

      {isExpanded && <div className="treatment-lightbox" role="dialog" aria-modal="true" aria-label="Integrated treatment and reuse diagram" onKeyDown={handleDialogKeyDown} onMouseDown={handleBackdropClick}>
        <button className="treatment-lightbox__close" type="button" aria-label="Close enlarged diagram" autoFocus onClick={closeDiagram}>
          <span aria-hidden="true">×</span>
        </button>
        <div className="treatment-lightbox__canvas">
          <img src={imageSrc} alt={diagramAlt} />
        </div>
      </div>}
    </section>
  )
}
