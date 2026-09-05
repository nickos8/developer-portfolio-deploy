import { useEffect, useState } from 'react'
import api, { apiErrorMessage } from '../../api'
import ProjectCard from '../../components/ProjectCard'
import EmptyState from '../../components/states/EmptyState'
import ErrorState from '../../components/states/ErrorState'
import LoadingState from '../../components/states/LoadingState'

export default function ProjectsSection() {
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let ignore = false

    async function loadProjects() {
      try {
        const response = await api.get('/api/projects')

        if (!ignore) {
          setProjects(response.data)
          setStatus('ready')
        }
      } catch (error) {
        if (!ignore) {
          setStatus('error')
          console.error(apiErrorMessage(error, 'Failed to load projects.'))
        }
      }
    }

    loadProjects()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container">
        <h2 id="projects-heading">Projects</h2>

        {status === 'loading' && <LoadingState label="Loading projects..." />}
        {status === 'error' && (
          <ErrorState label="Couldn't load projects right now. Please try again later." />
        )}
        {status === 'ready' && projects.length === 0 && (
          <EmptyState label="No published projects yet -- check back soon." />
        )}

        {status === 'ready' && projects.length > 0 && (
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
