import { NavLink } from "react-router-dom";
import { IconHome } from '@tabler/icons-react';
import { IconUser } from '@tabler/icons-react';
import { IconBook2 } from '@tabler/icons-react';

// NavLink pode usar className com uma função para estilizar o link ativo
// Exemplo: <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>

export default function AppFooter() {
 
  return (
    <footer className="p-4">
      <nav>

        <NavLink to="/"> <IconHome/> </NavLink>
        
        <NavLink to="/info"><IconBook2/></NavLink>

        <NavLink to="/perfil"><IconUser/></NavLink>

      </nav>
    </footer>
  )
}