
import { useContext, useEffect, useState } from 'react'

import AppLayout from '../components/layout/AppLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import LoadingState from '../components/ui/LoadingState.jsx'
import Select from '../components/ui/Select.jsx'

import { AuthContext } from '../context/AuthContext.jsx'

import {
  assignAdminSkill,
  getAdminsWithSkills,
  removeAdminSkill,
} from '../services/adminSkillService.js'

import { createAdmin } from '../services/adminService.js'

import './SuperAdminDashboardPage.css'

const SKILLS = [
  'HARDWARE',
  'NETWORK',
  'SOFTWARE',
  'ACCOUNT',
]

function SuperAdminDashboardPage() {
  const { user, logout } = useContext(AuthContext)

  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [selectedSkills, setSelectedSkills] = useState({})

  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [creatingAdmin, setCreatingAdmin] = useState(false)

  useEffect(() => {
    loadAdmins()
  }, [])

  async function loadAdmins() {
    try {
      setLoading(true)
      setError('')

      const result = await getAdminsWithSkills()

      setAdmins(result)
    } catch (err) {
      setError(
        err.message || 'Failed to load administrators.',
      )
    } finally {
      setLoading(false)
    }
  }

  function handleAdminFormChange(event) {
    const { name, value } = event.target

    setAdminForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleCreateAdmin(event) {
    event.preventDefault()

    try {
      setCreatingAdmin(true)
      setError('')
      setSuccess('')

      await createAdmin(adminForm)

      setAdminForm({
        name: '',
        email: '',
        password: '',
      })

      setSuccess(
        'Administrator account created successfully.',
      )

      await loadAdmins()
    } catch (err) {
      setError(
        err.message || 'Failed to create administrator.',
      )
    } finally {
      setCreatingAdmin(false)
    }
  }

  function handleSkillSelection(adminId, skill) {
    setSelectedSkills((current) => ({
      ...current,
      [adminId]: skill,
    }))
  }

  async function handleAssignSkill(adminId) {
    const skill = selectedSkills[adminId]

    if (!skill) {
      return
    }

    try {
      setError('')
      setSuccess('')

      await assignAdminSkill(adminId, skill)

      const updatedAdmins = await getAdminsWithSkills()

      setAdmins(updatedAdmins)

      setSelectedSkills((current) => ({
        ...current,
        [adminId]: '',
      }))

      setSuccess('Skill assigned successfully.')
    } catch (err) {
      setError(
        err.message || 'Failed to assign skill.',
      )
    }
  }

  async function handleRemoveSkill(skillId) {
    try {
      setError('')
      setSuccess('')

      await removeAdminSkill(skillId)

      const updatedAdmins = await getAdminsWithSkills()

      setAdmins(updatedAdmins)

      setSuccess('Skill removed successfully.')
    } catch (err) {
      setError(
        err.message || 'Failed to remove skill.',
      )
    }
  }

  function handleLogout() {
    logout()
    window.location.href = '/login'
  }

  return (
    <AppLayout>
      <div className="super-admin-page">

        <div className="super-admin-header">

          <div>
            <span className="page-eyebrow">
              SYSTEM ADMINISTRATION
            </span>

            <h1>Super Admin Dashboard</h1>

            <p>
              Manage administrators and their support skills
              across ResolveAI.
            </p>
          </div>

          <div className="super-admin-user">

            <div className="super-admin-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </div>

            <div className="super-admin-user-info">
              <span>Signed in as</span>

              <strong>
                {user?.name}
              </strong>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>

          </div>

        </div>

        {error ? (
          <Alert type="error">
            {error}
          </Alert>
        ) : null}

        {success ? (
          <Alert type="success">
            {success}
          </Alert>
        ) : null}

        <section className="super-admin-section admin-create-section">

          <div className="section-heading">

            <div>

              <span className="section-eyebrow">
                ADMINISTRATORS
              </span>

              <h2>
                Create Administrator
              </h2>

              <p>
                Create a new administrator account. New
                accounts are created with the ADMIN role.
              </p>

            </div>

          </div>

          <form
            className="admin-create-form"
            onSubmit={handleCreateAdmin}
          >

            <div className="form-field">

              <label htmlFor="admin-name">
                Name
              </label>

              <input
                id="admin-name"
                name="name"
                type="text"
                value={adminForm.name}
                onChange={handleAdminFormChange}
                placeholder="Administrator name"
                required
              />

            </div>

            <div className="form-field">

              <label htmlFor="admin-email">
                Email
              </label>

              <input
                id="admin-email"
                name="email"
                type="email"
                value={adminForm.email}
                onChange={handleAdminFormChange}
                placeholder="admin@example.com"
                required
              />

            </div>

            <div className="form-field">

              <label htmlFor="admin-password">
                Temporary Password
              </label>

              <input
                id="admin-password"
                name="password"
                type="password"
                value={adminForm.password}
                onChange={handleAdminFormChange}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />

            </div>

            <div className="admin-create-action">

              <Button
                type="submit"
                disabled={creatingAdmin}
              >
                {creatingAdmin
                  ? 'Creating Administrator...'
                  : 'Create Administrator'}
              </Button>

            </div>

          </form>

        </section>

        <section className="super-admin-section admin-skills-section">

          <div className="section-heading">

            <div>

              <span className="section-eyebrow">
                SUPPORT MANAGEMENT
              </span>

              <h2>
                Administrator Skills
              </h2>

              <p>
                Assign support categories to administrators
                based on their area of responsibility.
              </p>

            </div>

            <div className="admin-count">

              <strong>
                {admins.length}
              </strong>

              <span>
                Administrators
              </span>

            </div>

          </div>

          {loading ? (
            <LoadingState />
          ) : admins.length === 0 ? (

            <div className="admin-empty-state">

              <h3>
                No administrators found
              </h3>

              <p>
                Create an administrator account above to begin
                assigning support skills.
              </p>

            </div>

          ) : (

            <div className="admin-skills-list">

              {admins.map((admin) => (

                <div
                  key={admin.id}
                  className="admin-skill-card"
                >

                  <div className="admin-skill-info">

                    <div className="admin-profile-row">

                      <div className="admin-avatar">
                        {admin.name
                          ?.charAt(0)
                          .toUpperCase() || 'A'}
                      </div>

                      <div>

                        <h3>
                          {admin.name}
                        </h3>

                        <p>
                          {admin.email}
                        </p>

                      </div>

                    </div>

                    <div className="admin-skills-area">

                      <span className="admin-skills-label">
                        Assigned Skills
                      </span>

                      <div className="admin-skill-tags">

                        {admin.skills.length > 0 ? (

                          admin.skills.map((item) => (

                            <span
                              key={item.id}
                              className="admin-skill-tag"
                            >

                              {item.skill}

                              <button
                                type="button"
                                className="admin-skill-remove"
                                onClick={() =>
                                  handleRemoveSkill(item.id)
                                }
                                title="Remove skill"
                              >
                                ×
                              </button>

                            </span>

                          ))

                        ) : (

                          <span className="admin-no-skills">
                            No skills assigned
                          </span>

                        )}

                      </div>

                    </div>

                  </div>

                  <div className="admin-skill-actions">

                    <Select
                      id={'skill-' + admin.id}
                      label="Assign Skill"
                      name={'skill-' + admin.id}
                      value={
                        selectedSkills[admin.id] || ''
                      }
                      onChange={(event) =>
                        handleSkillSelection(
                          admin.id,
                          event.target.value,
                        )
                      }
                      options={[
                        {
                          value: '',
                          label: 'Select skill',
                        },
                        ...SKILLS.map((skill) => ({
                          value: skill,
                          label: skill,
                        })),
                      ]}
                    />

                    <Button
                      type="button"
                      onClick={() =>
                        handleAssignSkill(admin.id)
                      }
                      disabled={
                        !selectedSkills[admin.id]
                      }
                    >
                      Assign Skill
                    </Button>

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

export default SuperAdminDashboardPage

