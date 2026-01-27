import { NavLink } from "react-router-dom";
import { IconHome } from '@tabler/icons-react';
import { IconUser } from '@tabler/icons-react';
import { IconBook2 } from '@tabler/icons-react';
import Ondinha from "../assets/icons/ondinha.svg?react";

// NavLink pode usar className com uma função para estilizar o link ativo
// Exemplo: <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>

import { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { useLocation } from "react-router-dom";

// const routesMap = {
//   '/home': 0,
//   '/info': 1,
//   '/perfil': 2,
// }

export default function AppFooter() {
  const location = useLocation();
  const ref = useRef<HTMLElement>(null);
  const [x, setX] = useState(0);

  const updateX = useCallback(() => {
    if (!ref.current) return;

    const link = ref.current.querySelector('a.active');
    const linkRect = link?.getBoundingClientRect();
    const navRect = ref.current.getBoundingClientRect();
    const percentX = linkRect ? ((linkRect.left + linkRect.right) / 2 - navRect.left) / navRect.width * 100 : 0;

    setX(percentX);
  }, [])

  useLayoutEffect(() => {
    updateX();
  }, [location])

  useEffect(() => {
    window.addEventListener('resize', updateX)

    return () => {
      window.removeEventListener('resize', updateX)
    }

  }, [])

  return (
    <footer className="w-full bottom-0 relative bg-violet-dark flex items-center justify-center h-20" ref={ref}>

      <nav className="flex justify-evenly items-center max-w-180 w-full">
        {x > 0 && (
          <Ondinha 
            className="absolute top-0 dark:text-violet-mid aspect-124/39 w-28 transition-all ease-in-out duration-200 -translate-x-1/2"
            style={{
              left: `${x}%`,
            }}
          />
        )}
 
        <FooterItem to="/home" icon={IconHome}/>
        <FooterItem to="/info" icon={IconBook2}/>
        <FooterItem to="/perfil" icon={IconUser}/>
      </nav>


    </footer>
  )
}

const FooterItem = ({ to, icon: Icon }: { to: string; icon: React.ComponentType }) => {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => {
        const baseClass = 'p-4 transition-all duration-300 ease-[cubic-bezier(0.172,-0.003,0.468,1.470)]'
        return isActive 
        ? baseClass + ' active bg-teal-mid rounded-full -translate-y-10' 
        : baseClass + ' translate-y-0 rounded-full hover:bg-violet-light/50'
      
      }}
    >
      <Icon />
    </NavLink>
  )
}