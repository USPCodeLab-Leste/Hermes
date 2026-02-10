import { motion, stagger, type Variants } from "framer-motion";
import type { Event } from "../types/events";
import { useState } from "react";
import { useEvents } from "../hooks/useEvents";

import AppHeader from "../components/AppHeader";
import SearchBar from "../components/SearchBar";

import PenIcon from "../assets/icons/pencil.svg?react";
import PlusIcon from "../assets/icons/plus.svg?react";
import TrashIcon from "../assets/icons/trash.svg?react";
import { EventCard } from "../components/Events";

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
  const [search, setSearch] = useState("");
  // lista de eventos setar depois
  const { data: events = [] } = useEvents();

  return (
    <>
      <AppHeader />
      <main className="main-app">
        <h1 className="max-w-200 w-full px-3 mt-10 mb-3 text-2xl font-bold">
          Administração
        </h1>
        <SearchBar search={search} setSearch={setSearch} />
        <AdminEventsGrid eventsList={events}></AdminEventsGrid>
      </main>
    </>
  );
}

function AdminEventsGrid({ eventsList }: { eventsList: Event[] }) {
  const newEventHandler = () => {};

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      <div
        className={`aspect-5/3 w-full max-w-120 overflow-hidden bg-violet-dark rounded-xl flex flex-col 
                    bg-center justify-center items-center cursor-pointer hover:-translate-y-2 shadow-lg hover:shadow-2xl 
                    outline-2 hover:outline-paper focus:outline-paper outline-transparent transition-all`}
        onClick={newEventHandler}
        aria-label="Adicionar novo evento"
      >
        <div className="flex flex-col items-center">
          <div className="size-14 p-2 bg-teal-light rounded-full flex items-center justify-center">
              <PlusIcon className="size-full" />
          </div>
          <span className="text-[20px]/[24px] font-semibold my-3">
            Crie um novo evento
          </span>
          <span className="text-[16px]/[18px] font-light text-wrap text-center w-6/10">
            Escreva um novo evento para o Hermes
          </span>
        </div>
      </div>
      {eventsList.map((eventItem) => (
        <EventCard key={eventItem.id} event={eventItem} selectEvent={() => {}} />
      ))}
    </section>
  );
}
