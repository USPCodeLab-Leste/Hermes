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

  // onClick Functions (alterar para as funcoes ou router corretos)
  const handlePerfil = () => console.log("Perfil ok");
  const handleSenha = () => console.log("Senha ok");
  const handleNotificacoes = () => console.log("Notificacoes");
  const handleDarkMode = () => {}; //() => setDarkMode
  const handleBug = () => {};
  const handleInfo = () => {};
  //seria interessante criar um interface para esses objetos
  const actions = [
    { label: "Gerenciar Perfil", icon: userIcon, onClick: handlePerfil },
    { label: "Alterar Senha", icon: passwordIcon, onClick: handleSenha },
    { label: "Notificações", icon: bellIcon, onClick: handleNotificacoes },
    { label: "Dark Mode", icon: darkModeIcon, onClick: handleDarkMode },
    { label: "Relatar Bugs", icon: bugIcon, onClick: handleBug },
    { label: "Informações", icon: infoIcon, onClick: handleInfo },
    { label: "Sair", icon: logoutIcon, onClick: signOut },
  ];

  return (
    <section>
      
      <p>Esta é a página de perfil do usuário.</p>
      <img src="" alt="iamgem de perfil" />
      <h5>User name</h5>
      <p className="Subtitle">email@email.com</p>

      {actions.map(action => (
        <PerfilButton
          key={action.label}
          btnName={action.label}
          icon={<img src={action.icon} alt="" aria-hidden="true" />}
          onClick={action.onClick}
        />
      ))}
    </section>
  )
}