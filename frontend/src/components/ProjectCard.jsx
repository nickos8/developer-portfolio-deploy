import { resolveStorageUrl } from '../api'

export default function ProjectCard({ project }) {
  const imageUrl = resolveStorageUrl(project.image_path)

  return (
    <article className="project-card">
      {imageUrl && (
        <img
          className="project-card-image"
          src={imageUrl}
          alt=""
          loading="lazy"
        />
      )}

      <div className="project-card-body">
        <h3>{project.title}</h3>
        <p>{project.short_description}</p>

        {project.tech_stack?.length > 0 && (
          <ul className="tech-tags" aria-label="Technologies used">
            {project.tech_stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        )}

        <div className="project-card-links">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer">
              Live site
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer">
              Source code
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
