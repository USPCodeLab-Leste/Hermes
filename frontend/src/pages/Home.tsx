import { useCallback, useMemo, useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"

// Hooks
import { useEvents } from "../hooks/events/useEvents"
import { useActiveTags } from "../hooks/tags/useActiveTags"

// Types
import type { TagType } from "../types/tag"

// Componentes
import { ModalWrapper } from "../components/modals/Modal"
import AppHeader from "../components/AppHeader"
import { EventCard } from "../components/Events"
import SearchBar from "../components/SearchBar"
import { SelectedEventDetails } from "../components/SelectedEventDetails"
import { SelectedEventDetailsSkeleton } from "../components/skeletons/SelectedEventDetailsSkeleton"

// Icons
import FilterIcon from "../assets/icons/filter.svg?react"
import FilterSparkIcon from "../assets/icons/filter-spark.svg?react"
import { useSharedSearch } from "../hooks/useSharedSearch"
import { FilterTagsModal } from "../components/modals/FilterTagsModal"


export default function Home() {
  const [searchQuery, setSearchQuery] = useSharedSearch()
  const [params, setParams] = useSearchParams()
  const {activeTags, setActiveTags, tagsFlatten} = useActiveTags()
  const { data: events, isLoading: isLoadingEvents } = useEvents(searchQuery, tagsFlatten)

  // Modal States
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  // ===================
  // == Handlers
  // ===================

  // Abre modal do evento selecionado
  const handleEventCardClick = useCallback((id: string) => {
    setParams(prev => {
      prev.set("event", id);
      return prev;
    }, { replace: true });
  }, [setParams])

  // Fecha modal do evento
  const handleModalEventClose = useCallback(() => {
    setParams(prev => {
      prev.delete("event");
      return prev;
    }, { replace: true });

    setSelectedEventId(null);
    setIsCardModalOpen(false);
  }, [setParams, setSelectedEventId, setIsCardModalOpen])

  // Abre modal de filtros e 
  const handleFilterClick = useCallback(() => {
    setIsFilterModalOpen(true)
  }, [activeTags])

  // Fecha modal de filtros sem aplicar mudanças
  const handleModalFilterClose = useCallback(() => {
    setIsFilterModalOpen(false)
  }, [activeTags])

  // Aplica os filtros selecionados
  const onFilter = useCallback((activeTagsCopy: Record<TagType, string[]>) => {
    setIsFilterModalOpen(false)
    setActiveTags(structuredClone(activeTagsCopy))
    toast.success("Filtros aplicados com sucesso!")
  }, [])

  const onClean = useCallback(() => {
    setIsFilterModalOpen(false)
    setActiveTags({} as Record<TagType, string[]>)
    toast.success("Filtros limpos com sucesso!")
  }, [])

  // ===================
  // == Memos
  // ===================

  const hasAnyFilter = useMemo(() => Object.values(activeTags).some(tags => tags.length > 0), [activeTags])
  const selectedEventData = useMemo(() => events?.find((e) => e.id === selectedEventId) ?? null, [events, selectedEventId])

  // ===================
  // == Effects
  // ===================

  useEffect(() => {
    const eventId = params.get("event");

    if (eventId) {
      setSelectedEventId(eventId);
      setIsCardModalOpen(true);
    }
  }, [params])

  return (
    <>
      {/* Modal Card Event */}
      <ModalWrapper
        isOpen={isCardModalOpen}
        onClose={handleModalEventClose}
      >
        {(selectedEventId && selectedEventData) ? (
          <SelectedEventDetails
            event={selectedEventData}
            search={searchQuery}
          />
        ) : (
          <SelectedEventDetailsSkeleton />
        ) }
      </ModalWrapper>

      {/* Modal Filter */}
      <FilterTagsModal 
        isOpen={isFilterModalOpen}
        onClose={handleModalFilterClose}
        activeTags={activeTags}
        onFilter={onFilter}
        onClean={onClean}
      />

      <AppHeader>
        <div className="flex items-center gap-4 w-full">
          <SearchBar search={searchQuery} setSearch={setSearchQuery}/>
          <button 
            onClick={handleFilterClick}
            className="cursor-pointer bg-teal-mid border-2 border-teal-mid p-2 rounded-xl
                       hover:border-teal-light hover:bg-teal-light aria-expanded:border-teal-light aria-expanded:bg-teal-light
                        transition-colors group"
            aria-label="Abrir filtros de busca"
            aria-expanded={isFilterModalOpen}
          >
            {hasAnyFilter ? (
              <FilterSparkIcon className="text-paper transition-colors"/>
            ) : (
              <FilterIcon className="text-paper transition-colors"/>
            )}
          </button>
        </div>
      </AppHeader>

      <main className="main-app">
        {isLoadingEvents ? <p>Carregando eventos...</p> : events!.length > 0 ? (
          <>
            <section className="m-auto mt-10 flex flex-col items-center gap-8">
              {events?.map((event) => (
                <EventCard key={event.id} event={event} selectEvent={handleEventCardClick}/>
              ))}
            </section>
          </>
        ) : (
          <p className="text-center font-medium p-4">Nenhum evento encontrado com essa busca.</p>
        )}
      </main>
    </>
  )
}