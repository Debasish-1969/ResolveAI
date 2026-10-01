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

export async function getComments(issueId) {
  const response = await fetch(
    `${API_BASE_URL}/issues/${issueId}/comments`,
    {
      headers: getAuthHeaders(),
    },
  )

  const data = await handleResponse(response)

  return data.comments
}

export async function addComment(issueId, body) {
  const response = await fetch(
    `${API_BASE_URL}/issues/${issueId}/comments`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        body,
      }),
    },
  )

  const data = await handleResponse(response)

 return data.comment
}