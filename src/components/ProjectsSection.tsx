import { projects } from '../data/content'
import { MediaPlaceholder } from './ui/MediaPlaceholder'
import { Reveal } from './ui/Reveal'

export function ProjectsSection() {
  return <section className="projects section" id="projects" aria-labelledby="projects-title"><div className="container">
    <Reveal className="projects__header"><div><p className="section-kicker">04 / Projects</p><h2 id="projects-title">Research Beyond the Laboratory</h2></div><p className="projects__availability">Verified project details will be added as research information becomes available.</p></Reveal>
    <div className="projects__grid" data-testid="projects">{projects.map((project, index) => <Reveal key={project.title} delay={index * 90}><article className="project-card">
      <MediaPlaceholder src={project.image} alt={project.alt} requiredFilename={project.image} icon={index === 1 ? 'solids' : index === 2 ? 'leaf' : 'water'} />
      <div className="project-card__body"><h3>{project.title}</h3><p>{project.description}</p><dl><div><dt>Type</dt><dd>{project.type}</dd></div><div><dt>Status</dt><dd><i className={`status-dot status-dot--${project.status.toLowerCase()}`} />{project.status}</dd></div></dl><span className="project-card__availability">Project details coming soon</span></div>
    </article></Reveal>)}</div>
  </div></section>
}
