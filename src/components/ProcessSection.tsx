import { useEffect, useRef, useState } from 'react'
import { processStages } from '../data/content'
import { Icon } from './ui/Icon'
import { SectionHeading } from './ui/SectionHeading'

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
      <div className="container">
        <SectionHeading id="process-title" align="center" title="From Wastewater to Greener Buildings" description="One connected research pathway linking treatment, recovery and green infrastructure." />
        <ol className="process__flow" aria-label="Circular water research pathway">
          {processStages.map((stage) => (
            <li key={stage.number} tabIndex={0}>
              <div className="process__node"><Icon name={stage.icon} size={28} /></div>
              <span className="process__number">{stage.number}</span>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
