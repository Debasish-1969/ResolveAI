const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function login(email, password, loginAs) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
      loginAs,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Invalid email or password')
  }

  return {
    user: data.user,
    token: data.token,
  }
}

export async function register(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed')
  }

  return {
    user: data.user,
    token: data.token,
  }
}

export function logout() {
  return Promise.resolve(true)
}