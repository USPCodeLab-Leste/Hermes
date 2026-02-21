import { useCallback, useEffect, useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// components
import { MemoizedInputText as InputText } from "../../components/forms/InputText";
import { MemoizedInputPassword as InputPassword } from "../../components/forms/InputPassword";
import { SubmitButton } from "../../components/forms/SubmitButton";

// hooks
import { auth } from "../../services/auth";
import { useRegister } from "../../hooks/auth/useRegister";

const defaultFormErrors = {
  email: {
    hasError: false,
    message: ''
  },
  name: {
    hasError: false,
    message: ''
  },
  password: {
    hasError: false,
    message: ''
  },
  confirmPassword: {
    hasError: false,
    message: ''
  }
}

export default function Register() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Hooks de autenticação
  const [register, regLoading, regError] = useRegister(auth);
  const [errors, setErrors] = useState(structuredClone(defaultFormErrors));

  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  // Helper para atualizar inputs
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Salva os dados ao digitar
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

    // Limpa erro ao digitar
    setErrors({
      ...errors,
      [e.target.id]: { hasError: false, message: '' }
    });
  }, [errors]);

  const handleRegister = useCallback(async () => {
    let hasLocalError = false;
    const newErrors = structuredClone(defaultFormErrors);

    if (!isPasswordValid) {
      newErrors.password.hasError = true;
      hasLocalError = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword.hasError = true;
      newErrors.confirmPassword.message = "As senhas não conferem!";
      hasLocalError = true;
    }

    if (formData.email.trim() === "") {
      newErrors.email.hasError = true;
      newErrors.email.message = "O campo e-mail é obrigatório!";
      hasLocalError = true;
    } else if (!formData.email.endsWith("@usp.br")) {
      newErrors.email.hasError = true;
      newErrors.email.message = "Por favor, utilize seu e-mail institucional (@usp.br).";
      hasLocalError = true;
    }

    if (formData.name.trim() === "") {
      newErrors.name.hasError = true;
      newErrors.name.message = "O campo nome é obrigatório!";
      hasLocalError = true;
    }

    if (hasLocalError) {
      setErrors(newErrors);
      return;
    }

    await register({
      email: formData.email,
      name: formData.name,
      password: formData.password,
    });

    navigate("/auth/login", {
      state: { fromRegisterSucess: true }
    });
  }, [formData, isPasswordValid, navigate, register]);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister()
  }, [handleRegister]);

  useEffect(() => {
    if (regError) {
      // TODO: tratar erros vindos do backend de acordo com difrentes status codes
    }
  }, [regError]);

  const isLoading = regLoading;

  return (
    <form onSubmit={handleFormSubmit} className="w-full flex flex-col pt-2 pb-8 gap-3 max-w-sm justify-center">

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
          hasError={errors.email.hasError}
          errorMessage={errors.email.message}
          required={true}
        />
      </div>

      <div className="overflow-hidden">
        <div className="flex flex-col gap-3">
          <InputText
            id="name"
            label="Nome de usuário"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Hermes"
            autocomplete="username"
            hasError={errors.name.hasError}
            errorMessage={errors.name.message}
            required={true}
          />
          <InputPassword
            id="password"
            label="Crie uma senha"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="********"
            validation={true}
            autocomplete="new-password"
            onValidationChange={setIsPasswordValid}
            hasError={errors.password.hasError}
            required={true}
          />
          <InputPassword
            id="confirmPassword"
            label="Confirme a senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="********"
            validation={false}
            autocomplete="new-password"
            hasError={errors.confirmPassword.hasError}
            errorMessage={errors.confirmPassword.message}
          />
        </div>
      </div>

      <SubmitButton waiting={isLoading} text={isLoading ? "Carregando..." : "Cria Conta"} />

      <p className="text-paper text-center">
        ou faça <Link to={{ pathname: "/auth/login", search: formData.email ? `?email=${formData.email}` : "" }} className="text-teal-light hover:text-teal-mid font-bold transition-colors">Login</Link>
      </p>

    </form>
  );
}
