const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getAuthHeaders() {
  const token = localStorage.getItem('resolveai_token')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function handleResponse(response) {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export async function getMyIssues(filters = {}) {
  const params = new URLSearchParams()

  if (filters.status) {
    params.append('status', filters.status)
  }

  if (filters.priority) {
    params.append('priority', filters.priority)
  }

  if (filters.category) {
    params.append('category', filters.category)
  }

  if (filters.search) {
    params.append('search', filters.search)
  }

  const queryString = params.toString()

  const response = await fetch(
    `${API_BASE_URL}/issues${queryString ? `?${queryString}` : ''}`,
    {
      headers: getAuthHeaders(),
    },
  )

  const data = await handleResponse(response)

  return data.issues
}

export async function getIssue(id) {
  const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
    headers: getAuthHeaders(),
  })

  const data = await handleResponse(response)

  return data.issue
}

export async function createIssue(payload) {
  const response = await fetch(`${API_BASE_URL}/issues`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
    }),
  })

  return handleResponse(response)
}

export async function updateIssue(id, patch) {
  const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(patch),
  })

  const data = await handleResponse(response)

  return data.issue
}

export async function getIssueStats() {
  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: getAuthHeaders(),
  })

  return handleResponse(response)
}

export async function getAllIssues(filters = {}) {
  const params = new URLSearchParams()

  if (filters.status) {
    params.append('status', filters.status)
  }

  if (filters.priority) {
    params.append('priority', filters.priority)
  }

  if (filters.category) {
    params.append('category', filters.category)
  }

  const queryString = params.toString()

  const response = await fetch(
    `${API_BASE_URL}/admin/issues${
      queryString ? `?${queryString}` : ''
    }`,
    {
      headers: getAuthHeaders(),
    },
  )

  const data = await handleResponse(response)

  return data.issues
}