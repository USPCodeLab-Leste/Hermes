import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom'

// Components
import AppHeader from '../components/AppHeader'
import SearchBar from "../components/SearchBar";

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
        <nav>
          <ul className="flex gap-4 mb-6">
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
    <NavLink to={to}>
      {label}
    </NavLink>
  )
}