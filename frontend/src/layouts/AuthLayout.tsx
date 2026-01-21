import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
// import { motion, AnimatePresence } from "motion/react"

import YoutubeIcon from '../assets/brand-youtube.svg?react'
import DiscordIcon from '../assets/brand-discord.svg?react'
import InstagramIcon from '../assets/brand-instagram.svg?react'
import logoHermes from '../assets/temp-logo.png'

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  // const isRegister = location.pathname.includes("/register")

  // Redireciona se já estiver logado
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="w-full flex flex-col md:flex-row">

      {/* LOGO E DESCRIÇÃO DO HERMES */}
      <section className="w-full flex flex-1 flex-col justify-center items-center p-4">
        <img src={logoHermes} alt="Logo do Hermes" className="w-48 md:w-64 max-w-xs object-contain" />

        <p className="text-base md:text-center max-w-md pb-1 pt-6">
          Lorem ipsum dolor sit amet, consectet adipiscing elit. Cras finibus vehicula nulla quis maximus.
        </p>
      </section>

      {/* FORMULÁRIO DE LOGIN E Rodapé */}
      <section className="w-full flex flex-1 flex-col justify-center items-center p-4 bg-violet-dark rounded-t-3xl md:rounded-t-none md:rounded-l-3xl">
        <Outlet />
        <FooterSocials />
      </section>
    </main>
  )
}

const FooterSocials = () => (
  <footer className="flex flex-col items-center gap-2 mb-2">
    <p className="text-paper text-sm font-bold">Criado por CodeLab Leste</p>
    <div className="flex justify-center gap-8">
      <YoutubeIcon className="w-6 h-6 stroke-paper brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer" />
      <DiscordIcon className="w-6 h-6 stroke-paper brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer" />
      <InstagramIcon className="w-6 h-6 stroke-paper brightness-0 invert opacity-80 hover:opacity-100 cursor-pointer" />
    </div>
  </footer>
)