import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AppLayout() {
  const { logout } = useAuth()

  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/busca">Busca</NavLink>
          <NavLink to="/agora">Agora</NavLink>
          <NavLink to="/perfil">Perfil</NavLink>
        </nav>
        <button onClick={() => logout()}>Logout</button>
      </header>
      <Outlet />
    </>
  )
}