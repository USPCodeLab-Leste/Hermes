import { useState } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

import youtubeIcon from '../assets/brand-youtube.svg'
import discordIcon from '../assets/brand-discord.svg'
import instagramIcon from '../assets/brand-instagram.svg'
import logoHermes from '../assets/temp-logo.png'

export default function Login() {
  const { login, isAuthenticated } = useAuth()

  const [step, setStep] = useState<'check_email' | 'login' | 'register'>('check_email')
  const [email, setEmail] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // FUNÇÃO MOCK PARA VERIFICAR SE O EMAIL EXISTE
  const checkEmailExists = (emailToCheck: string) => {
    if (emailToCheck === 'hermes@usp.br') {
      return true
    }
    return false
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      alert("Digite um email!")
      return
    }

    const exists = checkEmailExists(email)

    if (exists) {
      setStep('login') // Carrega tela de login
    } else {
      setStep('register') // Carrega tela de cadastro
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login('dummy-token')
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Conta criada com sucesso! (Simulação)")
    // ADICIONAR LÓGICA DE CADASTRO AQUI
  }

  return (
    <>
      <main className="min-h-screen w-full flex flex-col md:flex-row bg-amber-100">

        {/* LOGO E DESCRIÇÃO DO HERMES */}
        <section className="flex-1 md:w-1/2 w-full flex flex-col justify-center items-center gap-6 p-4">
          <img src={logoHermes} alt="Logo do Hermes" className="w-48 md:w-64 max-w-xs object-contain" />

          <p className="text-base md:text-center max-w-md">
            Lorem ipsum dolor sit amet, consectet adipiscing elit. Cras finibus  vehicula nulla quis maximus. Nullam non augue est. Mauris et placerat  augue.
          </p>
        </section>

        {/* FORMULÁRIO DE LOGIN E Rodapé */}
        <section className="flex-1 md:w-1/2 w-full flex flex-col justify-between bg-amber-600 p-4 rounded-t-3xl md:rounded-t-none md:rounded-l-3xl">
          {step === 'check_email' && (
            <form onSubmit={handleNextStep} className="flex flex-col pt-2 gap-4">

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-white text-base font-semibold">
                  Insira o seu e-mail
                </label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail USP" className="border-3 border-white rounded-2xl p-2 text-white" />
              </div>

              <button className="w-2/3 text-white text-lg font-bold bg-amber-300 p-2 rounded-2xl  m-auto">
                Próximo
              </button>
            </form>
          )}

          {step === 'login' && (
            <form onSubmit={handleLogin} className="flex flex-col pt-2 gap-4">

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-white text-base font-semibold">
                  Insira o seu e-mail
                </label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail USP" className="border-3 border-white rounded-2xl p-2 text-white" />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-white text-base font-semibold">
                  Insira a sua senha
                </label>
                <input type="password" id="password" placeholder="Senha" className="border-3 border-white rounded-2xl p-2 text-white" />
              </div>

              <button className="w-2/3 text-white text-lg font-bold bg-amber-300 p-2 rounded-2xl  m-auto">
                Entrar
              </button>
            </form>
          )}

          {step === 'register' && (
            <form onSubmit={handleRegister} className="flex flex-col pt-2 gap-3">

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-white text-base font-semibold">
                  Insira o seu e-mail
                </label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail USP" className="border-3 border-white rounded-2xl p-2 text-white" />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-white text-base font-semibold">
                  Núemro USP
                </label>
                <input type="text" placeholder="Número USP" className="border-3 border-white rounded-2xl p-2 text-white" />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-white text-base font-semibold">
                  Crie uma senha
                </label>
                <input type="password" placeholder="Senha" className="border-3 border-white rounded-2xl p-2 text-white" />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-white text-base font-semibold">
                  Confirme a senha
                </label>
                <input type="password" placeholder="Senha" className="border-3 border-white rounded-2xl p-2 text-white" />
              </div>

              <button className="w-2/3 text-white text-lg font-bold bg-amber-300 p-2 rounded-2xl  m-auto">
                Criar Conta
              </button>
            </form>
          )}


          <footer className="flex flex-col items-center gap-2 mb-2">
            <p className="text-white text-sm font-bold">Criado por Codelab Leste</p>
            <div className="flex justify-center gap-8">
              <img src={youtubeIcon} alt="YouTube" className="w-6 h-6 brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
              <img src={discordIcon} alt="Discord" className="w-6 h-6 brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
              <img src={instagramIcon} alt="Instagram" className="w-6 h-6 brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />

            </div>
          </footer>
        </section>
      </main>
    </>
  )
}
