import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { ROLES, ROUTES } from '../utils/constants.js'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginAs, setLoginAs] = useState(ROLES.USER)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() && !password) {
      setError('Email and password are required.')
      return
    }

    if (!email.trim()) {
      setError('Email is required.')
      return
    }

    if (!password) {
      setError('Password is required.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await login(email, password, loginAs)

      if (result.user.role === ROLES.SUPER_ADMIN) {
        navigate(ROUTES.SUPER_ADMIN)
      } else if (result.user.role === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN)
      } else {
        navigate(ROUTES.DASHBOARD)
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="login-page">
        <div className="login-header">
          <div className="login-logo">R</div>

          <h1 className="login-title">Welcome to ResolveAI</h1>

          <p className="login-subtitle">
            Intelligent service request and support platform
          </p>
        </div>

        {error ? <Alert type="error">{error}</Alert> : null}

        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            id="login-email"
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
          />

          <Input
            id="login-password"
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
          />

          <div className="login-role-selection">
            <p className="login-role-label">Login as</p>

            <div className="login-role-options">
              <button
                type="button"
                className={`login-role-button ${
                  loginAs === ROLES.USER ? 'active' : ''
                }`}
                onClick={() => setLoginAs(ROLES.USER)}
              >
                User
              </button>

              <button
                type="button"
                className={`login-role-button ${
                  loginAs === ROLES.ADMIN ? 'active' : ''
                }`}
                onClick={() => setLoginAs(ROLES.ADMIN)}
              >
                Admin
              </button>

              <button
                type="button"
                className={`login-role-button ${
                  loginAs === ROLES.SUPER_ADMIN ? 'active' : ''
                }`}
                onClick={() => setLoginAs(ROLES.SUPER_ADMIN)}
              >
                Super Admin
              </button>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="login-footer">
          Do not have an account?{' '}
          <Link to={ROUTES.REGISTER}>Register</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default LoginPage