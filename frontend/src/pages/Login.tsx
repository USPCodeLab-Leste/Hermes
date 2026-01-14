import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useSignIn } from "../hooks/useSignIn"
import { auth } from "../services/auth"

export default function Login() {
  const { isAuthenticated } = useAuth()
  const [signIn] = useSignIn(auth)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <h1>Login Page</h1>
      <button onClick={() => signIn({email: "hermes@usp.br", password: "password123"})}>Login</button>
    </>
  )
}
