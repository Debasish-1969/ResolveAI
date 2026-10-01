import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import Textarea from '../components/ui/Textarea.jsx'

import { AuthContext } from '../context/AuthContext.jsx'
import { getIssue } from '../services/issueService.js'
import {
  addComment,
  getComments,
} from '../services/commentService.js'
import { ROLES } from '../utils/constants.js'

import './IssueDetailsPage.css'

function IssueDetailsPage() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)

  const [issue, setIssue] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isAdmin = user?.role === ROLES.ADMIN

  const backPath = isAdmin ? '/admin/issues' : '/issues'
  const backText = isAdmin
    ? '← Back to All Issues'
    : '← Back to My Issues'

  useEffect(() => {
    async function loadIssue() {
      try {
        setLoading(true)
        setError('')

        const issueResult = await getIssue(id)
        const commentsResult = await getComments(id)

        if (!issueResult) {
          setError('Issue not found.')
          return
        }

        setIssue(issueResult)
        setComments(commentsResult)
      } catch (err) {
        setError(err.message || 'Failed to load issue.')
      } finally {
        setLoading(false)
      }
    }

    loadIssue()
  }, [id])

  async function handleCommentSubmit(event) {
    event.preventDefault()

    if (!comment.trim()) {
      return
    }

    if (!user) {
      setError('You must be logged in to comment.')
      return
    }

    setIsSubmitting(true)

    try {
      const newComment = await addComment(
        id,
        comment.trim(),
      )

      setComments((currentComments) => [
        ...currentComments,
        newComment,
      ])

      setComment('')
    } catch (err) {
      setError(err.message || 'Failed to add comment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="issue-details-loading">
          <LoadingState />
        </div>
      </AppLayout>
    )
  }

  if (!issue) {
    return (
      <AppLayout>
        <div className="issue-details-not-found">
          <Alert type="error">
            {error || 'Issue not found.'}
          </Alert>

          <Link to={backPath} className="issue-back-link">
            {backText}
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="issue-details-page">
        <Link to={backPath} className="issue-back-link">
          {backText}
        </Link>

        <header className="issue-details-header">
          <div>
            <p className="issue-details-eyebrow">
              SERVICE REQUEST
            </p>

            <h1>{issue.title}</h1>

            <p className="issue-details-id">
              Issue #{issue.id}
            </p>
          </div>

          <div className="issue-details-badges">
            <span className="issue-details-status">
              {issue.status}
            </span>

            <span className="issue-details-priority">
              {issue.priority}
            </span>
          </div>
        </header>

        {error ? (
          <Alert type="error">{error}</Alert>
        ) : null}

        <div className="issue-details-layout">
          <main>
            <section className="issue-details-card">
              <div className="issue-details-card-header">
                <h2>Issue Details</h2>
              </div>

              <div className="issue-details-body">
                <div className="issue-description-section">
                  <span className="issue-detail-label">
                    Description
                  </span>

                  <p>{issue.description}</p>
                </div>

                <div className="issue-meta-grid">
                  <div className="issue-meta-item">
                    <span>Category</span>
                    <strong>{issue.category}</strong>
                  </div>

                  <div className="issue-meta-item">
                    <span>Status</span>
                    <strong>{issue.status}</strong>
                  </div>

                  <div className="issue-meta-item">
                    <span>Priority</span>
                    <strong>{issue.priority}</strong>
                  </div>

                  <div className="issue-meta-item">
                    <span>Created By</span>
                    <strong>
                      {typeof issue.createdBy === 'object'
                        ? issue.createdBy?.name
                        : issue.createdBy}
                    </strong>
                  </div>

                  <div className="issue-meta-item">
                    <span>Assigned To</span>
                    <strong>
                      {issue.assignedTo?.name || 'Unassigned'}
                    </strong>
                  </div>

                  <div className="issue-meta-item">
                    <span>Created</span>
                    <strong>
                      {new Date(
                        issue.createdAt,
                      ).toLocaleString()}
                    </strong>
                  </div>

                  <div className="issue-meta-item">
                    <span>Last Updated</span>
                    <strong>
                      {new Date(
                        issue.updatedAt,
                      ).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            <section className="comments-section">
              <div className="comments-header">
                <div>
                  <h2>Comments & Updates</h2>

                  <p>
                    Communication related to this service request.
                  </p>
                </div>

                <span className="comments-count">
                  {comments.length}
                </span>
              </div>

              {comments.length === 0 ? (
                <div className="comments-empty">
                  <h3>No comments yet</h3>

                  <p>
                    Be the first to add an update to this issue.
                  </p>
                </div>
              ) : (
                <div className="comments-list">
                  {comments.map((item) => (
                    <div
                      className="comment-card"
                      key={item.id}
                    >
                      <div className="comment-header">
                        <strong>
                          {item.author?.name || 'User'}
                        </strong>

                        <small>
                          {new Date(
                            item.createdAt,
                          ).toLocaleString()}
                        </small>
                      </div>

                      <p>{item.body}</p>
                    </div>
                  ))}
                </div>
              )}

              <form
                className="comment-form"
                onSubmit={handleCommentSubmit}
              >
                <Textarea
                  id="issue-comment"
                  label="Add a comment"
                  name="comment"
                  value={comment}
                  onChange={(event) =>
                    setComment(event.target.value)
                  }
                  placeholder="Write an update or response..."
                  rows={4}
                />

                <div className="comment-form-footer">
                  <span>
                    Keep your comment clear and relevant.
                  </span>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? 'Adding...'
                      : 'Add Comment'}
                  </Button>
                </div>
              </form>
            </section>
          </main>

          <aside className="issue-details-sidebar">
            <div className="issue-sidebar-card">
              <h3>Request Summary</h3>

              <div className="sidebar-item">
                <span>Status</span>
                <strong>{issue.status}</strong>
              </div>

              <div className="sidebar-item">
                <span>Priority</span>
                <strong>{issue.priority}</strong>
              </div>

              <div className="sidebar-item">
                <span>Category</span>
                <strong>{issue.category}</strong>
              </div>

              <div className="sidebar-item">
                <span>Assigned To</span>
                <strong>
                  {issue.assignedTo?.name || 'Unassigned'}
                </strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  )
}

export default IssueDetailsPage