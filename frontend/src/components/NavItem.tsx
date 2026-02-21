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