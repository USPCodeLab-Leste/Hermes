import { motion, stagger, type Variants } from "framer-motion"
import type { Event } from "../types/events"
import { useState } from "react"
import { useEvents } from "../hooks/useEvents"


import AppHeader from "../components/AppHeader";
import SearchBar from "../components/SearchBar";

import PenIcon from "../assets/icons/pencil.svg?react";
import PlusIcon from "../assets/icons/plus.svg?react";
import TrashIcon from "../assets/icons/trash.svg?react";

// function EventCard({ event, selectEvent }: { event: Event, selectEvent: (id: string) => void }) {
//   const [isReady, setIsReady] = useState(false)

//   return (  
//     <motion.button
//       variants={eventVariants}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{amount: 0.4, once: true}}
//       transition={{
//         type: 'spring',
//         stiffness: 320,
//         damping: 18,
//         duration: 0.5,
//         delayChildren: 0.2,
//       }}
//       key={event.id} 
//       className={`max-w-120 h-60 w-full overflow-hidden bg-violet-dark rounded-xl flex flex-col bg-cover bg-no-repeat 
//                  bg-center justify-between cursor-pointer hover:-translate-y-2 shadow-lg hover:shadow-2xl 
//                  outline-2 hover:outline-paper focus:outline-paper outline-transparent ${isReady ? 'transition-all' : ''}`}
//       style={{ backgroundImage: `url('https://picsum.photos/600/200?random=${event.id}')`}}
//       onClick={() => selectEvent(event.id)}
//       onAnimationComplete={() => setIsReady(true)}
//       aria-label={`Selecionar evento ${event.title}`}
//     >
//       <Tags tags={event.tags} />
//       <div className="self-end w-full p-4 flex flex-col items-start backdrop-blur-sm from-violet-light/30 to-violet-mid bg-linear-to-b">
//         <h2 className="font-bold text-xl">{event.title}</h2>
//         <p>{event.date}</p>
//       </div>
//     </motion.button>
//   )
// }

export default function Admin() {
    // const [search, setSearch] = 
    const eventoTeste: Event[]= [
        {
            id: "1",
            title: "Title",
            date: "02/10/2006",
            location: "Paraiba",
            description: "Festa de balancar o esqueleto",
            tags: ["banana"]
        },{
            id: "4",
            title: "Festival de Música Indie",
            date: "15/03/2026",
            location: "São Paulo, SP",
            description: "Festival com as melhores bandas indie do Brasil",
            tags: ["música", "festival", "indie"]
        },{
            id: "2",
            title: "Workshop de React",
            date: "22/03/2026",
            location: "Online",
            description: "Aprenda React do zero ao avançado",
            tags: ["tecnologia", "programação", "workshop"]
        },{
            id: "3",
            title: "Exposição de Arte Moderna",
            date: "10/04/2026",
            location: "Rio de Janeiro, RJ",
            description: "Obras de artistas contemporâneos brasileiros",
            tags: ["arte", "cultura", "exposição"]
        }
    ];

    return (
        <>
            <AppHeader/>
            <div className="flex flex-col items-center w-screen">
                <h1>Administração</h1>
                <SearchBar search="Buscar posts..." setSearch={()=>{}}></SearchBar> // arrumar
                <AdminEventsGrid
                    eventsList={eventoTeste}
                ></AdminEventsGrid>
            </div>
                
        </>
    );
}

