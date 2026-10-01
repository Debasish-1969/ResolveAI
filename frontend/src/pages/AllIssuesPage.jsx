import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import Select from '../components/ui/Select.jsx'

import {
  getAllIssues,
  updateIssue,
} from '../services/issueService.js'

import {
  ISSUE_PRIORITIES,
  ISSUE_STATUSES,
} from '../utils/constants.js'

import './AllIssuesPage.css'

function AllIssuesPage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchParams] = useSearchParams()
  const selectedStatus = searchParams.get('status')

  async function loadIssues() {
    try {
      setLoading(true)
      setError('')

      const result = await getAllIssues(
        selectedStatus
          ? { status: selectedStatus }
          : {},
      )

      setIssues(result)
    } catch (err) {
      setError(err.message || 'Failed to load issues.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIssues()
  }, [selectedStatus])

  async function handleUpdate(issueId, field, value) {
    try {
      const updatedIssue = await updateIssue(issueId, {
        [field]: value,
      })

      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === issueId
            ? { ...issue, ...updatedIssue }
            : issue,
        ),
      )
    } catch (err) {
      setError(err.message || 'Failed to update issue.')
    }
  }

  const statusOptions = Object.values(ISSUE_STATUSES).map(
    (value) => ({
      value,
      label: value,
    }),
  )

  const priorityOptions = Object.values(ISSUE_PRIORITIES).map(
    (value) => ({
      value,
      label: value,
    }),
  )

  return (
    <AppLayout>
      <div className="all-issues-page">
        <div className="all-issues-header">
          <div>
            <span className="page-eyebrow">
              ISSUE MANAGEMENT
            </span>

            <h1>
              {selectedStatus
                ? `${selectedStatus} Issues`
                : 'All Issues'}
            </h1>

            <p>
              Manage and update service requests submitted by
              users.
            </p>
          </div>

          {selectedStatus ? (
            <Link
              to="/admin/issues"
              className="all-issues-back-link"
            >
              View All Issues
            </Link>
          ) : null}
        </div>

        {error ? (
          <Alert type="error">{error}</Alert>
        ) : null}

        {loading ? (
          <LoadingState />
        ) : issues.length === 0 ? (
          <div className="issues-empty-state">
            <h2>No issues found</h2>
            <p>
              There are currently no service requests matching
              this view.
            </p>
          </div>
        ) : (
          <div className="issues-list">
            {issues.map((issue) => (
              <div className="issue-card" key={issue.id}>
                <div className="issue-card-header">
                  <div>
                    <span className="issue-id">
                      #{issue.id}
                    </span>

                    <h2>{issue.title}</h2>
                  </div>

                  <span
                    className={`issue-status issue-status-${issue.status.toLowerCase()}`}
                  >
                    {issue.status}
                  </span>
                </div>

                <p className="issue-description">
                  {issue.description}
                </p>

                <div className="issue-meta">
                  <div>
                    <span>Created By</span>

                    <strong>
                      {typeof issue.createdBy === 'object'
                        ? issue.createdBy?.name
                        : issue.createdBy}
                    </strong>
                  </div>

                  <div>
                    <span>Category</span>

                    <strong>{issue.category}</strong>
                  </div>
                </div>

                <div className="issue-controls">
                  <div className="issue-control">
                    <Select
                      id={`status-${issue.id}`}
                      label="Status"
                      name="status"
                      value={issue.status}
                      onChange={(event) =>
                        handleUpdate(
                          issue.id,
                          'status',
                          event.target.value,
                        )
                      }
                      options={statusOptions}
                    />
                  </div>

                  <div className="issue-control">
                    <Select
                      id={`priority-${issue.id}`}
                      label="Priority"
                      name="priority"
                      value={issue.priority}
                      onChange={(event) =>
                        handleUpdate(
                          issue.id,
                          'priority',
                          event.target.value,
                        )
                      }
                      options={priorityOptions}
                    />
                  </div>
                </div>

                <div className="issue-card-footer">
                  <Link
                    to={`/issues/${issue.id}`}
                    className="issue-details-link"
                  >
                    View Details & Comment →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default AllIssuesPage