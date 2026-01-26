import { Link, useSearchParams } from "react-router-dom";

// components
import { SubmitButton } from "../../components/forms/SubmitButton";
import { MemoizedInputText as InputText } from "../../components/forms/InputText";
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
        <h2 className="text-center text-paper font-bold text-2xl">Redefinir senha</h2>
        <p className="text-center text-paper mt-4 mb-6 max-w-70">Insira seu e-mail USP para receber o link de redefinição de senha</p>
        <form onSubmit={handleFormSubmit} className="w-full flex flex-col pt-2 pb-8 gap-3 max-w-sm justify-center">
          <div className="flex flex-col gap-1">
            <InputText
              type="text"
              autocomplete="email"
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

          <p className="text-paper text-center">volte para <Link to={{ pathname: "/auth/login", search: email ? `?email=${email}` : "" }} className="text-teal-light hover:text-teal-mid font-bold transition-colors">Login</Link></p>
        </form>
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
