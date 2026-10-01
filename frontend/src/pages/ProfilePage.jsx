import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout.jsx'
import Button from '../components/ui/Button.jsx'

import { AuthContext } from '../context/AuthContext.jsx'
import { ROLES, ROUTES } from '../utils/constants.js'

import './ProfilePage.css'

function ProfilePage() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN)
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="profile-page">
          <div className="profile-empty">
            <h1>Profile</h1>
            <p>No user information available.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const roleLabel =
    user.role === ROLES.SUPER_ADMIN
      ? 'Super Administrator'
      : user.role === ROLES.ADMIN
        ? 'Administrator'
        : 'User'

  return (
    <AppLayout>
      <div className="profile-page">
        <div className="profile-header">
          <div>
            <span className="page-eyebrow">ACCOUNT</span>

            <h1>My Profile</h1>

            <p>
              View your account information and access details.
            </p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-detail">
              <span className="profile-detail-label">Name</span>
              <strong>{user.name}</strong>
            </div>

            <div className="profile-detail">
              <span className="profile-detail-label">Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className="profile-detail">
              <span className="profile-detail-label">Role</span>
              <strong>{roleLabel}</strong>
            </div>

            <div className="profile-detail">
              <span className="profile-detail-label">
                Account Created
              </span>

              <strong>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'Not available'}
              </strong>
            </div>
          </div>

          <div className="profile-card-footer">
            <div>
              <strong>Account Security</strong>
              <p>
                Sign out of your ResolveAI account from this device.
              </p>
            </div>

            <Button type="button" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default ProfilePage