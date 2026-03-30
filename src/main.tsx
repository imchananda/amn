import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AdminDataManagement from './pages/AdminDataManagement.tsx'
import AdminLogin from './pages/AdminLogin.tsx'
import { LanguageProvider } from './i18n/LanguageContext'
import ErrorBoundary from './components/ErrorBoundary.tsx'

const ADMIN_HASH = '#/admin-agtic-calc'

function Root() {
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === ADMIN_HASH)
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('agtic_admin_auth') === 'true')

  useEffect(() => {
    const onHashChange = () => setIsAdmin(window.location.hash === ADMIN_HASH)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (isAdmin) {
    if (!isAuthenticated) return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />
    return <AdminDataManagement />
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
