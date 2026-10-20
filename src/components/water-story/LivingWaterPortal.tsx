import { useId, type ReactElement } from 'react'
import { interpolatePortalPath } from './waterStoryMath'
import { PortalRippleCanvas } from './PortalRippleCanvas'

const imagePath = `${import.meta.env.BASE_URL}images/home-hero-wastewater.webp`
const lightFramePath = `${import.meta.env.BASE_URL}images/home-water-frame-light.webp`
const imageDescription = 'Representative pilot wastewater treatment system integrated with vegetation'

export function LivingWaterPortal(): ReactElement {
  const reactId = useId().replaceAll(':', '')
  const titleId = `living-water-portal-title-${reactId}`
  const shapeId = `living-water-portal-shape-${reactId}`
  const clipId = `living-water-portal-clip-${reactId}`
  const edgeGradientId = `living-water-edge-${reactId}`
  const highlightGradientId = `living-water-highlight-${reactId}`
  const refractionId = `living-water-refraction-${reactId}`

  return (
    <div className="living-water-portal">
      <div className="living-water-portal__interaction">
        <svg
          className="living-water-portal__visual"
          viewBox="0 0 1000 700"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-labelledby={titleId}
        >
          <title id={titleId}>{imageDescription}</title>
          <defs>
            <clipPath id={clipId}>
              <path
                id={shapeId}
                data-water-mask
                d={interpolatePortalPath(0)}
              />
            </clipPath>
            <linearGradient id={edgeGradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,.72)" />
              <stop offset=".42" stopColor="rgba(14,165,233,.32)" />
              <stop offset="1" stopColor="rgba(45,212,191,.18)" />
            </linearGradient>
            <linearGradient id={highlightGradientId} x1=".08" y1=".12" x2=".9" y2=".8">
              <stop offset="0" stopColor="rgba(255,255,255,.9)" />
              <stop offset=".5" stopColor="rgba(255,255,255,.24)" />
              <stop offset="1" stopColor="rgba(56,189,248,.52)" />
            </linearGradient>
            <filter id={refractionId} x="-8%" y="-8%" width="116%" height="116%">
              <feTurbulence type="fractalNoise" baseFrequency=".009 .018" numOctaves="1" seed="7" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="B" />
            </filter>
          </defs>

          <g clipPath={`url(#${clipId})`}>
            <image
              className="living-water-portal__image"
              href={imagePath}
              width="1000"
              height="700"
              preserveAspectRatio="xMidYMid slice"
            />
            <g
              className="living-water-portal__refraction"
              aria-hidden="true"
              filter={`url(#${refractionId})`}
            >
              <image
                href={imagePath}
                width="1000"
                height="700"
                preserveAspectRatio="xMidYMid slice"
              />
            </g>
          </g>

          <use
            href={`#${shapeId}`}
            className="living-water-portal__edge living-water-portal__edge--outer"
            fill="none"
            stroke={`url(#${edgeGradientId})`}
          />
          <use
            href={`#${shapeId}`}
            className="living-water-portal__edge living-water-portal__edge--highlight"
            fill="none"
            stroke={`url(#${highlightGradientId})`}
          />
        </svg>
        <img
          className="living-water-portal__frame living-water-portal__frame--light"
          src={lightFramePath}
          alt=""
          aria-hidden="true"
        />
        <PortalRippleCanvas />
      </div>

      <div className="living-water-portal__droplets" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <i className={`living-water-portal__droplet living-water-portal__droplet--${index + 1}`} key={index} />
        ))}
      </div>
    </div>
  )
}
