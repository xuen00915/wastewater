import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { treatmentStages } from '../data/content'
import { Icon } from './ui/Icon'
import { Reveal } from './ui/Reveal'
import './treatment-pathway.css'

export function TreatmentPathway() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedStage = treatmentStages[selectedIndex]

  const selectStage = (index: number, moveFocus = false) => {
    const nextIndex = (index + treatmentStages.length) % treatmentStages.length
    setSelectedIndex(nextIndex)
    if (moveFocus) tabRefs.current[nextIndex]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = selectedIndex + 1
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = selectedIndex - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = treatmentStages.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    selectStage(nextIndex, true)
  }

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const compactLayout = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 900px)').matches

    const observer = new IntersectionObserver((entries) => {
      const activeEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!activeEntry) return

      const index = Number((activeEntry.target as HTMLElement).dataset.stageIndex)
      if (Number.isInteger(index)) setSelectedIndex(index)
    }, {
      rootMargin: compactLayout ? '-60% 0px -30% 0px' : '-34% 0px -46% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })

    tabRefs.current.forEach((stage) => {
      if (stage) observer.observe(stage)
    })

    return () => observer.disconnect()
  }, [])

  const progress = (selectedIndex + 1) / treatmentStages.length
  const stageTotal = String(treatmentStages.length).padStart(2, '0')
  const islandStyle = {
    '--treatment-progress': progress,
    '--active-x': `${selectedStage.hotspot.x}%`,
    '--active-y': `${selectedStage.hotspot.y}%`,
    '--focus-shift-x': `${(50 - selectedStage.hotspot.x) * 0.24}%`,
    '--focus-shift-y': `${(50 - selectedStage.hotspot.y) * 0.24}%`,
  } as CSSProperties

  return (
    <section className="treatment-pathway section" aria-labelledby="treatment-pathway-title">
      <div className="container">
        <Reveal className="treatment-pathway__intro">
          <h2 id="treatment-pathway-title">How Wastewater Treatment Works</h2>
          <p>This interactive explainer presents a generic research pathway. Individual treatment systems depend on their water, research question and application context.</p>
        </Reveal>
        <div className="treatment-pathway__layout">
          <div className="treatment-pathway__visual">
            <div className="treatment-island" style={islandStyle}>
              <div className="treatment-island__viewport">
                <div className="treatment-island__scene">
                  <img src={`${import.meta.env.BASE_URL}images/treatment-island.webp`} alt="Isometric wastewater treatment island showing connected treatment, recovery and green-wall zones" loading="lazy" />
                  {treatmentStages.map((stage, index) => {
                    const markerStyle = { '--stage-x': `${stage.hotspot.x}%`, '--stage-y': `${stage.hotspot.y}%` } as CSSProperties
                    return <span key={stage.id} className={index === selectedIndex ? 'treatment-island__marker treatment-island__marker--active' : 'treatment-island__marker'} style={markerStyle} aria-hidden="true"><span>{stage.number}</span></span>
                  })}
                  <span className="treatment-island__wash" aria-hidden="true" />
                </div>
              </div>
              <div className="treatment-island__status" aria-hidden="true">
                <span>Current focus</span>
                <strong>{selectedStage.number} / {stageTotal}&nbsp;&nbsp;{selectedStage.title}</strong>
              </div>
            </div>
          </div>
          <div className="treatment-pathway__stages" role="tablist" aria-label="Wastewater treatment research stages">
            {treatmentStages.map((stage, index) => {
              const selected = index === selectedIndex
              return <article key={stage.id} className={selected ? 'treatment-stage-shell treatment-stage-shell--active' : 'treatment-stage-shell'}>
                <button ref={(node) => { tabRefs.current[index] = node }} id={`treatment-tab-${stage.id}`} className="treatment-stage" type="button" role="tab" data-stage-index={index} aria-label={`${stage.number} ${stage.title}`} aria-selected={selected} aria-controls={`treatment-panel-${stage.id}`} tabIndex={selected ? 0 : -1} onClick={() => selectStage(index)} onKeyDown={handleKeyDown}>
                  <span className="treatment-stage__node"><span>{stage.number}</span></span>
                  <span className="treatment-stage__label"><Icon name={stage.icon} size={21} /><span><strong>{stage.title}</strong><small>{stage.summary}</small></span></span>
                </button>
                <div id={`treatment-panel-${stage.id}`} className="treatment-pathway__panel" role={selected ? 'tabpanel' : undefined} aria-live={selected ? 'polite' : undefined} aria-labelledby={`treatment-tab-${stage.id}`} hidden={!selected}>
                  <h3>{stage.title}</h3>
                  <p>{stage.detail}</p>
                </div>
              </article>
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
