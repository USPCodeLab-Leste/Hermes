import { NavLink } from "react-router-dom";

// NavLink pode usar className com uma função para estilizar o link ativo
// Exemplo: <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>

export default function AppFooter() {
 
  return (
    <footer className="p-4">
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/info">Informações</NavLink>
        <NavLink to="/perfil">Perfil</NavLink>
      </nav>
    </footer>
  )
}