import { NavLink } from "react-router-dom";
import { IconHome } from '@tabler/icons-react';
import { IconUser } from '@tabler/icons-react';
import { IconBook2 } from '@tabler/icons-react';

// NavLink pode usar className com uma função para estilizar o link ativo
// Exemplo: <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>


export default function AppFooter() {

  return (
    <footer className="w-full bottom-0">

      <nav className="bg-violet-dark max-w h-16 flex justify-evenly items-center">
 
        <NavLink to="/" className={({ isActive }) => isActive ? ' bg-teal-mid rounded-full p-4 -translate-y-8 transition-transform duration-300 ease-[cubic-bezier(0.23, 1, 0.32, 1)]' : 'translate-y-0 rounded-full p-2'}> <IconHome/> </NavLink>
    
        <NavLink to="/info" className={({ isActive }) => isActive ? ' bg-teal-mid rounded-full p-4 -translate-y-8 transition-transform duration-300 ease-[cubic-bezier(0.23, 1, 0.32, 1)]' : 'translate-y-0 rounded-full p-2 '}><IconBook2/></NavLink>

        <NavLink to="/perfil" className={({ isActive }) => isActive ? ' bg-teal-mid rounded-full p-4 -translate-y-8 transition-transform duration-300 ease-[cubic-bezier(0.23, 1, 0.32, 1)]' : 'translate-y-0 rounded-full p-2 '}><IconUser/></NavLink>
      </nav>


    </footer>
  )
}