import type { JSX } from 'react'
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
} from 'react-router-dom'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer
        position="top-right"     // Posição na tela
        autoClose={3000}         // 3 segundos
        hideProgressBar={false}  // Mostrar ou esconder a barrinha de tempo
        newestOnTop={true}       // Novas notificações aparecem em cima das antigas
        closeOnClick             // Fecha ao clicar na notificação
        rtl={false}              // Right to Left (para árabe/hebraico)
        pauseOnFocusLoss         // Pausa o tempo se o usuário mudar de aba
        draggable                // Arrastar para fechar
        theme="light"            // 'light', 'dark', ou 'colored' (colored = fundo colorido)
        /> 

      <RouterProvider router={router} />
    </AuthProvider>
  )
}