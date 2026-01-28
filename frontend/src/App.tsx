import type { JSX } from 'react'
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
} from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import AppLayout from './layouts/AppLayout'

import Login from './pages/Login'
import Info from './pages/Info'
import Perfil from './pages/Perfil'
import Home from './pages/Home'
import Error from './pages/Error'

import { AuthProvider } from './contexts/AuthContext'

/* =========================
   Guards de Autenticação
========================= */

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

/* =========================
   Router
========================= */

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />

        <Route path="/info" element={<Info />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Error />} />
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