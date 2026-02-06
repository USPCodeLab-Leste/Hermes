import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion';

// Components
import AppHeader from '../components/AppHeader'
import SearchBar from "../components/SearchBar";

// Hooks
import { useSharedSearch } from '../hooks/useSharedSearch';

export default function InfoLayout() {
  const [search, setSearch] = useSharedSearch()
  
  return (
    <>
      <AppHeader >
        <SearchBar search={search} setSearch={setSearch} />
      </AppHeader>
      <main className="main-app">
        <motion.nav className="outline-1 rounded-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ul className="flex items-center gap-4 mb-6 justify-between py-2 md:py-1.5 px-4">
            <li><NavItem to="estudos" label="Estudos" /></li>
            <li><NavItem to="campus" label="Campus" /></li>
            <li><NavItem to="apoios" label="Apoios" /></li>
            <li><NavItem to="carreira" label="Carreira" /></li>
          </ul>
        </motion.nav>
        <Outlet />
      </main>
    </>
  )
}

const NavItem = ({ to, label }: { to: string; label: string }) => {
  const { search } = useLocation()

  return (
    <NavLink 
      to={{pathname: to, search}}
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
                className='bg-teal-mid relative z-5 py-1 px-2.5 rounded-full md:text-lg text-sm font-medium text-transparent'
                aria-hidden="true"
              >
                {label}
              </span>
            </motion.div>
          )}
          <span 
            className={`relative z-6 md:text-lg text-sm font-medium
                        ${isActive ? 'text-paper' : 'dark:text-paper/75 dark:hover:text-paper text-ink/75 hover:text-ink transition-colors'}`
                      }
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}