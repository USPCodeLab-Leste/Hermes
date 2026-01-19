import { useSignOut } from "../hooks/useSignOut";
import { auth } from "../services/auth";
import PerfilButton from "../components/PerfilButton";

// icones
import userIcon from "../assets/icons/userIcon.svg";
import darkModeIcon from "../assets/icons/DarkModeIcon.svg";
import bellIcon from "../assets/icons/bellIcon.svg"
import bugIcon from "../assets/icons/bugIcon.svg";
import infoIcon from "../assets/icons/infoIcon.svg";
import passwordIcon from "../assets/icons/passwordIcon.svg"
import logoutIcon from "../assets/icons/tabler_logout.svg"

export default function Perfil() {
  const [signOut] = useSignOut(auth);

  return (
    <section>
      
      <p>Esta é a página de perfil do usuário.</p>
      <img src="" alt="iamgem de perfil" /> // fazer um get aqui depois
      <h5>User name</h5>
      <p className="Subtitle">email@email.com</p>

      <PerfilButton btnName="Gerenciar Perfil" icon={<img src={userIcon} alt="" aria-hidden="true"/>} onClick={() => {console.log("Perfil ok")} }/>
      <PerfilButton btnName="Alterar Senha" icon={<img src={passwordIcon} alt="" aria-hidden="true"/>} onClick={() => {console.log("Senha ok")} }/>
      <PerfilButton btnName="Notificações" icon={<img src={bellIcon} alt="" aria-hidden="true"/>} onClick={() => {console.log("Senha ok")} }/>
      <PerfilButton btnName="Dark Mode" icon={<img src={darkModeIcon} alt="" aria-hidden="true"/>} onClick={() => {console.log("Dark mode on")}}/>
      <PerfilButton btnName="Relatar Bugs" icon={<img src={bugIcon} alt="" aria-hidden="true"/>} onClick={() => {}}/>
      <PerfilButton btnName="Informações" icon={<img src={infoIcon} alt="" aria-hidden="true"/>} onClick={() => {}}/>
      <PerfilButton btnName="Sair"  icon={<img src={logoutIcon} alt="" aria-hidden="true"/>} onClick={() => signOut()}/>
    </section>
  )
}