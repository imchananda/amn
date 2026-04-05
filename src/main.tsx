import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AdminDataManagement from './pages/AdminDataManagement.tsx'
import AdminLogin from './pages/AdminLogin.tsx'
import { LanguageProvider } from './i18n/LanguageContext'
import ErrorBoundary from './components/ErrorBoundary.tsx'

const ADMIN_HASH = '#/admin-agtic-calc'

const USER_AUTH_KEY = 'agtic_user_auth'
const ADMIN_AUTH_KEY = 'agtic_admin_auth'

function Root() {
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === ADMIN_HASH)

  // User auth — persistent across session (sessionStorage)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(
    () => sessionStorage.getItem(USER_AUTH_KEY) === 'true'
  )

  // Admin auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true'
  )

  useEffect(() => {
    const onHashChange = () => setIsAdmin(window.location.hash === ADMIN_HASH)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // ─── Admin route ───────────────────────────────────────────────────────────
  if (isAdmin) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          mode="admin"
          onLoginSuccess={() => {
            sessionStorage.setItem(ADMIN_AUTH_KEY, 'true')
            setIsAdminAuthenticated(true)
          }}
        />
      )
    }
    return <AdminDataManagement />
  }

  // ─── Public route — requires user password ─────────────────────────────────
  if (!isUserAuthenticated) {
    return (
      <AdminLogin
        mode="user"
        onLoginSuccess={() => {
          sessionStorage.setItem(USER_AUTH_KEY, 'true')
          setIsUserAuthenticated(true)
        }}
      />
    )
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ErrorBoundary>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
