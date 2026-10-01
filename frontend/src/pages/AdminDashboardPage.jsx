import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'

import { getIssueStats } from '../services/issueService.js'

import './AdminDashboardPage.css'

function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const result = await getIssueStats()
        setStats(result)
      } catch (err) {
        setError(
          err.message || 'Failed to load dashboard statistics.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <AppLayout>
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-header">
          <div>
            <span className="page-eyebrow">ADMINISTRATION</span>

            <h1>Admin Dashboard</h1>

            <p>
              Overview of service requests and their current status
              in ResolveAI.
            </p>
          </div>

          <Link
            to="/admin/issues"
            className="admin-dashboard-action"
          >
            View All Issues
          </Link>
        </div>

        {error ? (
          <Alert type="error">{error}</Alert>
        ) : null}

        {loading ? (
          <LoadingState />
        ) : (
          <>
            <div className="admin-dashboard-section-header">
              <div>
                <h2>Issue Overview</h2>
                <p>
                  Monitor the current workload across all service
                  requests.
                </p>
              </div>
            </div>

            <div className="dashboard-stats">
              <Link
                to="/admin/issues"
                className="stat-card stat-card-total"
              >
                <div className="stat-card-top">
                  <span className="stat-label">Total Issues</span>
                  <span className="stat-icon">≡</span>
                </div>

                <h2>{stats.total}</h2>

                <p>All service requests</p>
              </Link>

              <Link
                to="/admin/issues?status=OPEN"
                className="stat-card stat-card-open"
              >
                <div className="stat-card-top">
                  <span className="stat-label">Open</span>
                  <span className="stat-icon">!</span>
                </div>

                <h2>{stats.open}</h2>

                <p>Awaiting action</p>
              </Link>

              <Link
                to="/admin/issues?status=IN_PROGRESS"
                className="stat-card stat-card-progress"
              >
                <div className="stat-card-top">
                  <span className="stat-label">In Progress</span>
                  <span className="stat-icon">↻</span>
                </div>

                <h2>{stats.inProgress}</h2>

                <p>Currently being handled</p>
              </Link>

              <Link
                to="/admin/issues?status=RESOLVED"
                className="stat-card stat-card-resolved"
              >
                <div className="stat-card-top">
                  <span className="stat-label">Resolved</span>
                  <span className="stat-icon">✓</span>
                </div>

                <h2>{stats.resolved}</h2>

                <p>Successfully resolved</p>
              </Link>

              <Link
                to="/admin/issues?status=CLOSED"
                className="stat-card stat-card-closed"
              >
                <div className="stat-card-top">
                  <span className="stat-label">Closed</span>
                  <span className="stat-icon">—</span>
                </div>

                <h2>{stats.closed}</h2>

                <p>Completed requests</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}

export default AdminDashboardPage