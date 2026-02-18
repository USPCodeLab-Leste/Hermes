import AppHeader from "../components/AppHeader"
import AppFooter from "../components/AppFooter";
import { Link } from "react-router-dom";
import NotFoundIcon from "../assets/notfound.svg?react";

export default function Error() {
  return (
    <>
    <AppHeader />
      <main className="main-app flex flex-col md:flex-row-reverse items-center justify-center gap-4">
        <NotFoundIcon className="size-100 text-violet-light p-4 flex-3" />
        <section className="flex flex-col justify-center gap-4 flex-2">
          <div>
            <h2 className="font-black md:text-2xl text-3xl md:text-left text-center">Opsss!</h2>
            <h2 className="font-black md:text-xl text-2xl md:text-left text-center whitespace-nowrap">Página não encontrada</h2>
          </div>
          
          <div className="max-w-sm mb-6">
            <p className="text-sm md:text-left text-center mb-1">Essa página ou não existe ou o link está incorreto.</p>
            <p className="text-xs md:text-left text-center">Se o problema persistir, por favor, relate o problema.</p>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-2 max-w-sm">
            <Link 
              to="/"
              className="bg-teal-mid hover:bg-teal-light text-paper font-bold p-2 rounded drop-shadow-lg text-center cursor-pointer transition-colors"
            >
              Voltar
            </Link>
            <a
              href="https://forms.gle/coS8sQid3S9JGeKk9"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal-mid/50 hover:bg-teal-light/50 text-paper font-bold p-2 rounded drop-shadow-lg text-center cursor-pointer transition-colors"
            >
              Reportar
            </a>
          </div>
        </section>
      </main>
    <AppFooter />
    </> 
  );
}