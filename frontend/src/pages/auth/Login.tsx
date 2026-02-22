import { useCallback, useEffect, useState } from "react"
import { toast } from 'react-toastify';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router";

// components
import { MemoizedInputPassword as InputPassword } from "../../components/forms/InputPassword";
import { MemoizedInputText as InputText } from "../../components/forms/InputText";
import { SubmitButton } from "../../components/forms/SubmitButton";

// hooks
import { auth } from "../../services/auth"
import { useSignIn } from '../../hooks/auth/useSignIn';

export default function Login() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  // Hooks de autenticação
  const [signIn, user, signInLoading, signInError] = useSignIn(auth)

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    password: "",
  })

  // Helper para atualizar inputs
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Salva os dados ao digitar
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))

    // Limpa erro ao digitar
    setErrors(prev => ({
      ...prev,
      [e.target.id]: false
    }))
  }, [])

  const handleLogin = useCallback(async () => {
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
    } else if (formData.password.length < 8) {
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
    setErrors({ email: false, password: false });
    await signIn({ email: formData.email, password: formData.password });

  }, [formData, signIn])

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin()
  }, [handleLogin])

  const isLoading = signInLoading;
  const passwordShort = formData.password.length < 8 && formData.password.length >= 0;

  useEffect(() => {
    if (signInError) {
      toast.error("Credenciais inválidas!"); // Ou use error.message se vier do back
      setErrors({ email: true, password: true });
    }
  }, [signInError]);

  useEffect(() => {
    if (location.state?.fromRegisterSucess) {
      toast.success("Registro realizado com sucesso! Verifique seu e-mail para ativar sua conta.");
      navigate(".", { replace: true });
    }
  }, [location, navigate])

  if (user) {
    return (
      <Navigate to="/" replace />
    )
  }

  return (
    <form onSubmit={handleFormSubmit} noValidate={true} className="w-full flex flex-col pt-2 pb-8 gap-3 max-w-sm justify-center">

      <div className="flex flex-col gap-1">
        <InputText
          type="text"
          autocomplete="email"
          id="email"
          label="E-mail USP"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="hermes@usp.br"
          hasError={errors.email}
          required={true}
        />
      </div>

      <div className="overflow-hidden">
        <div className="flex flex-col gap-3">
          <InputPassword
            id="password"
            label="Senha"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="********"
            validation={false}
            autocomplete="current-password"
            hasError={errors.password}
            required={true}
          />
          <Link to={{ pathname: "/auth/reset-password", search: formData.email ? `?email=${encodeURIComponent(formData.email)}` : "" }} className="text-sm text-paper text-right mb-2 hover:underline">Esqueci minha senha</Link>
        </div>
      </div>

      <SubmitButton waiting={isLoading || passwordShort} text={isLoading ? "Carregando..." : "Entrar"} />

      <p className="text-paper text-center">
        ou <Link to={{ pathname: "/auth/register", search: formData.email ? `?email=${encodeURIComponent(formData.email)}` : "" }} className="text-teal-light hover:text-teal-mid font-bold transition-colors">Registre-se</Link>
      </p>

    </form>
  )
}