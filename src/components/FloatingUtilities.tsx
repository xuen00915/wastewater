import { PsiSnapshot } from './PsiSnapshot'
import { pageHref } from '../site'

export function FloatingUtilities() {
  return (
    <div className="floating-utilities">
      <a
        className="floating-control live-project-control"
        href={`${pageHref('projects')}#live-project`}
        aria-label="View live project environmental data"
        title="View live project environmental data"
      >
        <i aria-hidden="true" />
        <span>Live Project</span>
        <small>View live data</small>
      </a>
      <PsiSnapshot />
    </div>
  )
}
