import { useEffect, useRef, useState } from 'react'
import { processStages } from '../data/content'
import { Icon } from './ui/Icon'
import { SectionHeading } from './ui/SectionHeading'

const processDiagram = `${import.meta.env.BASE_URL}images/integrated-treatment-reuse-diagram.webp`

export function ProcessSection() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!('IntersectionObserver' in window) || !ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className={`process section${active ? ' process--active' : ''}`} id="process" aria-labelledby="process-title">
      <div className="process__layout container">
        <div className="process__narrative">
          <div className="process__intro">
            <span className="process__eyebrow">Integrated water system</span>
            <SectionHeading id="process-title" title="From Wastewater to Greener Buildings" description="One connected research pathway linking treatment, recovery and green infrastructure." />
          </div>

          <ol className="process__flow" aria-label="Circular water research pathway">
            {processStages.map((stage) => (
              <li key={stage.number} tabIndex={0}>
                <div className="process__node"><Icon name={stage.icon} size={22} /></div>
                <div className="process__stage-copy">
                  <span className="process__number">{stage.number}</span>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <figure className="process__diagram">
          <div className="process__diagram-frame">
            <img
              src={processDiagram}
              width="938"
              height="1677"
              loading="lazy"
              decoding="async"
              alt="Integrated in-situ treatment and reuse of municipal wastewater on living walls"
            />
          </div>
          <figcaption>Integrated treatment, resource recovery and reuse pathway</figcaption>
        </figure>
      </div>
    </section>
  )
}
