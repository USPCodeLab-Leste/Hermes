import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { motion } from "framer-motion";
import { NavItem } from "../components/NavItem";


export default function AdminLayout() {
  return (
    <>
      <AppHeader />
      <main className="main-app">
        <div className="flex flex-col md:flex-row gap-4 md:justify-between items-center mt-10 mb-6">
          <h1 className="px-3 text-2xl font-bold">
            Administração
          </h1>
          <motion.nav className="outline-1 rounded-full md:w-fit md:m-0 m-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ul className="flex items-center gap-6 justify-evenly py-2 md:py-1.5 px-4">
              <li><NavItem to="create_events" label="Eventos" /></li>
              <li><NavItem to="create_infos" label="Informações" /></li>
              <li><NavItem to="create_tags" label="Tags" /></li>
            </ul>
          </motion.nav>
        </div>
        <Outlet />
      </main>
    </>
  );
}