import { Navigate, useSearchParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";

// components
import { SubmitButton } from "../../components/forms/SubmitButton";

const getDate = (seconds: number) => {
  const time = new Date()
  time.setSeconds(time.getSeconds() + seconds)
  return time
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const {
    seconds,
    restart,
  } = useTimer({
    expiryTimestamp: getDate(30),
    onExpire: () => {},
  });

  const isLoading = false;
  const token = searchParams.get("token") || "";

  if (!searchParams.get("email")) {
    return (
      <Navigate to="/auth/register" replace />
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-between h-full py-8 px-4 gap-8">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center text-paper font-bold text-2xl">Verifique seu e-mail</h2>
          <p className="text-center text-paper">Enviamos um link de verificação para:</p>
          <p className="text-center font-bold mb-4 text-teal-light text-xl">{searchParams.get("email")}</p>
        </div>
  
        <div className="w-full self-end flex items-center flex-col gap-4">
          {seconds > 0 && (
            <p className="text-center text-paper max-w-60">Aguarde {seconds} segundos para reenviar o e-mail.</p>
          )}
          <SubmitButton
            waiting={seconds > 0 || isLoading}
            text={seconds > 0 ? "Aguarde..." : isLoading ? "Carregando..." : "Reenviar e-mail"}
            onClick={() => {
              restart(getDate(30))
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
    </>
  )

}
