import type { JSX } from 'react'
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  RouterProvider,
  Outlet,
  NavLink,
} from 'react-router-dom'

/* =========================
   Guards de Autenticação
========================= */

// Simulação de autenticação
const isAuthenticated = () => {
   // trocar pela lógica real (token, session, etc)
  return true
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

/* =========================
   Layouts
========================= */

function AppLayout() {
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/busca">Busca</NavLink>
        <NavLink to="/agora">Agora</NavLink>
        <NavLink to="/perfil">Perfil</NavLink>
      </nav>
      <Outlet />
    </>
  )
}

function FeedLayout() {
  return (
    <>
      <nav>
        <NavLink to="/feed/seguindo">Seguindo</NavLink>
        <NavLink to="/feed/para-voce">Para você</NavLink>
      </nav>
      <Outlet />
    </>
  )
}

/* =========================
   Pages (placeholders)
========================= */

const Login = () => <div>Login</div>

const FeedSeguindo = () => <div>Feed — Seguindo</div>
const FeedParaVoce = () => <div>Feed — Para você</div>

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
  return <RouterProvider router={router} />
}