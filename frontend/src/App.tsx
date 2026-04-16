import { lazy, Suspense, useEffect, type JSX } from 'react'
import {
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
  useLocation,
  createBrowserRouter
} from 'react-router-dom'
import ReactGA from "react-ga4";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Hooks
import { useAuth } from './hooks/auth/useAuth'
import { useTheme } from './hooks/useTheme';
// import { useDebug } from './hooks/useDebug'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import AppLayout from './layouts/AppLayout'
import InfoLayout from './layouts/InfoLayout'

// Lazy
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const CreateEvent = lazy(() => import('./pages/admin/CreateEvent'))
const CreateInfo = lazy(() => import('./pages/admin/CreateInfo'))
const CreateTags = lazy(() => import('./pages/admin/CreateTags'))

// Contexts
import { AuthProvider } from './contexts/AuthContext'

// Pages
import Perfil from './pages/Perfil'
import Home from './pages/Home'
import Error from './pages/Error'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ResetPassword from './pages/auth/ResetPassword'
import Estudos from './pages/info/Estudos';
import Campus from './pages/info/Campus';
import Apoios from './pages/info/Apoios';
import Carreira from './pages/info/Carreira';
import Info from './pages/info/InfoTag'
import Calendar from './pages/Calendar';

// Components
import Loading from './components/Loading'

/* =========================
   Gerais
========================= */

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loading loader='loader-message' />
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />
}

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading loader='loader-message' />;
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

function LazyRoute({children, fullPage, loader}: {children: JSX.Element, fullPage?: boolean, loader?: string}) {
  return (
    <Suspense fallback={<Loading fullPage={fullPage} loader={loader} />}>
      {children}
    </Suspense>
  );
}

/* =========================
   Router
========================= */

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
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

        <Route path="calendar" element={<Calendar />} />

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
                <LazyRoute fullPage={true} loader="loader-message">
                  <AdminLayout />
                </LazyRoute>
              </RequireAdmin>
            } 
          >
            <Route index element={<InfoIndexRedirect pathname="/perfil/admin/create_events" />} />
            <Route 
              path="create_events" 
              element={
                <LazyRoute fullPage={false}>
                  <CreateEvent />
                </LazyRoute>
              } 
            />
            <Route 
              path="create_infos" 
              element={
                <LazyRoute fullPage={false}>
                  <CreateInfo />
                </LazyRoute>
              } 
            />
            <Route 
              path="create_tags" 
              element={
                <LazyRoute fullPage={false}>
                  <CreateTags />
                </LazyRoute>
              } 
            />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Error />} />
    </>
  )
)

export default function App() {
  const { theme } = useTheme()
  
  useEffect(() => {
    ReactGA.initialize("G-0QVNHKVBX7");

    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "App.tsx" });
  }, [])

  return (
    <AuthProvider>
      <ToastContainer
        
        // className="fixed"
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