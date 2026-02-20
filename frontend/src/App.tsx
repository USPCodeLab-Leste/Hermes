import type { JSX } from 'react'
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
  useLocation
} from 'react-router-dom'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Hooks
import { useAuth } from './hooks/auth/useAuth'
import { useTheme } from './hooks/useTheme';

// Layouts
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import InfoLayout from './layouts/InfoLayout'

// Contexts
import { AuthProvider } from './contexts/AuthContext'

// Pages
import Perfil from './pages/Perfil'
import Home from './pages/Home'
import Error from './pages/Error'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'
import ResetPassword from './pages/auth/ResetPassword'
import Estudos from './pages/info/Estudos';
import Campus from './pages/info/Campus';
import Apoios from './pages/info/Apoios';
import Carreira from './pages/info/Carreira';
import Info from './pages/info/InfoTag'
import Admin from './pages/Admin'

// Components
import Loading from './components/Loading'

/* =========================
   Guards de Autenticação
========================= */

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />
}

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user!.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function InfoIndexRedirect({ pathname }: { pathname: string }) {
  const { search } = useLocation();

  return <Navigate to={{ pathname, search }} replace />;
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
          <Route index element={<InfoIndexRedirect pathname="/info/estudos" />} />
          <Route path="estudos" element={<Estudos />} />
          <Route path="estudos/:tagName" element={<Info />} />

          <Route path="campus" element={<Campus />} />
          <Route path="campus/:tagName" element={<Info />} />

          <Route path="apoios" element={<Apoios />} />
          <Route path="apoios/:tagName" element={<Info />} />

          <Route path="carreira" element={<Carreira />} />
          <Route path="carreira/:tagName" element={<Info />} />
        </Route>

        <Route path="/perfil" >
          <Route index element={<Perfil />} />
          <Route 
            path="admin" 
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            } 
          />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Error />} />
    </>
  )
)

export default function App() {
  const { theme } = useTheme()
  return (
    <AuthProvider>
      <ToastContainer
        className="absolute"
        toastClassName="dark:bg-violet-dark! bg-violet-light! text-paper! rounded-lg shadow-lg"
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