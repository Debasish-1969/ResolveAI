import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AuthLayout from '../components/layout/AuthLayout.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'

import { AuthContext } from '../context/AuthContext.jsx'
import { register as registerRequest } from '../services/authService.js'
import { ROUTES } from '../utils/constants.js'

import './LoginPage.css'

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await registerRequest(name, email, password)

      localStorage.setItem('resolveai_token', result.token)

      window.location.href = ROUTES.DASHBOARD
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="login-page">
        <div className="login-header">
          <div className="login-logo">R</div>

          <h1 className="login-title">Create your account</h1>

          <p className="login-subtitle">
            Join ResolveAI and manage your service requests
          </p>
        </div>

        {error ? <Alert type="error">{error}</Alert> : null}

        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            id="register-name"
            label="Full Name"
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your full name"
          />

          <Input
            id="register-email"
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
          />

          <Input
            id="register-password"
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
          />

          <Input
            id="register-confirm-password"
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm your password"
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="login-footer">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN}>Login</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default RegisterPage