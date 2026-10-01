import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ROLES, ROUTES } from './utils/constants.js'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import UserDashboardPage from './pages/UserDashboardPage.jsx'
import MyIssuesPage from './pages/MyIssuesPage.jsx'
import RaiseIssuePage from './pages/RaiseIssuePage.jsx'
import IssueDetailsPage from './pages/IssueDetailsPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import AllIssuesPage from './pages/AllIssuesPage.jsx'
import AssistantPage from './pages/AssistantPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage.jsx'
import RoleRoute from './components/routes/RoleRoute.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>

<Route
    path="/"
    element={<Navigate to="/login" replace />}
/>

<Route
    path={ROUTES.LOGIN}
    element={<LoginPage />}
/>

<Route
    path={ROUTES.REGISTER}
    element={<RegisterPage />}
/>

<Route
    path={ROUTES.DASHBOARD}
    element={
        <RoleRoute allowedRoles={[ROLES.USER]}>
            <UserDashboardPage />
        </RoleRoute>
    }
/>

<Route
    path={ROUTES.ISSUES}
    element={
        <RoleRoute allowedRoles={[ROLES.USER]}>
            <MyIssuesPage />
        </RoleRoute>
    }
/>

<Route
    path={ROUTES.RAISE_ISSUE}
    element={
        <RoleRoute allowedRoles={[ROLES.USER]}>
            <RaiseIssuePage />
        </RoleRoute>
    }
/>

<Route
    path={ROUTES.ISSUE_DETAILS}
    element={
        <RoleRoute
            allowedRoles={[ROLES.USER, ROLES.ADMIN]}
        >
            <IssueDetailsPage />
        </RoleRoute>
    }
/>

<Route
    path={ROUTES.ADMIN}
    element={
        <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboardPage />
        </RoleRoute>
    }
/>

<Route
    path={ROUTES.ADMIN_ISSUES}
    element={
        <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <AllIssuesPage />
        </RoleRoute>
    }
/>

<Route
    path={ROUTES.SUPER_ADMIN}
    element={
        <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
            <SuperAdminDashboardPage />
        </RoleRoute>
    }
/>

<Route
    path={ROUTES.ASSISTANT}
    element={
        <RoleRoute
            allowedRoles={[ROLES.USER, ROLES.ADMIN]}
        >
            <AssistantPage />
        </RoleRoute>
    }
/>

<Route
    path={ROUTES.PROFILE}
    element={
        <RoleRoute
            allowedRoles={[
                ROLES.USER,
                ROLES.ADMIN,
                ROLES.SUPER_ADMIN
            ]}
        >
            <ProfilePage />
        </RoleRoute>
    }
/>

</Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
