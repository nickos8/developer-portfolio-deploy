import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AdminProjectsPanel from '../components/AdminProjectsPanel'
import SiteProfileForm from '../components/SiteProfileForm'

const TABS = [
  { id: 'projects', label: 'Projects' },
  { id: 'profile', label: 'Profile' },
]

export default function AdminDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('projects')

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <main className="admin-dashboard">
      <div className="container">
        <header className="admin-header">
          <div>
            <h1>Admin</h1>
            <p>Signed in as {user?.name}</p>
          </div>
          <button type="button" className="button" onClick={handleLogout}>
            Log out
          </button>
        </header>

        <div className="admin-tabs" role="tablist" aria-label="Admin sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className="admin-tab"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'projects' && <AdminProjectsPanel />}
        {activeTab === 'profile' && (
          <section className="admin-panel">
            <h2>Public site profile</h2>
            <p className="admin-panel-hint">
              This is what visitors see in the Hero, About, Skills, and Contact sections. Changes here go
              live immediately -- no redeploy needed.
            </p>
            <SiteProfileForm />
          </section>
        )}
      </div>
    </main>
  )
}
