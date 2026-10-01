const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getAuthHeaders() {
  const token = localStorage.getItem('resolveai_token')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function getAdminsWithSkills() {
  const response = await fetch(`${API_BASE_URL}/admin/skills`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to load administrators and their skills.',
    )
  }

  return data.admins
}

export async function assignAdminSkill(adminId, skill) {
  const response = await fetch(`${API_BASE_URL}/admin/skills`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      adminId,
      skill,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to assign admin skill.')
  }

  return data.skill
}

export async function removeAdminSkill(skillId) {
  const response = await fetch(`${API_BASE_URL}/admin/skills/${skillId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to remove admin skill.')
  }

  return data
}