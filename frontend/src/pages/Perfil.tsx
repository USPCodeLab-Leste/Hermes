import { useSignOut } from "../hooks/useSignOut";
import { useTheme } from "../hooks/useTheme";
import { auth } from "../services/auth";
import PerfilButton from "../components/PerfilButton";
import { type MouseEventHandler, type SVGProps, type ComponentType, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMe } from "../hooks/useMe";

// icones
import UserIcon from "../assets/icons/user.svg?react";
import DarkModeIcon from "../assets/icons/moon.svg?react";
import BellIcon from "../assets/icons/bell.svg?react"
import BugIcon from "../assets/icons/bug.svg?react";
import InfoIcon from "../assets/icons/info.svg?react";
import PasswordIcon from "../assets/icons/lock.svg?react"
import LogoutIcon from "../assets/icons/tabler_logout.svg?react"
import LightModeIcon from "../assets/icons/sun.svg?react"
import PencilIcon from "../assets/icons/pencil.svg?react"
import { motion, stagger, type Variants } from "framer-motion";

const variants: Variants = {
  visible: { 
    transition: {
      delayChildren: stagger(0.05),
    },
  }
}

const variantsChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      // ease: "easeOut", 
      // duration: 0.3,
      type: 'spring',
      stiffness: 320,
      damping: 20,
    }
  },
}
interface PerfilAction {
  id: number,
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>,
  onClick: MouseEventHandler<HTMLButtonElement>,
}

export default function Perfil() {
  const navigate = useNavigate();
  const [signOut] = useSignOut(auth);
  const { theme , toggleTheme } = useTheme();
  const { data: user } = useMe();
  const isDark = theme === 'dark';


  // onClick Functions (alterar para as funcoes ou router corretos)
  const handlePerfil = () => console.log("Perfil ok");
  const handleSenha = () => console.log("Senha ok");
  const handleNotificacoes = () => console.log("Notificacoes");
  const handleDarkMode = toggleTheme;
  const handleBug = () => {};
  const handleInfo = () => {};
  const handleAdmin = () => navigate("admin");

  const actions: PerfilAction[] = useMemo(() => [
    ...(user?.role === "ADMIN" ? [{ label: "Painel Admin", icon: PencilIcon, onClick: handleAdmin }] : []),
    { label: "Gerenciar Perfil", icon: UserIcon, onClick: handlePerfil },
    { label: "Alterar Senha", icon: PasswordIcon, onClick: handleSenha },
    { label: "Notificações", icon: BellIcon, onClick: handleNotificacoes },
    { label: isDark ? "Modo Claro" : "Modo Escuro", icon: isDark ? LightModeIcon : DarkModeIcon, onClick: handleDarkMode },
    { label: "Relatar Bugs", icon: BugIcon, onClick: handleBug },
    { label: "Informações", icon: InfoIcon, onClick: handleInfo },
    { label: "Sair", icon: LogoutIcon, onClick: signOut },
  ].map((action, index) => ({ ...action, id: index })), [isDark, user?.role, handleDarkMode, handleBug, handleInfo, handleNotificacoes, handlePerfil, handleSenha, handleAdmin, signOut]);

  return (
    <>
      <header className="flex items-center flex-col text-paper dark:text-paper bg-violet-dark  mb-6 pb-7.5 gap-5 rounded-b-2xl">
        <div className="mt-6 mp-5 mx-4 flex justify-center">
          <h6 className="text-[20px]/[24px] ">Perfil</h6>
        </div>
        {/* <img src="" alt="iamgem de perfil" />*/}
        <div className="flex flex-col justify-center items-center">
          {user?.name ? (
            <div className="flex flex-row justify-center items-center gap-2">
              <h5 className="text-[24px]/[28px] font-bold capitalize">{user?.name}</h5>
              {user?.role === "ADMIN" && <span className="text-[10px] font-medium bg-teal-mid p-1 rounded">ADM</span>}
            </div>
          ) : (
            <h5 className="text-[24px]/[28px] font-bold capitalize shimmer rounded-full text-transparent" aria-hidden="true">nome alguém</h5>
          )}
          {user?.email ? (
            <span className="text-[16px]/[20px] lowercase">{user?.email}</span>
          ) : (
            <span className="text-[16px]/[20px] lowercase shimmer rounded-full text-transparent" aria-hidden="true">email_exe@usp.br</span>
          )}
        </div>
        
      </header>
      <main className="main-app flex flex-col justify-center">
        <motion.section 
          className="flex flex-col items-center justify-center gap-4"
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          
          {actions.map(action => (
            <PerfilButton
              key={action.id}
              btnName={action.label}
              icon={<action.icon className="w-6 h-5" />}
              onClick={action.onClick}
              variants={variantsChild}
            />
          ))}
        </motion.section>
      </main>
    </>
  )
}