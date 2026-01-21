import { useEffect, useState } from "react"
// import { AnimatePresence, motion } from "motion/react";
import { Link, Navigate, useSearchParams } from "react-router";

// components
import { InputPassword } from "../../components/InputPassword"
import { InputEmail } from "../../components/InputEmail";
import { SubmitButton } from "../../components/SubmitButton";

// hooks
import { auth } from "../../services/auth"
import { useSignIn } from '../../hooks/useSignIn';

export default function Login() {
  const [searchParams] = useSearchParams()

  // Hooks de autenticação
  const [signIn, user, signInLoading, signInError] = useSignIn(auth)
  const [formError, setFormError] = useState<string | null>(null) // Novo estado para erros em vez de alert

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    password: "",
  })

  // Helper para atualizar inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    setFormError(null) // Limpa erro ao digitar
  }

  const handleLogin = async () => {
    signIn({ email: formData.email, password: formData.password })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    handleLogin()
  }

  useEffect(() => {
    if (signInError) {
      setFormError(signInError.message)
    }
  }, [signInError])

  const isLoading = signInLoading;

  if (user) {
    return (
      <Navigate to="/" replace />
    )
  }

  return (
    <form onSubmit={handleFormSubmit} className="w-full flex flex-col pt-2 pb-8 gap-3 max-w-sm justify-center">
      
      <div className="flex flex-col gap-1">
        <InputEmail
          id="email"
          label="E-mail USP"
          value={formData.email}
          onChange={handleChange}
          isLoading={isLoading}
          placeholder="E-mail USP"
          pattern=".+@usp\.br"
          title="Por favor, utilize um e-mail com domínio @usp.br"
        />
      </div>

      <div className="overflow-hidden">
        <div className="flex flex-col gap-3">
          <InputPassword
            id="password"
            label="Digite sua senha"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Senha"
          />
          <Link to={{ pathname: "/auth/reset-password", search: formData.email ? `?email=${formData.email}` : "" }} className="text-sm text-paper text-right mb-2 hover:underline">Esqueci minha senha</Link>
        </div>
      </div>

      {/* Mensagem de Erro Inline PROVISORIO*/}
      {formError && (
        <p className="text-red-300 text-sm font-bold text-center bg-red-900/20 p-2 rounded-lg">
          {formError}
        </p>
      )}

      <SubmitButton waiting={isLoading} text={isLoading ? "Carregando..." : "Entrar"} />

      <p className="text-paper text-center">ou <Link to={{ pathname: "/auth/register", search: formData.email ? `?email=${formData.email}` : "" }} className="text-teal-light hover:text-teal-mid font-bold transition-colors">Registre-se</Link></p>

    </form>
  )
}