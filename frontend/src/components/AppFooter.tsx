import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

// Ícones
import { IconHome } from '@tabler/icons-react';
import { IconUser } from '@tabler/icons-react';
import { IconBook2 } from '@tabler/icons-react';
import Ondinha from "../assets/icons/ondinha.svg?react";

export default function AppFooter() {
  return (
    <footer className="w-full bottom-0 bg-violet-dark flex items-center justify-center h-20 fixed">
      <motion.nav 
        className="flex justify-evenly items-center max-w-180 w-full relative"
        layout
      >
        <FooterItem to="/home" icon={IconHome}/>
        <FooterItem to="/info" icon={IconBook2}/>
        <FooterItem to="/perfil" icon={IconUser}/>
      </motion.nav>
    </footer>
  )
}

const FooterItem = ({ to, icon: Icon }: { to: string; icon: React.ComponentType }) => {
  return (
    <NavLink 
      to={to}
      className="inline-flex items-center justify-center relative"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="ondinha"
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30,
              }}
              className="absolute -top-3.5 aspect-124/39 w-28"
            >
              <Ondinha 
                className="dark:text-violet-mid"
              />
            </motion.div>
          )}
          <motion.div
            // layout
            transition={{
              type: "spring",
              duration: 0.3,
              stiffness: 800,
              damping: 30,
            }}
            className={`
              p-4 rounded-full transition-colors
              ${isActive 
                ? "bg-teal-mid" 
                : "hover:bg-violet-light/50"
              }
            `}
            animate={{
              y: isActive ? -50 : 0,
              scale: isActive ? 1.1 : 1,
            }}
          >
            <Icon />
          </motion.div>
        </>
      )}
    </NavLink>
  );
};