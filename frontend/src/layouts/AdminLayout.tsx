import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import SearchBar from "../components/SearchBar";
import { useSharedSearch } from "../hooks/useSharedSearch";
import { motion } from "framer-motion";
import { NavItem } from "../components/NavItem";


export default function AdminLayout() {
  const {value: search, setValue: setSearch} = useSharedSearch()

  return (
    <>
      <AppHeader />
      <main className="main-app">
        <div className="flex flex-row gap-4 items-center mt-10 mb-6">
          <h1 className="px-3 text-2xl font-bold">
            Administração
          </h1>
          <motion.nav className="outline-1 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ul className="flex items-center gap-6 justify-between py-2 md:py-1.5 px-4">
              <li><NavItem to="create_events" label="Eventos" /></li>
              <li><NavItem to="create_infos" label="Informações" /></li>
            </ul>
          </motion.nav>
        </div>
        <SearchBar search={search} setSearch={setSearch} isDark={true} />
        {/* <p className="px-3 text-sm text-paper-light mt-5">clique para editar ou excluir</p> */}
        <Outlet context={{ search, setSearch }} />
      </main>
    </>
  );
}