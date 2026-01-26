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

import AppLayout from './layouts/AppLayout'

import Login from './pages/Login'
import Info from './pages/Info'
import Perfil from './pages/Perfil'
import Home from './pages/Home'

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