function AdminEventCard({
    event
}:{
    event: Event
}) {
    const [isReady, setIsReady] = useState(false)
    const editHandler = ()=>{};
    const deleteHandler = ()=>{};

    return (
        <div 
            className={`max-w-180 h-60 w-full sm:w-auto overflow-hidden bg-violet-dark rounded-xl flex flex-col bg-cover bg-no-repeat 
            bg-center justify-between shadow-lg hover:shadow-2xl 
            outline-2 hover:outline-paper focus:outline-paper outline-transparent ${isReady ? 'transition-all' : ''}`}
            style={{ backgroundImage: `url('https://picsum.photos/600/200?random=${5}')`}}
            aria-label={` ${event.title}`}
        >
            {/* <div className="flex flex-col bottom-0">
                <span className="text-[24px]/[28px] font-bold">{event.title}</span> 
                <span className="">Date</span>
                <div className="flex flex-row p-2 gap-1">
                    <button className="bg-blue-500">
                        Editar
                    </button>
                    <button className="bg-red-500">
                        Excluir
                    </button>
                </div>
            </div> */}
            <Tags tags={event.tags} />
            <div className="self-end w-full p-4 flex flex-col items-start backdrop-blur-sm from-violet-light/70 to-violet-mid bg-linear-to-b">
                <span className="text-[20px]/[24px] font-bold">{event.title}</span> 
                <span className="">{event.date}</span>
                <div className="flex flex-row pt-1 gap-3">
                    <button 
                        className={`bg-blue-600/70 w-30 px-3 py-1.5 rounded-md font-medium cursor-pointer flex justify-center
                        hover:shadow-2xl hover:bg-blue-600/80  hover:outline-paper focus:outline-paper outline-transparent ${isReady ? 'transition-all' : ''}`}
                        onClick={editHandler}
                    >
                        <PenIcon className="mr-1.5"/>
                        Editar
                    </button>
                    <button 
                        className={`bg-red-500/70 w-30 h-8 px-3 py-1.5 rounded-md font-medium cursor-pointer flex  justify-center
                        hover:shadow-2xl hover:bg-red-500/80 hover:outline-paper focus:outline-paper 
                        outline-transparent ${isReady ? 'transition-all' : ''}`}
                        onClick={deleteHandler}
                    >
                        <TrashIcon className="mr-1.5" />
                        Excluir 
                    </button>
                </div>
            </div>
        </div>
    )
}

const tagsVariants: Variants = {
  visible: {
    transition: {
      delayChildren: stagger(0.1),
    }
  }
}

const tagVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },  
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <motion.div 
      className="flex flex-row gap-2 p-4"
      // animate="jump"
      variants={tagsVariants}
    >
      {tags.map((tag, index) => (
        <Tag key={index} tag={tag} />
      ))}
    </motion.div>
  )
}

function Tag({ tag }: { tag: string }) {
  return (
    <motion.span 
      className="bg-teal-light outline-teal-mid outline-2 px-3 py-1 rounded-full text-sm font-medium inline-block"
      variants={tagVariants}
    >
      {tag}
    </motion.span>
  )
}

function AdminEventsGrid({ eventsList }:{ eventsList : Event[]}) {
    const newEventHandler = ()=>{};

    return  <ul className="grid grid-cols-1 sm:grid-cols-2 w-[90%] max-w-200 gap-4 mt-3">
                <li 
                    className={`max-w-180 h-45 sm:h-60 w-full sm:w-auto overflow-hidden bg-violet-dark rounded-xl flex flex-col bg-cover bg-no-repeat 
                    bg-center justify-center items-center hover:-translate-y-2 shadow-lg hover:shadow-2xl 
                    cursor-pointer hover:outline-2 hover:outline-paper focus:outline-paper`}
                    onClick={newEventHandler}
                    aria-label="Adicionar novo evento"
                >
                    <div className="flex flex-col items-center">
                        <PlusIcon className="bg-teal-light w-12 h-12 rounded-[100%] m-1" />
                        <span className="text-[20px]/[24px] font-semibold my-1">
                            Crie um novo evento
                        </span>
                        <span className="text-[16px]/[18px] font-light text-wrap text-center w-[85%]">
                            Escreva um novo evento para o Hermes
                        </span>
                    </div>
                    
                </li>
            {eventsList.map((eventItem) => (
                <li key={eventItem.id}>
                    <AdminEventCard event={eventItem} />
                </li>
            ))}
        </ul>
    
}
