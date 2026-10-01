const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getAuthHeaders() {
  const token = localStorage.getItem('resolveai_token')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function sendAssistantMessage(message) {
  const response = await fetch(`${API_BASE_URL}/assistant`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      message: message.trim(),
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'The assistant could not process your request.',
    )
  }

  return {
    id: 'assistant-' + Date.now(),
    role: 'assistant',
    content: data.answer,
    createdAt: new Date().toISOString(),
  }
}