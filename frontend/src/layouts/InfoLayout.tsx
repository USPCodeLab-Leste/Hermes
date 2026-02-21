import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion';

// Components
import AppHeader from '../components/AppHeader'
import SearchBar from "../components/SearchBar";
import { NavItem } from '../components/NavItem';

// Hooks
import { useSharedSearch } from '../hooks/useSharedSearch';

export default function InfoLayout() {
  const {value: search, setValue: setSearch} = useSharedSearch()
  
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
        <Outlet context={{ search }} />
      </main>
    </>
  )
}