import { useEffect, useState } from 'react'
import {
  ENVIRONMENTAL_SOURCE_URL,
  environmentalFeedMeta,
  loadEnvironmentalConditions,
  type EnvironmentalFeedResult,
  type EnvironmentalFeedKey,
} from '../data/environmentalConditions'
import { Icon } from './ui/Icon'
import { Reveal } from './ui/Reveal'

const icons: Record<EnvironmentalFeedKey, Parameters<typeof Icon>[0]['name']> = {
  rainfall: 'water',
  temperature: 'treatment',
  humidity: 'water',
  wbgt: 'treatment',
  pm25: 'recovery',
  floods: 'water',
}

type FeedState = EnvironmentalFeedResult | {
  status: 'loading'
  key: EnvironmentalFeedKey
  title: string
}

function formatSingaporeTime(timestamp: string) {
  return new Intl.DateTimeFormat('en-SG', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Singapore',
  }).format(new Date(timestamp))
}

export function OngoingProjectPanel() {
  const [feeds, setFeeds] = useState<FeedState[]>(() => environmentalFeedMeta.map(({ key, title }) => ({
    status: 'loading',
    key,
    title,
  })))

  useEffect(() => {
    const controller = new AbortController()

    loadEnvironmentalConditions(controller.signal)
      .then(setFeeds)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setFeeds(environmentalFeedMeta.map(({ key, title }) => ({ status: 'error', key, title })))
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (window.location.hash !== '#live-project') return
    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById('live-project')
      if (typeof section?.scrollIntoView === 'function') section.scrollIntoView({ block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <section id="live-project" className="ongoing-project section" aria-labelledby="ongoing-project-title">
      <div className="container">
        <Reveal className="ongoing-project__header">
          <div>
            <h2 id="ongoing-project-title">Current Ongoing Project</h2>
            <p>Official Singapore environmental observations provide live context while verified project monitoring is prepared for future integration.</p>
          </div>
          <span className="ongoing-project__status"><i aria-hidden="true" />Official live data</span>
        </Reveal>

        <Reveal className="ongoing-project__panel ongoing-project__panel--data">
          <div className="ongoing-project__content">
            <div className="ongoing-project__data-heading">
              <div>
                <h3>Live Singapore Environmental Conditions</h3>
                <p>Near-real-time public observations supporting environmental context for water and green-infrastructure work.</p>
              </div>
              <span>Singapore overview</span>
            </div>

            <div className="environmental-grid" role="list" aria-live="polite">
              {feeds.map((feed) => (
                <article className="environmental-card" role="listitem" data-state={feed.status} key={feed.key}>
                  <div className="environmental-card__top">
                    <Icon name={icons[feed.key]} size={32} />
                    <h4>{feed.title}</h4>
                  </div>

                  {feed.status === 'loading' && <p className="environmental-card__message">Loading latest reading…</p>}
                  {feed.status === 'error' && <p className="environmental-card__message">Live data temporarily unavailable</p>}
                  {feed.status === 'ready' && (
                    <>
                      <p className="environmental-card__reading"><strong>{feed.value}</strong><span>{feed.unit}</span></p>
                      <p className="environmental-card__context">{feed.context}</p>
                      <time dateTime={feed.updatedAt}>Updated {formatSingaporeTime(feed.updatedAt)} SGT</time>
                    </>
                  )}
                </article>
              ))}
            </div>

            <footer className="ongoing-project__source">
              <p>These official observations provide environmental context and are not E &amp; ST project measurements.</p>
              <a href={ENVIRONMENTAL_SOURCE_URL} target="_blank" rel="noreferrer">Source: NEA, MSS and PUB via data.gov.sg <span aria-hidden="true">↗</span></a>
            </footer>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
