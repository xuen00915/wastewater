import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
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

  const progress = selectedIndex / (treatmentStages.length - 1)

  return (
    <section className="treatment-pathway section" aria-labelledby="treatment-pathway-title">
      <div className="container">
        <Reveal className="treatment-pathway__intro">
          <p className="section-kicker">How the System Connects</p>
          <h2 id="treatment-pathway-title">How Wastewater Treatment Works</h2>
          <p>This interactive explainer presents a generic research pathway. Individual treatment systems depend on their water, research question and application context.</p>
        </Reveal>
        <div className="treatment-pathway__layout">
          <div className="treatment-pathway__stages" role="tablist" aria-label="Wastewater treatment research stages" style={{ '--treatment-progress': progress } as CSSProperties}>
            {treatmentStages.map((stage, index) => {
              const selected = index === selectedIndex
              return <button ref={(node) => { tabRefs.current[index] = node }} key={stage.id} id={`treatment-tab-${stage.id}`} className={selected ? 'treatment-stage treatment-stage--active' : 'treatment-stage'} type="button" role="tab" aria-label={`${stage.number} ${stage.title}`} aria-selected={selected} aria-controls="treatment-panel" tabIndex={selected ? 0 : -1} onClick={() => selectStage(index)} onKeyDown={handleKeyDown}><span className="treatment-stage__node"><Icon name={stage.icon} size={26} /></span><span className="treatment-stage__number">{stage.number}</span><strong>{stage.title}</strong><small>{stage.summary}</small></button>
            })}
          </div>
          <div id="treatment-panel" className="treatment-pathway__panel" role="tabpanel" aria-live="polite" aria-labelledby={`treatment-tab-${selectedStage.id}`}>
            <span>{selectedStage.number} / 05</span>
            <div><p>{selectedStage.summary}</p><h3>{selectedStage.title}</h3><p>{selectedStage.detail}</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}
