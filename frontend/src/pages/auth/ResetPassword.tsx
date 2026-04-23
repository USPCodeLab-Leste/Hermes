import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { toast } from "react-toastify";

// Components
import { SubmitButton } from "../../components/forms/SubmitButton";
import { MemoizedInputText as InputText } from "../../components/forms/InputText";
import { MemoizedInputPassword as InputPassword } from "../../components/forms/InputPassword";

// Hooks
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";
import { useResetPassword } from "../../hooks/auth/useResetPassword";
import { validateEmail } from "../../utils/regex";

export default function ResetPassword() {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("")
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
  
  const [email, setEmail] = useState(emailParam || "")
  const [emailError, setEmailError] = useState(false);

  const [sendForgotPasswordEmail, isSending, sendForgotPasswordError] = useForgotPassword(email);
  const [sendResetPasswordEmail, isResetting, sendResetPasswordError] = useResetPassword({ newPassword, token: tokenParam })

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

  // Handlers
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError(false);
  }

  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setEmailError(true);
      toast.warn("Digite seu e-mail.");
      return;
    } else if (!validateEmail(email)) {
      setEmailError(true);
      toast.warn("Digite um e-mail válido.");
      return;
    }

    await sendForgotPasswordEmail();

    // Salvar o tempo de expiração no localStorage
    const expiryTime = getExpiryTime(59);
    toast.success("Link de redefinição de senha enviado para seu e-mail!");

    localStorage.setItem("reset_password_cooldown", expiryTime.toISOString());
    restart(expiryTime);
  }, [email, getExpiryTime, restart]);

  const handleChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value)
    setNewPasswordError(false);
  }

  const handleNewPasswordSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      setNewPasswordError(true);
      toast.warn("Digite sua nova senha.");
      return;
    }

    await sendResetPasswordEmail();

    navigate("/auth/login", {
      state: { fromResetPasswordSucess: true }
    });
  }, [newPassword, sendResetPasswordEmail]);


  // Effects

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

  useEffect(() => {
    if (!sendForgotPasswordError) return;

    toast.error(sendForgotPasswordError.message || "Ocorreu um erro ao enviar o e-mail de redefinição de senha.");
    setEmailError(true);
  }, [sendForgotPasswordError])

  useEffect(() => {
    if (!sendResetPasswordError) return;

    toast.error(sendResetPasswordError.message || "Ocorreu um erro ao redefinir a senha.");
    setNewPasswordError(true);
  }, [sendResetPasswordError])

  // sem token, pede e-mail
  if (!tokenParam) {
    return (
      <>
        <h2 className="text-center font-bold text-2xl">Redefinir senha</h2>
        <p className="text-center mt-4 mb-6 max-w-70">
          Insira seu e-mail USP para receber o link de redefinição de senha
        </p>
        <form onSubmit={handleEmailSubmit} className="w-full flex flex-col pt-2 pb-8 gap-3 max-w-sm justify-center">
          <div className="flex flex-col gap-1">
            <InputText
              autocomplete="email"
              id="email"
              label="E-mail USP"
              value={email}
              onChange={handleChangeEmail}
              placeholder="E-mail USP"
              hasError={emailError}
              required={true}
            />
          </div>

          <div className="flex flex-col gap-2">
            <SubmitButton
              disabled={emailError || !email}
              waiting={isSending || isRunning}
              text={
                isSending ? "Enviando..." :
                  isRunning ? `Aguarde ${seconds}s` :
                    "Enviar link"
              }
              className="dark:bg-teal-light bg-teal-mid"
            />
          </div>

          <p className="text-center">
            volte para <Link to={{ pathname: "/auth/login", search: email ? `?email=${email}` : "" }} className="text-teal-light hover:text-teal-mid font-bold transition-colors">Login</Link>
          </p>
        </form>
      </>
    );
  }

  const hasResetPasswordError = !isNewPasswordValid || Boolean(sendResetPasswordError)

  // com token, pede nova senha
  return (
    <>
        <h2 className="text-center font-bold text-2xl">Redefinir senha</h2>
        <p className="text-center mt-4 mb-6 max-w-70">
          Insira sua nova senha para concluir a redefinição de senha
        </p>
        <form onSubmit={handleNewPasswordSubmit} className="w-full flex flex-col pt-2 pb-8 gap-3 max-w-sm justify-center">
          <InputPassword
            id="newPassword"
            label="Nova senha"
            value={newPassword}
            onChange={handleChangeNewPassword}
            onValidationChange={setIsNewPasswordValid}
            placeholder="********"
            validation={true}
            hasError={newPasswordError}
            required={true}
          />

          <div className="flex flex-col gap-2">
            <SubmitButton
              disabled={hasResetPasswordError}
              waiting={isResetting}
              text={isResetting ? "Enviando..." : "Redefinir senha"}
              className="dark:bg-teal-light bg-teal-mid"
            />
          </div>

          <p className="text-center">
            volte para <Link to='/auth/login' className="text-teal-light hover:text-teal-mid font-bold transition-colors">Login</Link>
          </p>
        </form>
    </>
  )

}
