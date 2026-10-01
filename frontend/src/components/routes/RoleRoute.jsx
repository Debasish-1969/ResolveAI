import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx'
import { ROLES, ROUTES } from '../../utils/constants.js'

function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === ROLES.ADMIN) {
      return <Navigate to={ROUTES.ADMIN} replace />
    }

    if (user.role === ROLES.SUPER_ADMIN) {
      return <Navigate to={ROUTES.SUPER_ADMIN} replace />
    }

    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return children
}

export default RoleRoute