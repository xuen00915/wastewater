import type { CSSProperties, ReactElement } from 'react'

type BubbleStyle = CSSProperties & {
  '--bubble-size': string
  '--bubble-x': string
  '--bubble-delay': string
  '--bubble-duration': string
  '--bubble-travel': string
}

const bubbles: BubbleStyle[] = [
  { '--bubble-size': '4px', '--bubble-x': '8%', '--bubble-delay': '-2s', '--bubble-duration': '9s', '--bubble-travel': '-24vh' },
  { '--bubble-size': '10px', '--bubble-x': '17%', '--bubble-delay': '-6s', '--bubble-duration': '13s', '--bubble-travel': '-31vh' },
  { '--bubble-size': '6px', '--bubble-x': '28%', '--bubble-delay': '-4s', '--bubble-duration': '11s', '--bubble-travel': '-27vh' },
  { '--bubble-size': '16px', '--bubble-x': '39%', '--bubble-delay': '-9s', '--bubble-duration': '16s', '--bubble-travel': '-36vh' },
  { '--bubble-size': '4px', '--bubble-x': '49%', '--bubble-delay': '-1s', '--bubble-duration': '10s', '--bubble-travel': '-25vh' },
  { '--bubble-size': '6px', '--bubble-x': '58%', '--bubble-delay': '-7s', '--bubble-duration': '12s', '--bubble-travel': '-30vh' },
  { '--bubble-size': '10px', '--bubble-x': '67%', '--bubble-delay': '-3s', '--bubble-duration': '14s', '--bubble-travel': '-34vh' },
  { '--bubble-size': '4px', '--bubble-x': '76%', '--bubble-delay': '-8s', '--bubble-duration': '11s', '--bubble-travel': '-26vh' },
  { '--bubble-size': '16px', '--bubble-x': '86%', '--bubble-delay': '-5s', '--bubble-duration': '17s', '--bubble-travel': '-38vh' },
  { '--bubble-size': '6px', '--bubble-x': '93%', '--bubble-delay': '-10s', '--bubble-duration': '13s', '--bubble-travel': '-29vh' },
]

export function WaterSurface(): ReactElement {
  return (
    <div className="water-surface" aria-hidden="true">
      <div className="water-surface__line">
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" focusable="false">
          <path
            className="water-surface__wave water-surface__wave--shadow"
            d="M0 21 C118 10 198 31 316 20 S520 8 638 21 S836 33 958 18 S1162 8 1284 23 S1382 25 1440 17"
          />
          <path
            className="water-surface__wave water-surface__wave--highlight"
            d="M0 16 C96 26 214 7 326 17 S528 29 650 15 S850 7 974 20 S1178 29 1296 14 S1392 12 1440 20"
          />
        </svg>
      </div>

      <div className="water-surface__underwater">
        <div className="water-surface__refraction" />
        <div className="water-surface__rays" />
        <div className="water-surface__caustics" />
        <div className="water-surface__bubbles">
          {bubbles.map((style, index) => (
            <i className={`water-surface__bubble water-surface__bubble--${index + 1}`} style={style} key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
