const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getAuthHeaders() {
  const token = localStorage.getItem('resolveai_token')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function createAdmin(adminData) {
  const response = await fetch(`${API_BASE_URL}/admin/admins`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(adminData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to create administrator.',
    )
  }

  return data.admin
}