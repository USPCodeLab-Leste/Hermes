import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// Ícones
import IconHome from "../assets/icons/home.svg?react";
import IconBook from "../assets/icons/book.svg?react";
import IconUser from "../assets/icons/user.svg?react";
import Ondinha from "../assets/ondinha.svg?react";

export default function AppFooter() {
  return (
    <footer className="w-full bottom-0 bg-violet-dark flex items-center justify-center 
                       h-20 fixed shadow-paper-top dark:shadow-violet-top">
      <motion.nav 
        className="flex justify-evenly items-center max-w-180 w-full relative"
        layout
      >
        <FooterItem to="/home" icon={IconHome}/>
        <FooterItem to="/info" icon={IconBook}/>
        <FooterItem to="/perfil" icon={IconUser}/>
      </motion.nav>
    </footer>
  )
}

const FooterItem = ({ to, icon: Icon }: { to: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) => {
  const { search } = useLocation()
  
  return (
    <NavLink 
      to={{pathname: to, search}}
      className="inline-flex items-center justify-center relative"
      tabIndex={9}
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
              className="absolute -top-[15px] aspect-124/39 w-28 pointer-events-none"
              aria-hidden="true"
            >
              <Ondinha 
                className="dark:text-violet-mid text-paper z-4"
              />
            </motion.div>
          )}
          <motion.div
            // layout
            transition={{
              type: "spring",
              stiffness: 800,
              damping: 30,
            }}
            className={`
              p-4 rounded-full transition-colors relative z-5
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
            <Icon className="text-paper" />
          </motion.div>
        </>
      )}
    </NavLink>
  );
};