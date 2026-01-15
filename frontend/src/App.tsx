import type { JSX } from 'react'
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
} from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Auth
import { AuthProvider } from './contexts/AuthContext'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'
import ResetPassword from './pages/auth/ResetPassword'

// Páginas protegidas
import Info from './pages/Info'
import Perfil from './pages/Perfil'
import FeedSeguindo from './pages/FeedSeguindo'
import FeedParaVoce from './pages/FeedParaVoce'
import FeedLayout from './layouts/FeedLayout'
import AppLayout from './layouts/AppLayout'


/* =========================
   Guards de Autenticação
========================= */

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/auth" replace />
}

/* =========================
   Router
========================= */

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="reset-password" element={<ResetPassword />} />
      </Route>

      {/* Rotas protegidas */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        {/* Feed com variações */}
        <Route path="/" element={<FeedLayout />}>
          <Route index element={<Navigate to="/feed/para-voce" replace />} />
          <Route path="/feed/seguindo" element={<FeedSeguindo />} />
          <Route path="/feed/para-voce" element={<FeedParaVoce />} />
        </Route>

        <Route path="/info" element={<Info />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
)

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}