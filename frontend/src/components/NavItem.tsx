import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const NavItem = ({ to, label }: { to: string; label: string }) => {
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
                stiffness: 300, 
                damping: 30,
              }}
              className="absolute z-5 md:-top-0.5 md:-bottom-0.5 -top-1 -bottom-1 -left-3 -right-3 bg-teal-mid rounded-full"
              aria-hidden="true"
            >
            </motion.div>
          )}
          <span 
            className={`relative z-6 sm:text-sm md:text-md text-[11px] font-medium inline-block p ${isActive ? 'text-paper' : 'dark:text-paper/75 dark:hover:text-paper text-ink/75 hover:text-ink transition-colors'}`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}