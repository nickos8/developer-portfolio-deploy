import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { apiErrorMessage } from '../api'
import { useAuth } from '../context/useAuth'
import ProjectForm from '../components/ProjectForm'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'

export default function AdminDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [editingProject, setEditingProject] = useState(null) // null | {} | project
  const [deletingId, setDeletingId] = useState(null)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    setStatus('loading')

    try {
      const response = await api.get('/api/admin/projects')
      setProjects(response.data)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  function handleSaved() {
    setEditingProject(null)
    loadProjects()
  }

  async function handleDelete(project) {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) {
      return
    }

    setDeletingId(project.id)
    setActionError('')

    try {
      await api.delete(`/api/projects/${project.id}`)
      setProjects((current) => current.filter((item) => item.id !== project.id))
    } catch (error) {
      setActionError(apiErrorMessage(error, 'Failed to delete the project.'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="admin-dashboard">
      <div className="container">
        <header className="admin-header">
          <div>
            <h1>Projects</h1>
            <p>Signed in as {user?.name}</p>
          </div>
          <button type="button" className="button" onClick={handleLogout}>
            Log out
          </button>
        </header>

        {editingProject ? (
          <section className="admin-panel">
            <h2>{editingProject.id ? 'Edit project' : 'New project'}</h2>
            <ProjectForm
              project={editingProject}
              onSaved={handleSaved}
              onCancel={() => setEditingProject(null)}
            />
          </section>
        ) : (
          <button type="button" className="button button-primary" onClick={() => setEditingProject({})}>
            + New project
          </button>
        )}

        {actionError && (
          <p className="form-error" role="alert">
            {actionError}
          </p>
        )}

        {status === 'loading' && <LoadingState label="Loading projects..." />}
        {status === 'error' && (
          <ErrorState label="Couldn't load projects. Please refresh the page." />
        )}
        {status === 'ready' && projects.length === 0 && (
          <EmptyState label="No projects yet. Create your first one above." />
        )}

        {status === 'ready' && projects.length > 0 && (
          <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Order</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>
                    {project.is_published ? 'Published' : 'Draft'}
                    {project.is_featured ? ' · Featured' : ''}
                  </td>
                  <td>{project.display_order}</td>
                  <td className="admin-table-actions">
                    <button type="button" className="button" onClick={() => setEditingProject(project)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => handleDelete(project)}
                      disabled={deletingId === project.id}
                    >
                      {deletingId === project.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </main>
  )
}
