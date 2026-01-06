import type { JSX } from 'react'
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
} from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import FeedLayout from './layouts/FeedLayout'
import AppLayout from './layouts/AppLayout'

import Login from './pages/Login'
import FeedSeguindo from './pages/FeedSeguindo'
import FeedParaVoce from './pages/FeedParaVoce'

import { AuthProvider } from './contexts/AuthContext'

/* =========================
   Guards de Autenticação
========================= */

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

/* =========================
   Pages (placeholders)
========================= */
const Busca = () => <div>Busca</div>
const Agora = () => <div>Coisas de Agora</div>
const Perfil = () => <div>Perfil</div>

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
        {/* Feed com variações */}
        <Route path="/" element={<FeedLayout />}>
          <Route index element={<Navigate to="/feed/para-voce" replace />} />
          <Route path="/feed/seguindo" element={<FeedSeguindo />} />
          <Route path="/feed/para-voce" element={<FeedParaVoce />} />
        </Route>

        {/* Busca */}
        <Route path="/busca" element={<Busca />} />

        {/* Página do Agora */}
        <Route path="/agora" element={<Agora />} />

        {/* Perfil */}
        <Route path="/perfil/:userId" element={<Perfil />} />
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