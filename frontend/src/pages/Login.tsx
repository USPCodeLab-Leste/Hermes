import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Login() {
  const { login, isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <h1>Login Page</h1>
      <button onClick={() => login('dummy-token')}>Login</button>
    </>
  )
}
