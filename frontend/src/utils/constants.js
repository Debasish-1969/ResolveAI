export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
}

export const ISSUE_STATUSES = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
}

export const ISSUE_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
}

export const ISSUE_CATEGORIES = {
  HARDWARE: 'HARDWARE',
  SOFTWARE: 'SOFTWARE',
  NETWORK: 'NETWORK',
  ACCESS: 'ACCESS',
  OTHER: 'OTHER',
}

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ISSUES: '/issues',
  RAISE_ISSUE: '/issues/new',
  ISSUE_DETAILS: '/issues/:id',
  ADMIN: '/admin/dashboard',
  ADMIN_ISSUES: '/admin/issues',
  SUPER_ADMIN: '/super-admin',
  ASSISTANT: '/assistant',
  PROFILE: '/profile',
}
