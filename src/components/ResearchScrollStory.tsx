import { useEffect, useRef, useState } from 'react'
import {
  defaultResearchChapterId,
  isResearchChapterId,
  monitoringAcrossSystem,
  researchChapters,
  type ResearchChapter,
  type ResearchChapterId,
} from '../data/researchProgramme'
import { Icon } from './ui/Icon'
import { MediaPlaceholder } from './ui/MediaPlaceholder'
import { SectionHeading } from './ui/SectionHeading'

function explicitChapterFromHash(): ResearchChapterId | null {
  if (typeof window === 'undefined') return null
  const fragment = window.location.hash.slice(1)
  return isResearchChapterId(fragment) ? fragment : null
}

function chapterFromHash(): ResearchChapterId {
  return explicitChapterFromHash() ?? defaultResearchChapterId
}

function ResearchChapterArticle({ chapter, active, register }: {
  chapter: ResearchChapter
  active: boolean
  register: (node: HTMLElement | null) => void
}) {
  return (
    <article
      className={`research-story__chapter${active ? ' research-story__chapter--active' : ''}`}
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      ref={register}
    >
      <div className="research-story__chapter-header">
        <div className="research-story__chapter-title">
          <span>{chapter.number}</span>
          <Icon name={chapter.icon} size={30} />
          <h3 id={`${chapter.id}-title`}>{chapter.title}</h3>
          <p>{chapter.purpose}</p>
        </div>
        <MediaPlaceholder src={chapter.image} alt={chapter.alt} icon={chapter.icon} />
      </div>

      <div className="research-story__chapter-body">
        <section className="research-story__pathway" aria-labelledby={`${chapter.id}-pathway-title`}>
          <h4 id={`${chapter.id}-pathway-title`}>Treatment pathway</h4>
          <ol aria-label={`${chapter.title} treatment pathway`}>
            {chapter.pathway.map((step, index) => (
              <li key={step.title} aria-label={`Step ${index + 1}: ${step.title}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{step.title}</strong><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <div className="research-story__lists">
          <section aria-labelledby={`${chapter.id}-questions-title`}>
            <h4 id={`${chapter.id}-questions-title`}>Research questions</h4>
            <ul>{chapter.questions.map((question) => <li key={question}>{question}</li>)}</ul>
          </section>
          <section aria-labelledby={`${chapter.id}-evidence-title`}>
            <h4 id={`${chapter.id}-evidence-title`}>Evidence being evaluated</h4>
            <ul>{chapter.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </div>

        <section className="research-story__foundation" aria-labelledby={`${chapter.id}-foundation-title`}>
          <div>
            <h4 id={`${chapter.id}-foundation-title`}>Published foundation</h4>
            <p>{chapter.foundation}</p>
            <p className="research-story__status">{chapter.statusNote}</p>
          </div>
          <ul>
            {chapter.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  <strong>{source.title}</strong>
                  <span>{source.citation}</span>
                  <Icon name="arrow" size={17} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}

export function ResearchScrollStory() {
  const [initialDeepLink] = useState<ResearchChapterId | null>(explicitChapterFromHash)
  const [activeId, setActiveId] = useState<ResearchChapterId>(() => initialDeepLink ?? defaultResearchChapterId)
  const chapterElements = useRef(new Map<ResearchChapterId, HTMLElement>())
  const indexElement = useRef<HTMLElement | null>(null)
  const deepLinkPending = useRef(initialDeepLink !== null)

  useEffect(() => {
    const deepLinkedChapter = initialDeepLink
    if (!deepLinkedChapter) {
      deepLinkPending.current = false
      return
    }

    let cancelled = false
    let layoutFrame = 0
    let settleFrame = 0
    let releaseFrame = 0
    const positionDeepLink = () => {
      if (cancelled) return
      layoutFrame = window.requestAnimationFrame(() => {
        settleFrame = window.requestAnimationFrame(() => {
          chapterElements.current.get(deepLinkedChapter)?.scrollIntoView({
            block: 'start',
            behavior: 'instant' as ScrollBehavior,
          })
          releaseFrame = window.requestAnimationFrame(() => {
            deepLinkPending.current = false
          })
        })
      })
    }

    if (document.fonts?.status === 'loading') void document.fonts.ready.then(positionDeepLink)
    else positionDeepLink()

    return () => {
      cancelled = true
      if (layoutFrame) window.cancelAnimationFrame(layoutFrame)
      if (settleFrame) window.cancelAnimationFrame(settleFrame)
      if (releaseFrame) window.cancelAnimationFrame(releaseFrame)
    }
  }, [initialDeepLink])

  useEffect(() => {
    const syncToHash = () => setActiveId(chapterFromHash())
    window.addEventListener('hashchange', syncToHash)
    return () => window.removeEventListener('hashchange', syncToHash)
  }, [])

  useEffect(() => {
    if (window.innerWidth > 760) return
    let cancelled = false
    const revealActiveTitle = () => {
      if (cancelled) return
      const index = indexElement.current
      const activeLink = index?.querySelector<HTMLElement>(`a[href="#${activeId}"]`)
      if (!index || !activeLink) return
      const centeredLeft = activeLink.offsetLeft - (index.clientWidth - activeLink.offsetWidth) / 2
      const maximumLeft = Math.max(0, index.scrollWidth - index.clientWidth)
      index.scrollTo({ left: Math.min(maximumLeft, Math.max(0, centeredLeft)), behavior: 'auto' })
    }

    if (document.fonts?.status === 'loading') void document.fonts.ready.then(revealActiveTitle)
    else revealActiveTitle()
    return () => { cancelled = true }
  }, [activeId])

  useEffect(() => {
    if (typeof window.IntersectionObserver !== 'function') return

    let measureFrame = 0
    let measureScheduled = false
    const measureActiveChapter = () => {
      measureFrame = 0
      measureScheduled = false
      if (deepLinkPending.current) return
      const zoneTop = window.innerHeight * 0.3
      const zoneBottom = window.innerHeight * 0.45
      const visible = researchChapters
        .map((chapter) => {
          const rectangle = chapterElements.current.get(chapter.id)?.getBoundingClientRect()
          const overlap = rectangle
            ? Math.max(0, Math.min(rectangle.bottom, zoneBottom) - Math.max(rectangle.top, zoneTop))
            : 0
          return { id: chapter.id, overlap }
        })
        .filter((chapter) => chapter.overlap > 0)
        .sort((a, b) => {
          const overlapDifference = b.overlap - a.overlap
          if (overlapDifference !== 0) return overlapDifference
          return researchChapters.findIndex((chapter) => chapter.id === a.id)
            - researchChapters.findIndex((chapter) => chapter.id === b.id)
        })
      const nextId = visible[0]?.id
      if (!nextId || !isResearchChapterId(nextId)) return

      setActiveId((currentId) => {
        if (currentId === nextId) return currentId
        const nextUrl = `${window.location.pathname}${window.location.search}#${nextId}`
        window.history.replaceState(window.history.state, '', nextUrl)
        return nextId
      })
    }
    const scheduleMeasurement = () => {
      if (deepLinkPending.current) return
      if (measureScheduled) return
      measureScheduled = true
      measureFrame = window.requestAnimationFrame(measureActiveChapter)
    }
    const observer = new window.IntersectionObserver(scheduleMeasurement, {
      rootMargin: '-30% 0px -55% 0px',
      threshold: 0,
    })

    chapterElements.current.forEach((element) => observer.observe(element))
    window.addEventListener('scroll', scheduleMeasurement, { passive: true })
    window.addEventListener('resize', scheduleMeasurement)
    scheduleMeasurement()
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', scheduleMeasurement)
      window.removeEventListener('resize', scheduleMeasurement)
      if (measureFrame) window.cancelAnimationFrame(measureFrame)
    }
  }, [])

  return (
    <section className="research-story section" aria-labelledby="research-story-title">
      <div className="container">
        <SectionHeading
          id="research-story-title"
          align="center"
          title={<><span>Three Research Areas.</span>{' '}<span>One Circular System.</span></>}
          description="Begin with the full research programme, then continue scrolling to follow each treatment pathway in detail."
        />

        <div className="research-story__overview" id="research-overview">
          {researchChapters.map((chapter) => (
            <a className="research-story__overview-card" href={`#${chapter.id}`} key={chapter.id}>
              <span className="research-story__overview-media" aria-hidden="true"><img src={chapter.image} alt="" loading="lazy" decoding="async" /></span>
              <span className="research-story__overview-body">
                <span className="research-story__overview-meta"><span>{chapter.number}</span><Icon name={chapter.icon} size={25} /></span>
                <strong>{chapter.title}</strong>
                <span>{chapter.shortDescription}</span>
              </span>
            </a>
          ))}
        </div>

        <div className="research-story__detail" id="research-programme-detail">
          <nav className="research-story__index" aria-label="Research programme sections" ref={indexElement}>
            <p>Research Programme in Detail</p>
            <ol>
              {researchChapters.map((chapter) => {
                const active = chapter.id === activeId
                return (
                  <li key={chapter.id}>
                    <a className={active ? 'research-story__index-link research-story__index-link--active' : 'research-story__index-link'} href={`#${chapter.id}`} aria-current={active ? 'location' : undefined}>
                      <span aria-hidden="true">{chapter.number}</span>
                      <Icon name={chapter.icon} size={24} />
                      <strong>{chapter.title}</strong>
                    </a>
                  </li>
                )
              })}
            </ol>
          </nav>

          <div className="research-story__chapters">
            {researchChapters.map((chapter) => (
              <ResearchChapterArticle
                chapter={chapter}
                active={chapter.id === activeId}
                key={chapter.id}
                register={(node) => {
                  if (node) chapterElements.current.set(chapter.id, node)
                  else chapterElements.current.delete(chapter.id)
                }}
              />
            ))}
          </div>
        </div>

        <aside className="research-monitoring" aria-labelledby="research-monitoring-title">
          <Icon name="flask" size={28} />
          <div><h3 id="research-monitoring-title">Monitoring Across the System</h3><p>{monitoringAcrossSystem}</p></div>
        </aside>
      </div>
    </section>
  )
}
