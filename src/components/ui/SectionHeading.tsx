import type { ElementType } from 'react'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  level?: 2 | 3
  align?: 'left' | 'center'
  inverted?: boolean
}

export function SectionHeading({ eyebrow, title, description, level = 2, align = 'left', inverted = false }: SectionHeadingProps) {
  const Heading = `h${level}` as ElementType
  return (
    <header className={`section-heading section-heading--${align}${inverted ? ' section-heading--inverted' : ''}`}>
      {eyebrow && <p className="section-heading__eyebrow">{eyebrow}</p>}
      <Heading>{title}</Heading>
      {description && <p className="section-heading__description">{description}</p>}
    </header>
  )
}
