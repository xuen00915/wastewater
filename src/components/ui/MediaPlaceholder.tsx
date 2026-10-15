import { useState } from 'react'
import { Icon, type IconName } from './Icon'

type MediaPlaceholderProps = {
  src: string
  alt: string
  requiredFilename?: string
  className?: string
  icon?: IconName
}

export function MediaPlaceholder({ src, alt, requiredFilename = src, className = '', icon = 'water' }: MediaPlaceholderProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`media ${className}`.trim()}>
      {!failed ? <img src={src} alt={alt} onError={() => setFailed(true)} /> : (
        <div className="media__fallback" role="img" aria-label={alt}>
          <Icon name={icon} size={34} />
          <span>{alt}</span>
          <small>{requiredFilename}</small>
        </div>
      )}
    </div>
  )
}
