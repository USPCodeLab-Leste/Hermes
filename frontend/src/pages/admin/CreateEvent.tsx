import { useCallback, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

// Components
import { EventCard } from "../../components/Events";
import { CreateEventModal } from "../../components/modals/CreateEventModal";
import { EventCardSkeleton } from "../../components/skeletons/EventCardSkeleton";
import { LoadMoreTrigger } from "../../components/LoadMoreTrigger";
import { EventModal } from "../../components/modals/EventModal";

// Icons
import PlusIcon from "../../assets/icons/plus.svg?react";

// Hooks
import { useMyEvents } from "../../hooks/events/useMyEvents";
import { useSharedSearch } from "../../hooks/useSharedSearch";

export default function CreateEvent() {
  const { value: search } = useSharedSearch()

  return (
    <AdminEventsGrid search={search} />
  );
}

interface AdminEventsGridProps {
  search: string;
}

function AdminEventsGrid({ search }: AdminEventsGridProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { events, isLoading, isFetching, hasNextPage, fetchNextPage } = useMyEvents(search);

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

  const handleCreateEventModalClose = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleOnCreated = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["my-events"] });
    await queryClient.invalidateQueries({ queryKey: ["events"] });
  }, [])

  // Memos
  const selectedEventData = useMemo(() => events?.find((event) => event.id === selectedEventId) ?? null, [events, selectedEventId]);

  return (
    <>
      {/* Modal Card Event */}
      <EventModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        selectedEventId={selectedEventId}
        selectedEventData={selectedEventData}
        searchQuery={search}
        isAdmin
       />

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
        {(events && events.length > 0) || isLoading ? (
          <>
            {events.map((eventItem) => (
              <EventCard
                key={eventItem.id}
                event={eventItem}
                selectEvent={handleSelectEvent}
                isFetching={isFetching}
              />
            ))}
            {(hasNextPage || isLoading) && (
              <>
                {/* Skeleton observável */}
                {hasNextPage && !isFetching && (
                  <LoadMoreTrigger
                    onVisible={fetchNextPage}
                  >
                    <EventCardSkeleton />
                  </LoadMoreTrigger>
                )}
  
                {/* Skeletons normais */}
                <EventCardSkeleton />
              </>
            )}
          </>
        )  : (
          <div className="flex justify-center items-center" style={{opacity: isFetching ? 0.5 : 1}}>
            <p className="text-center font-medium p-4">Nenhum evento encontrado com essa busca.</p>
          </div>
        )}
      </section>
    </>
  );
}
