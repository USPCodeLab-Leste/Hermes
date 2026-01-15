import { Navigate, useSearchParams } from "react-router-dom";
import { useTimer } from "react-timer-hook";

// components
import { SubmitButton } from "../../components/SubmitButton";

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
          <h2 className="text-center text-white font-bold text-2xl">Verifique seu e-mail</h2>
          <p className="text-center text-white">Enviamos um link de verificação para:</p>
          <p className="text-center font-bold mb-4 text-amber-400 text-xl">{searchParams.get("email")}</p>
        </div>
  
        <div className="w-full self-end flex items-center flex-col gap-4">
          {seconds > 0 && (
            <p className="text-center text-white max-w-60">Aguarde {seconds} segundos para reenviar o e-mail.</p>
          )}
          <SubmitButton
            waiting={seconds > 0 || isLoading}
            text={seconds > 0 ? "Aguarde..." : isLoading ? "Carregando..." : "Reenviar e-mail"}
            onClick={() => {
              restart(getDate(30))
            }}
          />
        </div>
  
        {/* <p className="text-white text-center">Já tem uma conta? <Link to={`/auth/login?email=${formData.email}`} className="text-amber-400 hover:text-amber-500 font-bold">Faça login</Link></p> */}
      </div>
    );
  }

  return (
    <>
    </>
  )

}
