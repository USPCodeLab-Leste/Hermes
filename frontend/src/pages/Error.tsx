import AppHeader from "../components/AppHeader"
import AppFooter from "../components/AppFooter";
import { useNavigate } from "react-router-dom";


export default function Error() {
  const navigate = useNavigate();

  return (
    <>
    <AppHeader />
    <body className="mb-32">
      <h1 className="mt-8 ml-8 m-4 font-bold text-paper text-4xl justify-self-left drop-shadow-2xl">Opsss!</h1>
      <h2 className="break-normal text-paper wrap-normal pr-8 pl-8 text-xl mb-0 font-medium justify-self-left">Página não encontrada</h2>
      
      <img src="public/notfound.svg" className="justify-self-center h-80"></img>
      
      <div className="max-w-sm break-normal text-paper wrap-normal mr-2 ml-2 text-sm justify-self-center pl-8 pr-8 p-4">A página que você está tentando acessar não foi encontrada. Verifique o link e tente novamente. Se o problema persistir, por favor, relate o problema.</div>
      <div className="flex justify-center">
        <button
        onClick={() => navigate("/home")}
        className="bg-teal-mid hover:bg-teal-light text-paper font-bold p-2 rounded ml-4 m-2 drop-shadow-lg">Página Inicial</button>
        
        <button className="bg-teal-mid hover:bg-teal-light text-paper font-bold p-2 mr-4 rounded m-2 drop-shadow-lg">Reportar Problema</button>
      
      </div>
    </body>
    <AppFooter />
    </> 
  );
}