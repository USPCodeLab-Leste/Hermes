import { useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { motion, AnimatePresence } from "motion/react"

import YoutubeIcon from '../assets/brand-youtube.svg?react'
import DiscordIcon from '../assets/brand-discord.svg?react'
import InstagramIcon from '../assets/brand-instagram.svg?react'
import logoHermes from '../assets/temp-logo.png'

// hooks
import { auth } from "../services/auth"
import { useSignIn } from './../hooks/useSignIn';
import { useRegister } from "../hooks/useRegister"
import { useCheckEmail } from "../hooks/useCheckEmail"

export default function Login() {
  const { isAuthenticated } = useAuth()

  // Hooks de autenticação
  const [signIn, signInLoading, signInError] = useSignIn(auth)
  const [register, regLoading, regError] = useRegister(auth)
  const [checkEmail, checkLoading, checkError] = useCheckEmail(auth)

  const [step, setStep] = useState<'check_email' | 'login' | 'register'>('check_email')
  const [formError, setFormError] = useState<string | null>(null) // Novo estado para erros em vez de alert

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  // Redireciona se já estiver logado
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Helper para atualizar inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    setFormError(null) // Limpa erro ao digitar
  }

  // Helper para tratar mensagens de erro de forma segura
  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  const handleCheckEmailStep = async () => {
    if (!formData.email) {
      setFormError("Por favor, digite um e-mail.")
      return
    }

    try {
      await checkEmail(formData.email)
      // Sucesso = Email disponível -> Vai para cadastro
      setStep('register')
    } catch {
      // Erro = Email já cadastrado -> Vai para login
      setStep('login')
    }
  }

  const handleLoginStep = async () => {
    try {
      await signIn({ email: formData.email, password: formData.password })
      // Sucesso! O Contexto de Auth detectará o token e redirecionará.
    } catch (err) {
      setFormError("Erro ao entrar: " + getErrorMessage(err))
    }
  }

  const handleRegisterStep = async () => {
    if (formData.password !== formData.confirmPassword) {
      setFormError("As senhas não conferem!")
      return
    }

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password
      })
      alert("Conta criada com sucesso! Faça login agora.") // TEMPORARIO

      // Reseta campos sensíveis
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))

      setStep('login')
    } catch (err) {
      setFormError("Erro ao registrar: " + getErrorMessage(err))
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (step === 'check_email') {
      await handleCheckEmailStep()
    } else if (step === 'login') {
      await handleLoginStep()
    } else if (step === 'register') {
      await handleRegisterStep()
    }
  }

  const isLoading = checkLoading || signInLoading || regLoading;

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-amber-100">

      {/* LOGO E DESCRIÇÃO DO HERMES */}
      <section className="flex-1 md:w-1/2 w-full flex flex-col justify-center items-center p-4">
        <img src={logoHermes} alt="Logo do Hermes" className="w-48 md:w-64 max-w-xs object-contain" />

        <AnimatePresence>
          {step !== 'register' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-base md:text-center max-w-md pb-1 pt-6">
                Lorem ipsum dolor sit amet, consectet adipiscing elit. Cras finibus vehicula nulla quis maximus. Nullam non augue est. Mauris et placerat augue.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* FORMULÁRIO DE LOGIN E Rodapé */}
      <section className="flex-1 md:w-1/2 w-full flex flex-col justify-between bg-amber-700 p-4 rounded-t-3xl md:rounded-t-none md:rounded-l-3xl">

        <form onSubmit={handleFormSubmit} className="flex flex-col pt-2 gap-3">

          {/* Input do email sempre visivel, mas fica readOnly quando não estiver na fase de verificação de email ou se estiver carregando  */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-white text-base font-semibold">
              Insira o seu e-mail
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              readOnly={step !== 'check_email' || isLoading}
              placeholder="E-mail USP"
              className={`border-3 border-white rounded-2xl p-2 text-white transition-colors duration-300 ${step !== 'check_email' ? 'bg-white/10 cursor-not-allowed' : 'bg-transparent'}`}
            />
          </div>

          <motion.div
            initial={false}
            animate={{
              height: step === 'check_email' ? 0 : 'auto',
              opacity: step === 'check_email' ? 0 : 1
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {step === 'login' ? (
                <motion.div
                  key="login-fields"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-3"
                >
                  <InputPassword
                    id="password"
                    label="Digite sua senha"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Senha"
                  />
                </motion.div>
              ) : step === 'register' ? (
                <motion.div
                  key="register-fields"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-3"
                >
                  <InputText
                    id="username"
                    label="Nome de usuário"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Usuário"
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
              ) : null}
            </AnimatePresence>
          </motion.div>

          {/* Mensagem de Erro Inline PROVISORIO*/}
          {formError && (
            <p className="text-red-300 text-sm font-bold text-center bg-red-900/20 p-2 rounded-lg">
              {formError}
            </p>
          )}

          <button className="w-2/3 text-white text-lg font-bold bg-amber-400 p-2 mb-4 rounded-2xl m-auto hover:bg-amber-500 transition-colors z-10">
            {isLoading ? 'Carregando...' : (step === 'check_email' ? 'Próximo' : (step === 'login' ? 'Entrar' : 'Criar Conta'))}
          </button>
        </form>

        <FooterSocials />
      </section>
    </main>
  )
}

const InputText = ({ id, label, value, onChange, disabled, placeholder }: any) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-white font-semibold">{label}</label>
    <input type="text" id={id} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} className="border-3 border-white rounded-2xl p-2 text-white bg-transparent" />
  </div>
)


const InputPassword = ({ id, label, value, onChange, disabled, placeholder }: any) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-white font-semibold">{label}</label>
    <input type="password" id={id} value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} className="border-3 border-white rounded-2xl p-2 text-white bg-transparent" />
  </div>
)

const FooterSocials = () => (
  <footer className="flex flex-col items-center gap-2 mb-2">
    <p className="text-white text-sm font-bold">Criado por Codelab Leste</p>
    <div className="flex justify-center gap-8">
      <YoutubeIcon className="w-6 h-6 stroke-white brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer" />
      <DiscordIcon className="w-6 h-6 stroke-white brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer" />
      <InstagramIcon className="w-6 h-6 stroke-white brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer" />
    </div>
  </footer>
)