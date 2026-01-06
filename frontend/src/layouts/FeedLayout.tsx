import { NavLink, Outlet } from 'react-router-dom'

export default function FeedLayout() {
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