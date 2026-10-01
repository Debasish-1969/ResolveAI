import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import Select from '../components/ui/Select.jsx'
import Textarea from '../components/ui/Textarea.jsx'

import { AuthContext } from '../context/AuthContext.jsx'
import { createIssue } from '../services/issueService.js'
import {
  ISSUE_CATEGORIES,
  ISSUE_PRIORITIES,
  ROUTES,
} from '../utils/constants.js'

import './RaiseIssuePage.css'

function RaiseIssuePage() {
  const { user, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!title.trim() || !description.trim() || !category || !priority) {
      setError('Please fill in all fields.')
      return
    }

    setIsSubmitting(true)

    try {
      if (!user) {
        setError('Your session has expired. Please login again.')
        return
      }

      await createIssue({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
      })

      navigate(ROUTES.ISSUES)
    } catch (err) {
      setError(err.message || 'Failed to create issue.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categoryOptions = Object.values(ISSUE_CATEGORIES).map((value) => ({
    value,
    label: value,
  }))

  const priorityOptions = Object.values(ISSUE_PRIORITIES).map((value) => ({
    value,
    label: value,
  }))

  return (
    <AppLayout>
      <div className="issue-form-page">
        <section className="issue-form-header">
          <div>
            <p className="issue-form-eyebrow">
              SERVICE REQUEST
            </p>

            <h1>Raise a New Issue</h1>

            <p className="issue-form-description">
              Describe your problem and our support team will help
              resolve it.
            </p>
          </div>
        </section>

        {error ? (
          <Alert type="error">{error}</Alert>
        ) : null}

        <div className="issue-form-card">
          <div className="issue-form-card-header">
            <h2>Issue Details</h2>

            <p>
              Provide as much information as possible so the
              support team can assist you effectively.
            </p>
          </div>

          <form
            className="issue-form"
            onSubmit={handleSubmit}
          >
            <Input
              id="issue-title"
              label="Issue Title"
              type="text"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Laptop is not connecting to Wi-Fi"
            />

            <Textarea
              id="issue-description"
              label="Description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the problem in detail..."
              rows={6}
            />

            <div className="issue-form-row">
              <Select
                id="issue-category"
                label="Category"
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                options={categoryOptions}
                placeholder="Select a category"
              />

              <Select
                id="issue-priority"
                label="Priority"
                name="priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                options={priorityOptions}
                placeholder="Select priority"
              />
            </div>

            <div className="issue-form-footer">
              <p>
                All fields are required.
              </p>

              <Button
                type="submit"
                disabled={isSubmitting || loading}
              >
                {isSubmitting
                  ? 'Submitting...'
                  : 'Submit Issue'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}

export default RaiseIssuePage