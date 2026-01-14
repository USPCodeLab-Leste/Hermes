import { Outlet, NavLink } from 'react-router-dom'
import { useSignOut } from '../hooks/useSignOut'
import { auth } from '../services/auth'

export default function AppLayout() {
  const [signOut] = useSignOut(auth)

  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/busca">Busca</NavLink>
          <NavLink to="/agora">Agora</NavLink>
          <NavLink to="/perfil">Perfil</NavLink>
        </nav>
        <button onClick={() => signOut()}>Logout</button>
      </header>
      <Outlet />
    </>
  )
}