import { useSignOut } from "../hooks/useSignOut";
import { auth } from "../services/auth";

export default function Perfil() {
  const [signOut] = useSignOut(auth);

  return (
    <div>
      <h2>Perfil</h2>
      <p>Esta é a página de perfil do usuário.</p>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  )
}