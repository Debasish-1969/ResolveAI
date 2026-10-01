import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { getMyIssues } from '../services/issueService.js'
import { ISSUE_STATUSES, ROUTES } from '../utils/constants.js'
import './UserDashboardPage.css'

function UserDashboardPage() {
  const { user } = useContext(AuthContext)

  const [userIssues, setUserIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadUserIssues() {
      try {
        setLoading(true)
        setError('')

        const response = await getMyIssues()

        setUserIssues(response || [])
      } catch (err) {
        setError(err.message || 'Failed to load your issues.')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadUserIssues()
    }
  }, [user])

  const openIssues = userIssues.filter(
    (issue) => issue.status === ISSUE_STATUSES.OPEN,
  ).length

  const inProgressIssues = userIssues.filter(
    (issue) => issue.status === ISSUE_STATUSES.IN_PROGRESS,
  ).length

  const resolvedIssues = userIssues.filter(
    (issue) => issue.status === ISSUE_STATUSES.RESOLVED,
  ).length

  const recentIssues = [...userIssues]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)

  return (
    <AppLayout>
      <div className="dashboard-page">
        <section className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">USER DASHBOARD</p>

            <h1>
              Welcome, {user?.name || 'User'}!
            </h1>

            <p className="dashboard-description">
              Here is an overview of your service requests.
            </p>
          </div>

          <div className="dashboard-actions">
            <Link
              to={ROUTES.RAISE_ISSUE}
              className="dashboard-primary-action"
            >
              + Raise New Issue
            </Link>

            <Link
              to={ROUTES.ISSUES}
              className="dashboard-secondary-action"
            >
              View My Issues
            </Link>
          </div>
        </section>

        {loading && (
          <div className="dashboard-message">
            Loading your issues...
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-card-label">
              Total Issues
            </div>

            <div className="stat-card-value">
              {userIssues.length}
            </div>

            <div className="stat-card-description">
              All submitted requests
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">
              Open
            </div>

            <div className="stat-card-value">
              {openIssues}
            </div>

            <div className="stat-card-description">
              Awaiting resolution
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">
              In Progress
            </div>

            <div className="stat-card-value">
              {inProgressIssues}
            </div>

            <div className="stat-card-description">
              Currently being handled
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-label">
              Resolved
            </div>

            <div className="stat-card-value">
              {resolvedIssues}
            </div>

            <div className="stat-card-description">
              Successfully resolved
            </div>
          </div>
        </section>

        <section className="recent-issues">
          <div className="section-heading">
            <div>
              <h2>Recent Issues</h2>

              <p>
                Your latest service requests
              </p>
            </div>

            <Link to={ROUTES.ISSUES}>
              View all
            </Link>
          </div>

          {recentIssues.length === 0 ? (
            <div className="recent-issues-empty">
              <div className="empty-icon">+</div>

              <h3>No issues yet</h3>

              <p>
                You haven't raised any service requests.
              </p>

              <Link to={ROUTES.RAISE_ISSUE}>
                Raise your first issue
              </Link>
            </div>
          ) : (
            <div className="recent-issues-list">
              {recentIssues.map((issue) => (
                <div
                  className="recent-issue-card"
                  key={issue.id}
                >
                  <div className="recent-issue-main">
                    <h3>{issue.title}</h3>

                    <p className="recent-issue-description">
                      {issue.description}
                    </p>
                  </div>

                  <div className="recent-issue-meta">
                    <span className="issue-status">
                      {issue.status}
                    </span>

                    <span className="issue-priority">
                      {issue.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  )
}

export default UserDashboardPage