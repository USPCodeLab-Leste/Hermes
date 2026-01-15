import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

// components
import { InputText } from "../../components/InputText";
import { InputPassword } from "../../components/InputPassword";
import { InputEmail } from "../../components/InputEmail";
import { SubmitButton } from "../../components/SubmitButton";

// hooks
import { auth } from "../../services/auth";
import { useRegister } from "../../hooks/useRegister";

export default function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Hooks de autenticação
  const [register, regLoading, regError] = useRegister(auth);
  const [formError, setFormError] = useState<string | null>(null); // Novo estado para erros em vez de alert

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  // Helper para atualizar inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setFormError(null); // Limpa erro ao digitar
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setFormError("As senhas não conferem!");
      return;
    }

    await register({
      email: formData.email,
      name: formData.name,
      password: formData.password,
    });
    // TODO: chamar função de envio de email de verificação e só então navegar
    navigate(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    handleRegister()
  };

  useEffect(() => {
    if (regError) {
      setFormError(regError.message);
    }
  }, [regError]);

  const isLoading = regLoading;

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col pt-2 pb-8 gap-3 h-full">
      {/* Input do email sempre visivel, mas fica readOnly quando não estiver na fase de verificação de email ou se estiver carregando  */}
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

      <motion.div
        initial={false}
        animate={{
          height: "auto",
          opacity: 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="register-fields"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-3"
          >
            <InputText
              id="name"
              label="Nome de usuário"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Usuário"
              autocomplete="username"
              required={true}
            />
            <InputPassword
              id="password"
              label="Crie uma senha"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Senha"
            />
            <InputPassword
              id="confirmPassword"
              label="Confirme a senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Confirme a senha"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Mensagem de Erro Inline PROVISORIO*/}
      {formError && (
        <p className="text-red-300 text-sm font-bold text-center bg-red-900/20 p-2 rounded-lg">
          {formError}
        </p>
      )}

      <SubmitButton waiting={isLoading} text={isLoading ? "Carregando..." : "Registrar"} />

      <p className="text-white text-center">Já tem uma conta? <Link to={{ pathname: "/auth/login", search: formData.email ? `?email=${formData.email}` : "" }} className="text-amber-400 hover:text-amber-500 font-bold">Faça login</Link></p>

    </form>
  );
}
