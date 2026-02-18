import { useCallback, useMemo, useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"

// Hooks
import { useEvents } from "../hooks/events/useEvents"
import { useActiveTags } from "../hooks/tags/useActiveTags"
import { useSharedSearch } from "../hooks/useSharedSearch"

// Types
import type { ActiveTags, GenericTag } from "../types/tag"

// Componentes
import { ModalWrapper } from "../components/modals/Modal"
import AppHeader from "../components/AppHeader"
import { EventCard, RemoveFilterTags } from "../components/Events"
import SearchBar from "../components/SearchBar"
import { SelectedEventDetails } from "../components/SelectedEventDetails"
import { SelectedEventDetailsSkeleton } from "../components/skeletons/SelectedEventDetailsSkeleton"
import { FilterTagsModal } from "../components/modals/FilterTagsModal"
import { EventCardSkeleton } from "../components/skeletons/EventCardSkeleton"

// Icons
import FilterIcon from "../assets/icons/filter.svg?react"
import FilterSparkIcon from "../assets/icons/filter-spark.svg?react"


export default function Home() {
  const {value: searchQuery, setValue: setSearchQuery} = useSharedSearch()
  const [params, setParams] = useSearchParams()
  const {activeTags, setActiveTags, activeTagsNames, activeTagsValues} = useActiveTags()
  const { data: events, isLoading: isLoadingEvents, isTyping } = useEvents(searchQuery, activeTagsNames)

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

  // Abre modal de filtros
  const handleFilterClick = useCallback(() => {
    setIsFilterModalOpen(true)
  }, [])

  // Fecha modal de filtros sem aplicar mudanças
  const handleModalFilterClose = useCallback(() => {
    setIsFilterModalOpen(false)
  }, [])

  // Aplica os filtros selecionados
  const onFilter = useCallback((activeTagsCopy: ActiveTags) => {
    setIsFilterModalOpen(false)
    setActiveTags(structuredClone(activeTagsCopy))
    toast.success("Filtros aplicados com sucesso!")
  }, [])

  const onClean = useCallback(() => {
    setIsFilterModalOpen(false)
    setActiveTags({} as ActiveTags)
    toast.success("Filtros limpos com sucesso!")
  }, [])

  // Adiciona ou remove tag dos filtros ativos no modal
  const handleRemoveFilterTag = useCallback((tag: GenericTag) => {
    setActiveTags((prev) => {
      const { [tag.id]: _, ...rest } = prev;
      return rest;
    })
  }, [])

  // ===================
  // == Memos
  // ===================

  const countActiveFilters = useMemo(() => Object.values(activeTags).length, [activeTags])
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
            className="cursor-pointer bg-teal-mid border-2 border-teal-mid py-2 px-2 rounded-full
                       hover:border-teal-light hover:bg-teal-light aria-expanded:border-teal-light aria-expanded:bg-teal-light
                        transition-colors group flex flex-row gap-2 items-center justify-center"
            aria-label="Abrir filtros de busca"
            aria-expanded={isFilterModalOpen}
          >
            {countActiveFilters > 0 ? (
              <>
                <FilterSparkIcon className="text-paper transition-colors size-6 shrink-0"/>
                <div className="bg-violet-light rounded-full aspect-square p-3 relative">
                  <span className="text-paper text-sm font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{countActiveFilters}</span>
                </div>
              </>
            ) : (
              <FilterIcon className="text-paper transition-colors"/>
            )}
          </button>
        </div>
        {activeTagsValues.length > 0 && (
          <div className="self-start w-full">
            <RemoveFilterTags tags={activeTagsValues} onClick={handleRemoveFilterTag}/>
          </div>

        )}
      </AppHeader>

      <main className="main-app">
        <section className={`m-auto mt-10 flex flex-col items-center gap-8`}>
          {isLoadingEvents ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <EventCardSkeleton key={`event-card-skeleton-${i}`} />
              ))}
            </>
          ) : events && events.length > 0 ? (
            <>
                {events?.map((event) => (
                  <EventCard key={event.id} event={event} selectEvent={handleEventCardClick} isFetching={isTyping}/>
                ))}
            </>
          ) : (
            <p className="text-center font-medium p-4" style={{opacity: isTyping ? 0.5 : 1}}>Nenhum evento encontrado com essa busca.</p>
          )}
        </section>
      </main>
    </>
  )
}