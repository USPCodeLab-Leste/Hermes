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

// Layouts
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import InfoLayout from './layouts/InfoLayout'

// Contexts
import { AuthProvider } from './contexts/AuthContext'

// Pages
import Info from './pages/Info'
import Perfil from './pages/Perfil'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'
import ResetPassword from './pages/auth/ResetPassword'

import { useTheme } from './hooks/useTheme';


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
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />

        <Route path="/info" element={<InfoLayout />} >
          <Route index element={<Navigate to="/info/estudos" replace />} />
          <Route path="estudos" element={<Info />} />
          <Route path="estudos/:tagName" element={<Info />} />

          <Route path="campus" element={<Info />} />
          <Route path="campus/:tagName" element={<Info />} />

          <Route path="apoios" element={<Info />} />
          <Route path="apoios/:tagName" element={<Info />} />

          <Route path="carreira" element={<Info />} />
          <Route path="carreira/:tagName" element={<Info />} />
        </Route>
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
)

export default function App() {
  const { theme } = useTheme()
  return (
    <AuthProvider>
      <ToastContainer
        className="absolute"
        position="top-right"     // Posição na tela
        autoClose={3000}         // 3 segundos
        hideProgressBar={false}  // Mostrar ou esconder a barrinha de tempo
        newestOnTop={true}       // Novas notificações aparecem em cima das antigas
        closeOnClick             // Fecha ao clicar na notificação
        rtl={false}              // Right to Left (para árabe/hebraico)
        pauseOnFocusLoss         // Pausa o tempo se o usuário mudar de aba
        draggable                // Arrastar para fechar
        theme={theme}            // 'light', 'dark', ou 'colored' (colored = fundo colorido)
      /> 

      <RouterProvider router={router} />
    </AuthProvider>
  )
}