import { useEffect, useState } from "react"
import { toast } from 'react-toastify';
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
  const [signIn, user, signInLoading] = useSignIn(auth)

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    password: "",
  })

  // Helper para atualizar inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Salva os dados ao digitar
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))

    // Limpa erro ao digitar
    if (errors[e.target.id as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.id]: false })
    }
  }

  const handleLogin = async () => {
    const newErrors = { email: false, password: false };
    let hasLocalError = false;

    //Validação email
    if (!formData.email) {
      toast.error("O campo e-mail é obrigatório!")
      newErrors.email = true;
      hasLocalError = true;
    } else if (!formData.email.endsWith("@usp.br")) {
      toast.error("Por favor, utilize seu e-mail institucional (@usp.br).");
      newErrors.email = true;
      hasLocalError = true;
    }

    //Validação senha
    if (formData.password.length < 8) {
      toast.error("Credenciais inválidas!")
      newErrors.email = true;
      newErrors.password = true;
      hasLocalError = true;
    }

    if (hasLocalError) {
      setErrors(newErrors);
      return;
    };

    // Chamada ao hook de login
    try {
      setErrors({ email: false, password: false });
      await signIn({ email: formData.email, password: formData.password });

    } catch (error) {
      // Tratamento de erro no login
      console.error(error);
      toast.error("Credenciais inválidas!"); // Ou use error.message se vier do back
      setErrors({ email: true, password: true });
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin()
  }

  const isLoading = signInLoading;

  if (user) {
    return (
      <Navigate to="/" replace />
    )
  }

  return (
    <form onSubmit={handleFormSubmit} noValidate={true} className="w-full flex flex-col pt-2 pb-8 gap-3 max-w-sm justify-center">

      <div className="flex flex-col gap-1">
        <InputEmail
          id="email"
          label="E-mail USP"
          value={formData.email}
          onChange={handleChange}
          isLoading={isLoading}
          placeholder="E-mail USP"
          hasError={errors.email}
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
            validation={false}
            hasError={errors.password}
          />
          <Link to={{ pathname: "/auth/reset-password", search: formData.email ? `?email=${formData.email}` : "" }} className="text-sm text-paper text-right mb-2 hover:underline">Esqueci minha senha</Link>
        </div>
      </div>

      <SubmitButton waiting={isLoading} text={isLoading ? "Carregando..." : "Entrar"} />

      <p className="text-paper text-center">ou <Link to={{ pathname: "/auth/register", search: formData.email ? `?email=${formData.email}` : "" }} className="text-teal-light hover:text-teal-mid font-bold transition-colors">Registre-se</Link></p>

    </form>
  )
}