import { useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

import YoutubeIcon from '../assets/brand-youtube.svg?react'
import DiscordIcon from '../assets/brand-discord.svg?react'
import InstagramIcon from '../assets/brand-instagram.svg?react'
import logoHermes from '../assets/temp-logo.png'

// hooks de autenticação
import { auth } from "../services/auth"
import { useSignIn } from './../hooks/useSignIn';
import { useRegister } from "../hooks/useRegister"
import { useCheckEmail } from "../hooks/useCheckEmail"

export default function Login() {
  const { isAuthenticated } = useAuth()
  const [signIn, signInLoading, signInError] = useSignIn(auth)
  const [register, regLoading, regError] = useRegister(auth)
  const [checkEmail, checkLoading, checkError] = useCheckEmail(auth)

  const [step, setStep] = useState<'check_email' | 'login' | 'register'>('check_email')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Redireciona se já estiver logado
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Helper para tratar mensagens de erro de forma segura
  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Fase de Verificação de Email
    if (step === 'check_email') {
      if (!email) {
        alert("Digite um email!")
        return
      }

      // Sucesso = Email disponível (NÃO existe) -> Vai para cadastro
      // Erro = Email já cadastrado (Existe) -> Vai para login
      try {
        await checkEmail(email)
        setStep('register')

      } catch (err: unknown) {
        setStep('login')
      }
      return
    }

    // 2 a) Fase de Login
    if (step === 'login') {
      try {
        await signIn({ email, password })
        // Sucesso! O Contexto de Auth detectará o token e redirecionará.
      } catch (err: unknown) {
        alert("Erro ao fazer login: " + getErrorMessage(err))
      }
      return
    }

    // 2 b) Fase de Cadastro
    if (step === 'register') {
      if (password !== confirmPassword) {
        alert("As senhas não conferem!")
        return
      }

      try {
        await register({ email, username, password })
        alert("Conta criada com sucesso! Faça login agora.")

        // Limpa a senha para o usuário digitar de novo no login (segurança)
        setPassword('')
        setConfirmPassword('')

        setStep('login')
      } catch (err: unknown) {
        alert("Erro ao registrar: " + getErrorMessage(err))
      }
      return
    }
  }

  const isLoading = checkLoading || signInLoading || regLoading;

  return (
    <>
      <main className="min-h-screen w-full flex flex-col md:flex-row bg-amber-100">

        {/* LOGO E DESCRIÇÃO DO HERMES */}
        <section className="flex-1 md:w-1/2 w-full flex flex-col justify-center items-center p-4">
          <img src={logoHermes} alt="Logo do Hermes" className="w-48 md:w-64 max-w-xs object-contain" />

          <div className={`grid transition-all duration-500 ease-in-out 
            ${step === 'register' ? 'grid-rows-[0fr] opacity-0 margin-0' : 'grid-rows-[1fr] opacity-100'}`
          }>
            <div className="overflow-hidden pt-6">
              <p className="text-base md:text-center max-w-md pb-1">
                Lorem ipsum dolor sit amet, consectet adipiscing elit. Cras finibus vehicula nulla quis maximus. Nullam non augue est. Mauris et placerat augue.
              </p>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO DE LOGIN E Rodapé */}
        <section className="flex-1 md:w-1/2 w-full flex flex-col justify-between bg-amber-700 p-4 rounded-t-3xl md:rounded-t-none md:rounded-l-3xl">

          <form onSubmit={handleFormSubmit} className="flex flex-col pt-2 gap-3">

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-white text-base font-semibold">
                Insira o seu e-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                readOnly={step !== 'check_email' || isLoading} // Desabilita edição se não estiver na fase de verificação de email ou se estiver carregando
                placeholder="E-mail USP"
                className={`border-3 border-white rounded-2xl p-2 text-white transition-colors duration-300 ${step !== 'check_email' ? 'bg-white/10 cursor-not-allowed' : 'bg-transparent'}`}
              />
            </div>


            <div className={`grid transition-[grid-template-rows] duration-500 ease-out 
              ${step === 'check_email' ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`
            }>
              <div className="overflow-hidden">

                <div className={`flex flex-col gap-3 transition-opacity duration-500 delay-100 
                  ${step === 'check_email' ? 'opacity-0' : 'opacity-100'}`
                }>

                  {/* CAMPOS DE LOGIN */}
                  {step === 'login' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label htmlFor="pass-login" className="text-white text-base font-semibold">
                          Insira a sua senha
                        </label>
                        <input
                          type="password"
                          id="pass-login"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          disabled={isLoading}
                          placeholder="Senha"
                          className="border-3 border-white rounded-2xl p-2 text-white bg-transparent"
                        />
                      </div>


                    </>
                  )}

                  {/* CAMPOS DE REGISTRO */}
                  {step === 'register' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="text-white text-base font-semibold">Nome de usuário</label>
                        <input
                          type="text"
                          id="username"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          disabled={isLoading}
                          placeholder="Nome de usuário"
                          className="border-3 border-white rounded-2xl p-2 text-white bg-transparent"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="pass-register" className="text-white text-base font-semibold">Crie uma senha</label>
                        <input
                          type="password"
                          id="pass-register"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          disabled={isLoading}
                          placeholder="Senha"
                          className="border-3 border-white rounded-2xl p-2 text-white bg-transparent"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="pass-confirm" className="text-white text-base font-semibold">Confirme a senha</label>
                        <input
                          type="password"
                          id="pass-confirm"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                          placeholder="Senha"
                          className="border-3 border-white rounded-2xl p-2 text-white bg-transparent"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button className="w-2/3 text-white text-lg font-bold bg-amber-400 p-2 mb-4 rounded-2xl m-auto hover:bg-amber-500 transition-colors z-10">
              {isLoading
                ? 'Carregando...'
                : (step === 'check_email' ? 'Próximo' : (step === 'login' ? 'Entrar' : 'Criar Conta'))
              }
            </button>
          </form>

          <footer className="flex flex-col items-center gap-2 mb-2">
            <p className="text-white text-sm font-bold">Criado por Codelab Leste</p>
            <div className="flex justify-center gap-8">
              <a href="" target="_blank">
                <YoutubeIcon className="w-6 h-6 stroke-white brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
              </a>
              <a href="" target="_blank">
                <DiscordIcon className="w-6 h-6 stroke-white brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
              </a>
              <a href="" target="_blank">
                <InstagramIcon className="w-6 h-6 stroke-white brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
              </a>
            </div>
          </footer>
        </section>
      </main>
    </>
  )
}
