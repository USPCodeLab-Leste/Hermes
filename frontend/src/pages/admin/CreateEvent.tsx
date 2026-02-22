import { useCallback, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

// Components
import { EventCard } from "../../components/Events";
import { SelectedEventDetails } from "../../components/SelectedEventDetails";
import { ModalWrapper } from "../../components/modals/Modal";
import { CreateEventModal } from "../../components/modals/CreateEventModal";
import { EventCardSkeleton } from "../../components/skeletons/EventCardSkeleton";

// Icons
import PlusIcon from "../../assets/icons/plus.svg?react";

// Hooks
import { useMyEvents } from "../../hooks/events/useMyEvents";
import { useSharedSearch } from "../../hooks/useSharedSearch";

export default function CreateEvent() {
  const { value: search } = useSharedSearch()

  return (
    <>
        <AdminEventsGrid search={search} />
    </>
  );
}

interface AdminEventsGridProps {
  search: string;
}

function AdminEventsGrid({ search }: AdminEventsGridProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: events, isLoading, isTyping } = useMyEvents(search);

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

  const handleEditEvent = useCallback((_id: string) => {}, []);

  const handleDeleteEvent = useCallback((_id: string) => {}, []);

  const handleCreateEventModalClose = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleOnCreated = useCallback(() => {
    queryClient.invalidateQueries({ predicate: (query: any) => {
      return query.queryKey[0] === 'my-events' || query.queryKey[0] === 'events';
    }})
  }, [])

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
          <SelectedEventDetails
            event={selectedEventData}
            isAdmin={true}
            onEdit={() => handleEditEvent(selectedEventId)}
            onDelete={() => handleDeleteEvent(selectedEventId)}
          />
        )}
      </ModalWrapper>

      {/* Modal Cria Evento */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateEventModalClose}
        onCreated={handleOnCreated}
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <motion.button
          whileHover={{y: -8}}
          className={`aspect-video w-full max-w-120 overflow-hidden bg-violet-dark rounded-xl flex flex-col
                        bg-center justify-center items-center cursor-pointer shadow-lg hover:shadow-2xl
                        outline-2 hover:outline-paper focus:outline-paper outline-transparent transition-all`}
          onClick={handleNewEvent}
          aria-label="Adicionar novo evento"
        >
          <div className="flex flex-col items-center">
            <div className="size-12 md:size-14 p-2 bg-teal-light rounded-full flex items-center justify-center">
              <PlusIcon className="size-full text-paper" />
            </div>
            <span className="text-[20px]/[24px] font-semibold my-3 text-paper">
              Crie um novo Evento
            </span>
            <span className="text-[16px]/[18px] font-light text-wrap text-center md:w-6/10 w-8/10 text-paper">
              Escreva um novo evento para o Hermes
            </span>
          </div>
        </motion.button>
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div>
                <EventCardSkeleton key={`event-card-skeleton-${i}`} />
              </div>
            ))}
          </>
        ): (events && events.length > 0) ? events.map((eventItem) => (
          <EventCard
            key={eventItem.id}
            event={eventItem}
            selectEvent={handleSelectEvent}
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
