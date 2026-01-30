import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { toast } from "react-toastify";

// components
import { SubmitButton } from "../../components/forms/SubmitButton";
import { MemoizedInputText as InputText } from "../../components/forms/InputText";


export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get("email") || "")

  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState(false);

  // Helper para obter tempo de expiração
  const getExpiryTime = useCallback((seconds: number) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + seconds);
    return time;
  }, []);

  // Configuração do timer
  const {
    seconds,
    restart,
    isRunning,
  } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
    onExpire: () => {
      // Limpa a chave ESPECÍFICA de reset de senha
      localStorage.removeItem("reset_password_cooldown");
    },
  });

  // Restaurar timer ao recarregar a página (F5)
  useEffect(() => {
    const savedTime = localStorage.getItem("reset_password_cooldown");
    if (savedTime) {
      const expiryDate = new Date(savedTime);
      const now = new Date();
      if (expiryDate > now) {
        restart(expiryDate);
      } else {
        localStorage.removeItem("reset_password_cooldown");
      }
    }
  }, [restart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError(false);
  }

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setEmailError(true);
      toast.warn("Digite seu e-mail.");
      return;
    }else if (!email.endsWith("@usp.br")) {
      toast.error("Por favor, utilize seu e-mail institucional (@usp.br).");
      setEmailError(true);
      return;
    }

    setIsSending(true);

    // TODO: implementar envio de e-mail
    // await sendLink(email);


    // Salvar o tempo de expiração no localStorage
    const expiryTime = getExpiryTime(59);
    toast.success("Link de redefinição de senha enviado para seu e-mail!");
    localStorage.setItem("reset_password_cooldown", expiryTime.toISOString());
    restart(expiryTime);

    setIsSending(false);
  }, [email, getExpiryTime, restart]);

  const token = searchParams.get("token") || "";

  // sem token, pede e-mail
  if (!token) {
    return (
      <>
        <h2 className="text-center text-paper font-bold text-2xl">Redefinir senha</h2>
        <p className="text-center text-paper mt-4 mb-6 max-w-70">
          Insira seu e-mail USP para receber o link de redefinição de senha
        </p>
        <form onSubmit={handleFormSubmit} className="w-full flex flex-col pt-2 pb-8 gap-3 max-w-sm justify-center">
          <div className="flex flex-col gap-1">
            <InputText
              autocomplete="email"
              id="email"
              label="E-mail USP"
              value={email}
              onChange={handleChange}
              placeholder="E-mail USP"
              hasError={emailError}
              required={true}
            />
          </div>

          <div className="flex flex-col gap-2">
            <SubmitButton
              waiting={isSending || isRunning}
              text={
                isSending ? "Enviando..." :
                  isRunning ? `Aguarde ${seconds}s` :
                    "Enviar link"
              }
            />
          </div>

          <p className="text-paper text-center">
            volte para <Link to={{ pathname: "/auth/login", search: email ? `?email=${email}` : "" }} className="text-teal-light hover:text-teal-mid font-bold transition-colors">Login</Link>
          </p>
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
