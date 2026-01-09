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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 'check_email') {
      if (!email) {
        alert("Digite um email!")
        return
      }
      const exists = checkEmailExists(email)
      setStep(exists ? 'login' : 'register')
      return
    }

    // 2. Fase de Login
    if (step === 'login') {
      login('dummy-token')
      return
    }

    // 3. Fase de Cadastro
    if (step === 'register') {
      alert("Conta criada com sucesso! (Simulação)")
      //Adcionar a chamada de cadastro aqui
      return
    }
  }


  return (
    <>
      <main className="min-h-screen w-full flex flex-col md:flex-row bg-amber-100">

        {/* LOGO E DESCRIÇÃO DO HERMES */}
        <section className="flex-1 md:w-1/2 w-full flex flex-col justify-center items-center p-4">
          <img src={logoHermes} alt="Logo do Hermes" className="w-48 md:w-64 max-w-xs object-contain" />

          <div className={`grid transition-all duration-500 ease-in-out 
            ${step === 'register'? 'grid-rows-[0fr] opacity-0 margin-0': 'grid-rows-[1fr] opacity-100'}`
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
                type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} readOnly={step !== 'check_email'} placeholder="E-mail USP"
                className={`border-3 border-white rounded-2xl p-2 text-white transition-colors duration-300 ${step !== 'check_email' ? 'bg-white/10 cursor-not-allowed' : 'bg-transparent'}`}
              />
            </div>


            <div className={`grid transition-[grid-template-rows] duration-500 ease-out 
                ${step === 'check_email' ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`
            }>
              <div className="overflow-hidden">

                <div className={`flex flex-col gap-3 transition-opacity duration-500 delay-100 
                    ${step === 'check_email' ? 'opacity-0' : 'opacity-100'}`}>

                  {/* CAMPOS DE LOGIN */}
                  {step === 'login' && (
                    <div className="flex flex-col gap-1">
                      <label htmlFor="pass-login" className="text-white text-base font-semibold">
                        Insira a sua senha
                      </label>
                      <input type="password" id="pass-login" placeholder="Senha" className="border-3 border-white rounded-2xl p-2 text-white bg-transparent" />
                    </div>
                  )}

                  {/* CAMPOS DE REGISTRO */}
                  {step === 'register' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-white text-base font-semibold">Número USP</label>
                        <input type="text" placeholder="Número USP" className="border-3 border-white rounded-2xl p-2 text-white bg-transparent" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-white text-base font-semibold">Crie uma senha</label>
                        <input type="password" placeholder="Senha" className="border-3 border-white rounded-2xl p-2 text-white bg-transparent" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-white text-base font-semibold">Confirme a senha</label>
                        <input type="password" placeholder="Senha" className="border-3 border-white rounded-2xl p-2 text-white bg-transparent" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button className="w-2/3 text-white text-lg font-bold bg-amber-400 p-2 mb-4 rounded-2xl m-auto 
              hover:bg-amber-500 transition-colors z-10">
              {step === 'check_email' ? 'Próximo' : (step === 'login' ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          <footer className="flex flex-col items-center gap-2 mb-2">
            <p className="text-white text-sm font-bold">Criado por Codelab Leste</p>
            <div className="flex justify-center gap-8">
              <a href="" target="_blank">
                <img src={youtubeIcon} alt="YouTube" className="w-6 h-6 brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
              </a>
              <a href="" target="_blank">
                <img src={discordIcon} alt="Discord" className="w-6 h-6 brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
              </a>
              <a href="" target="_blank">
                <img src={instagramIcon} alt="Instagram" className="w-6 h-6 brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
              </a>
            </div>
          </footer>
        </section>
      </main>
    </>
  )
}
