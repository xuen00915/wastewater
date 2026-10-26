import { forwardRef, type CSSProperties } from 'react'
import { bubbleSettings } from './deepDiveMath'

export const DeepDiveOverlay = forwardRef<HTMLDivElement>(function DeepDiveOverlay(_, ref) {
  return (
    <div
      ref={ref}
      className="east-deep-dive"
      aria-hidden="true"
      style={{
        '--east-dive-tint': 0,
        '--east-dive-rays': 0,
        '--east-dive-bubbles': 0,
        '--east-dive-ray-shift': '0px',
      } as CSSProperties}
    >
      <div className="east-deep-dive__tint" aria-hidden="true" />
      <div className="east-deep-dive__haze" aria-hidden="true" />
      <div className="east-deep-dive__rays" aria-hidden="true">
        <div className="east-deep-dive__ray east-deep-dive__ray--one" />
        <div className="east-deep-dive__ray east-deep-dive__ray--two" />
        <div className="east-deep-dive__ray east-deep-dive__ray--three" />
      </div>
      <div className="east-deep-dive__bubbles" aria-hidden="true">
        {bubbleSettings.map(([xPercent, yPercent, diameter], index) => (
          <span
            className="east-deep-dive__bubble"
            aria-hidden="true"
            key={`${xPercent}-${yPercent}-${diameter}-${index}`}
            style={{
              left: `${xPercent}%`,
              top: `${yPercent}%`,
              width: `${diameter}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
})
