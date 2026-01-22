import { useSignOut } from "../hooks/useSignOut";
import { useTheme } from "../hooks/useTheme";
import { auth } from "../services/auth";
import PerfilButton from "../components/PerfilButton";
import type { MouseEventHandler, SVGProps, ComponentType } from "react";

// icones
import UserIcon from "../assets/icons/userIcon.svg?react";
import DarkModeIcon from "../assets/icons/DarkModeIcon.svg?react";
import BellIcon from "../assets/icons/bellIcon.svg?react"
import BugIcon from "../assets/icons/bugIcon.svg?react";
import InfoIcon from "../assets/icons/infoIcon.svg?react";
import PasswordIcon from "../assets/icons/passwordIcon.svg?react"
import LogoutIcon from "../assets/icons/tabler_logout.svg?react"
import LeftArrow from "../assets/icons/chevron-left.svg?react"

export default function Perfil() {
  const [signOut] = useSignOut(auth);
  const { toggleTheme } = useTheme();

  // onClick Functions (alterar para as funcoes ou router corretos)
  const handlePerfil = () => console.log("Perfil ok");
  const handleSenha = () => console.log("Senha ok");
  const handleNotificacoes = () => console.log("Notificacoes");
  const handleDarkMode = toggleTheme; 
  const handleBug = () => {};
  const handleInfo = () => {};
  //seria interessante criar um interface para esses objetos

  interface PerfilAction {
    label: string
    icon: ComponentType<SVGProps<SVGSVGElement>>,
    onClick: MouseEventHandler<HTMLButtonElement>,
  }


  const actions: PerfilAction[] = [
    { label: "Gerenciar Perfil", icon: UserIcon, onClick: handlePerfil },
    { label: "Alterar Senha", icon: PasswordIcon, onClick: handleSenha },
    { label: "Notificações", icon: BellIcon, onClick: handleNotificacoes },
    { label: "Dark Mode", icon: DarkModeIcon, onClick: handleDarkMode },
    { label: "Relatar Bugs", icon: BugIcon, onClick: handleBug },
    { label: "Informações", icon: InfoIcon, onClick: handleInfo },
    { label: "Sair", icon: LogoutIcon, onClick: signOut },
  ];

  return (
    <section className=" flex flex-col items-center">
      <div className="w-screen flex items-center flex-col text-paper dark:text-paper bg-violet-dark  mb-6 pb-5.5 gap-5 rounded-b-2xl">
        <div className="mt-6 mp-5 mx-4 flex justify-center w-screen">
          <LeftArrow className="w-6 h-6 absolute ml-4 left-0"/>
          <h6 className="text-[20px]/[24px] ">Perfil</h6>
        </div>
       {/* <img src="" alt="iamgem de perfil" />*/}
       <div className="flex flex-col justify-center items-center">
          <h5 className="text-[24px]/[28px] font-bold">Code Laber da Silva</h5>
          <span className="text-[16px]/[20px]">email@email.com</span>
       </div>
        
      </div>
      
      {actions.map(action => (
        
        <PerfilButton
          key={action.label}
          btnName={action.label}
          icon={<action.icon className="w-6 h-5" />}
          onClick={action.onClick}
        />
      ))}
    </section>
  )
}