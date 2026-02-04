import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom'

// Components
import AppHeader from '../components/AppHeader'
import SearchBar from "../components/SearchBar";
import { motion } from 'framer-motion';

export default function InfoLayout() {
  const [search, setSearch] = useState("");
  
  return (
    <>
      <AppHeader >
        <div className="flex items-center gap-4 mt-6 max-w-2xl w-9/10 m-auto">
          <SearchBar search={search} setSearch={setSearch} />
        </div>
      </AppHeader>
      <main className="main-app">
        <nav className="outline-1 rounded-full">
          <ul className="flex items-center gap-4 mb-6 justify-between py-2 px-4">
            <li><NavItem to="estudos" label="Estudos" /></li>
            <li><NavItem to="campus" label="Campus" /></li>
            <li><NavItem to="apoios" label="Apoios" /></li>
            <li><NavItem to="carreira" label="Carreira" /></li>
          </ul>
        </nav>
        <Outlet />
      </main>
    </>
  )
}

const NavItem = ({ to, label }: { to: string; label: string }) => {
  return (
    <NavLink 
      to={to}
      className="inline-flex items-center justify-center relative"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="info-indicator"
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30,
              }}
              className="absolute z-5"
            >
              <span 
                className='bg-teal-mid relative z-5 py-1 px-3 rounded-full text-transparent'
                aria-hidden="true"
              >
                {label}
              </span>
            </motion.div>
          )}
          <span className='relative z-6'>
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}