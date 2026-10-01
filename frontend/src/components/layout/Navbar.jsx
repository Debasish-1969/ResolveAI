import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../../context/AuthContext.jsx'
import { ROLES, ROUTES } from '../../utils/constants.js'

function Navbar() {
  const { user } = useContext(AuthContext)

  const isAdmin = user?.role === ROLES.ADMIN
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN

  const homeRoute = isSuperAdmin
    ? ROUTES.SUPER_ADMIN
    : isAdmin
      ? ROUTES.ADMIN
      : ROUTES.DASHBOARD

  return (
    <header className="navbar">
      <Link to={homeRoute} className="navbar-brand">
        ResolveAI
      </Link>

      <nav className="navbar-links">
        {isSuperAdmin ? (
          <>
            <Link to={ROUTES.SUPER_ADMIN}>
              Super Admin Dashboard
            </Link>

            <Link to={ROUTES.PROFILE}>
              Profile
            </Link>
          </>
        ) : isAdmin ? (
          <>
            <Link to={ROUTES.ADMIN}>
              Admin Dashboard
            </Link>

            <Link to={ROUTES.ADMIN_ISSUES}>
              All Issues
            </Link>

            <Link to={ROUTES.ASSISTANT}>
              AI Assistant
            </Link>

            <Link to={ROUTES.PROFILE}>
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link to={ROUTES.DASHBOARD}>
              Dashboard
            </Link>

            <Link to={ROUTES.ISSUES}>
              My Issues
            </Link>

            <Link to={ROUTES.RAISE_ISSUE}>
              Raise Issue
            </Link>

            <Link to={ROUTES.ASSISTANT}>
              AI Assistant
            </Link>

            <Link to={ROUTES.PROFILE}>
              Profile
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar