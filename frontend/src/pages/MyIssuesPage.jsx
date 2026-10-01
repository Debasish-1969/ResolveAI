import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import Alert from '../components/ui/Alert.jsx'

import { AuthContext } from '../context/AuthContext.jsx'
import { getMyIssues } from '../services/issueService.js'

import './MyIssuesPage.css'

function MyIssuesPage() {
  const { user } = useContext(AuthContext)

  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadIssues() {
      try {
        setLoading(true)
        setError('')

        const result = await getMyIssues({
          userId: user?.id,
        })

        setIssues(result)
      } catch (err) {
        setError(err.message || 'Failed to load your issues.')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadIssues()
    } else {
      setLoading(false)
    }
  }, [user])

  return (
    <AppLayout>
      <div className="my-issues-page">
        <section className="my-issues-header">
          <div>
            <p className="my-issues-eyebrow">
              SERVICE REQUESTS
            </p>

            <h1>My Issues</h1>

            <p className="my-issues-description">
              View and track all the service requests you have raised.
            </p>
          </div>

          <Link
            to="/issues/new"
            className="my-issues-new-button"
          >
            + Raise New Issue
          </Link>
        </section>

        {error ? <Alert type="error">{error}</Alert> : null}

        {loading ? (
          <div className="my-issues-state">
            <LoadingState />
          </div>
        ) : issues.length === 0 ? (
          <div className="my-issues-empty">
            <div className="my-issues-empty-icon">+</div>

            <h2>No issues yet</h2>

            <p>
              You have not raised any service requests yet.
            </p>

            <Link to="/issues/new">
              Raise your first issue
            </Link>
          </div>
        ) : (
          <section className="issues-list-section">
            <div className="issues-list-header">
              <div>
                <h2>Your Requests</h2>
                <span>
                  {issues.length} issue
                  {issues.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="issues-list">
              {issues.map((issue) => (
                <article
                  className="issue-card"
                  key={issue.id}
                >
                  <div className="issue-card-content">
                    <div className="issue-card-main">
                      <h2>{issue.title}</h2>

                      <p className="issue-description">
                        {issue.description}
                      </p>
                    </div>

                    <div className="issue-card-badges">
                      <span className="issue-status-badge">
                        {issue.status}
                      </span>

                      <span className="issue-priority-badge">
                        {issue.priority}
                      </span>
                    </div>
                  </div>

                  <div className="issue-card-footer">
                    <div className="issue-category">
                      <span>Category</span>
                      <strong>{issue.category}</strong>
                    </div>

                    <Link
                      to={`/issues/${issue.id}`}
                      className="issue-details-link"
                    >
                      View Details →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  )
}

export default MyIssuesPage