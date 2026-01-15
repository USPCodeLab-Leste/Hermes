import { Link, useSearchParams } from "react-router-dom";

// components
import { SubmitButton } from "../../components/SubmitButton";
import { InputEmail } from "../../components/InputEmail";
import { useState } from "react";


export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get("email") || "")
  // const [password, setPassword] = useState("")

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const isLoading = false;
  const token = searchParams.get("token") || "";

  // sem token, pede e-mail
  if (!token) {
    return (
      <>
        <h2 className="text-center text-white font-bold text-2xl">Redefinir senha</h2>
        <p className="text-center text-white mt-4">Insira seu e-mail USP para receber o link de redefinição de senha</p>
        <form onSubmit={handleFormSubmit} className="flex flex-col pt-2 pb-8 gap-3 h-full">
          <div className="flex flex-col gap-1">
            <InputEmail 
              id="email"
              label="E-mail USP"
              value={email}
              onChange={handleChange}
              isLoading={isLoading}
              placeholder="E-mail USP"
              pattern=".+@usp\.br" 
              title="Por favor, utilize um e-mail com domínio @usp.br"
            />
          </div>
  
          <SubmitButton
            waiting={isLoading}
            text={isLoading ? "Carregando..." : "Enviar link"}
          />
        </form>
  
        <Link to="/auth/login" className="text-white text-center mt-2 hover:underline">Voltar para login</Link>
  
        {/* <p className="text-white text-center">Já tem uma conta? <Link to={`/auth/login?email=${formData.email}`} className="text-amber-400 hover:text-amber-500 font-bold">Faça login</Link></p> */}
      </>
    );
  }

  // com token, pede nova senha
  return (
    <>
      {/* TODO: implementar redefinição de senha */}
    </>
  )

}
