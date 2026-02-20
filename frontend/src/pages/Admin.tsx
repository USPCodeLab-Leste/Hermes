import { useCallback, useState, useMemo } from "react";
import { motion } from "framer-motion";

// Components
import { EventCard } from "../components/Events";
import AppHeader from "../components/AppHeader";
import SearchBar from "../components/SearchBar";
import { SelectedEventDetails } from "../components/SelectedEventDetails";
import { ModalWrapper } from "../components/modals/Modal";
import Skeletons from "../components/skeletons/Skeletons";
import { CreateEventModal } from "../components/modals/CreateEventModal";
import { EventCardSkeleton } from "../components/skeletons/EventCardSkeleton";

// Icons
import PlusIcon from "../assets/icons/plus.svg?react";

// Hooks
import { useMyEvents } from "../hooks/events/useMyEvents";
import { useSharedSearch } from "../hooks/useSharedSearch";

export default function Admin() {
  const {value: search, setValue: setSearch} = useSharedSearch()

  return (
    <>
      <AppHeader />
      <main className="main-app">
        <h1 className="max-w-200 w-full px-3 mt-10 mb-3 text-2xl font-bold">
          Administração
        </h1>
        <SearchBar search={search} setSearch={setSearch} isDark={true} />
        <AdminEventsGrid search={search} />
      </main>
    </>
  );
}

interface AdminEventsGridProps {
  search: string;
}

function AdminEventsGrid({ search }: AdminEventsGridProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const { data: events, isLoading, isTyping, refetch } = useMyEvents(search);

  // Modal States
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Handlers
  const handleNewEvent = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleSelectEvent = useCallback((id: string) => {
    setSelectedEventId(id);
    setIsCardModalOpen(true);
  }, []);

  const handleEditEvent = useCallback((id: string) => {}, []);

  const handleDeleteEvent = useCallback((id: string) => {}, []);

  const handleCreateEventModalClose = useCallback(() => {
    setIsCreateModalOpen(false);
    refetch();
  }, []);

  // Memos
  const selectedEventData = useMemo(
    () => events?.find((event) => event.id === selectedEventId),
    [events, selectedEventId],
  );

  return (
    <>
      {/* Modal Card Event */}
      <ModalWrapper
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      >
        {selectedEventId && selectedEventData && (
          <SelectedEventDetails event={selectedEventData} />
        )}
      </ModalWrapper>

      {/* Modal Cria Evento */}
      <CreateEventModal isOpen={isCreateModalOpen} onClose={handleCreateEventModalClose} />

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <motion.div
          whileHover={{y: -8}}
          className={`aspect-5/3 w-full max-w-120 overflow-hidden bg-violet-dark rounded-xl flex flex-col
                        bg-center justify-center items-center cursor-pointer shadow-lg hover:shadow-2xl
                        outline-2 hover:outline-paper focus:outline-paper outline-transparent transition-all`}
          onClick={handleNewEvent}
          aria-label="Adicionar novo evento"
        >
          <div className="flex flex-col items-center">
            <div className="size-14 p-2 bg-teal-light rounded-full flex items-center justify-center">
              <PlusIcon className="size-full text-paper" />
            </div>
            <span className="text-[20px]/[24px] font-semibold my-3 text-paper">
              Crie um novo evento
            </span>
            <span className="text-[16px]/[18px] font-light text-wrap text-center w-6/10 text-paper">
              Escreva um novo evento para o Hermes
            </span>
          </div>
        </motion.div>
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div>
                <EventCardSkeleton key={`event-card-skeleton-${i}`} />
                <div className="w-full grid grid-cols-2 gap-2 mt-2">
                  <Skeletons className="px-3 py-1.5 rounded-md" >Editar</Skeletons>
                  <Skeletons className="px-3 py-1.5 rounded-md" >Excluir</Skeletons>
                </div>
              </div>
            ))}
          </>
        ): (events && events.length > 0) ? events.map((eventItem) => (
          <EventCard
            key={eventItem.id}
            event={eventItem}
            selectEvent={handleSelectEvent}
            isAdmin={true}
            editFunction={() => handleEditEvent(eventItem.id)}
            deleteFunction={() => handleDeleteEvent(eventItem.id)}
            isFetching={isTyping}
          />
        )) : (
          <div className="flex justify-center items-center">
            <p className="text-center font-medium p-4">Nenhum evento encontrado com essa busca.</p>
          </div>
        )}
      </section>
    </>
  );
}
