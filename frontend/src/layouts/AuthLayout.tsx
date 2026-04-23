import { useState } from "react"
import { Navigate, Outlet, useSearchParams } from "react-router-dom"

// Componentes
import { AppAdModal } from "../components/modals/AppAdModal"

// Hooks
import { useAuth } from "../hooks/auth/useAuth"

// Icons
import InstagramIcon from '../assets/icons/brand-instagram.svg?react'
import GitHubIcon from '../assets/icons/brand-github.svg?react'
import LogoHermes from '../assets/LOGO 240x240.svg'

// Utils
import { isApp } from "../utils/so"

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()
  const hasSeenAppAd = localStorage.getItem("hasSeenAppAd") === "true"
  const [isAppAdModalOpen, setIsAppAdModalOpen] = useState(hasSeenAppAd || isApp() ? false : true)
  const redirectTo = searchParams.get("redirectTo") || "/"

  // Redireciona se já estiver logado
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <>
      {/* Modal App Ad */}
      <AppAdModal
        isOpen={isAppAdModalOpen}
        onClose={() => setIsAppAdModalOpen(false)}
      />
      
      <main className="min-h-screen w-full flex flex-col md:flex-row bg-violet-mid">

        {/* LOGO E DESCRIÇÃO DO HERMES */}
        <section className="w-full flex flex-5 flex-col justify-center items-center p-6 py-14 md:p-4">
          <img src={LogoHermes} alt="Logo do Hermes" className="w-48 md:w-64 max-w-xs object-contain" />

          <p className="text-base md:text-center max-w-sm pb-1 pt-6 text-paper">
            <span className="font-bold text-2xl">Bem-vindo ao Hermes: a voz do campus.</span>
          </p>
        </section>

        {/* FORMULÁRIO DE LOGIN E RODAPÉ */}
        <section className="w-full flex flex-2 basis-50 flex-col justify-center items-center p-4 pt-6 md:p-8 dark:bg-violet-dark bg-aux-3 rounded-t-3xl md:rounded-t-none md:rounded-l-3xl">
          <Outlet />
          <FooterSocials />
        </section>
      </main>
    </>
  )
}

const FooterSocials = () => (
  <footer className="flex flex-col items-center gap-2 mb-2">
    <p className="text-sm font-bold">Criado por CodeLab Leste</p>
    <div className="flex justify-center gap-8">
      <SocialLink href="https://www.instagram.com/uspcodelableste/">
        <InstagramIcon className="size-6 opacity-80 hover:opacity-100 cursor-pointer" />
      </SocialLink>
      <SocialLink href="https://github.com/USPCodeLab-Leste">
        <GitHubIcon className="size-6 opacity-80 hover:opacity-100 cursor-pointer" />
      </SocialLink>
    </div>
  </footer>
)

const SocialLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 cursor-pointer">
    {children}
  </a>
)