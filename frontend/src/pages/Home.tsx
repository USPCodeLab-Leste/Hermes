import { useCallback, useMemo, useState, useEffect, memo } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"

// Hooks
import { useActiveTags } from "../hooks/tags/useActiveTags"
import { useSharedSearch } from "../hooks/useSharedSearch"
import { useEvents } from "../hooks/events/useEvents"
// import { useDebug } from "../hooks/useDebug"

// Types
import type { ActiveTags, GenericTag } from "../types/tag"
import type { Event } from "../types/events"

// Componentes
import AppHeader from "../components/AppHeader"
import { EventCard, RemoveFilterTags } from "../components/Events"
import SearchBar from "../components/SearchBar"
import { FilterTagsModal } from "../components/modals/FilterTagsModal"
import { EventCardSkeleton } from "../components/skeletons/EventCardSkeleton"
import { LoadMoreTrigger } from "../components/LoadMoreTrigger"

// Icons
import FilterIcon from "../assets/icons/filter.svg?react"
import FilterSparkIcon from "../assets/icons/filter-spark.svg?react"
import { EventModal } from "../components/modals/EventModal"


export default function Home() {
  const {value: searchQuery, setValue: setSearchQuery} = useSharedSearch()
  const [params, setParams] = useSearchParams()
  const eventId = params.get("event")

  const {activeTags, setActiveTags, activeTagsNames, activeTagsValues} = useActiveTags()
  const {events, hasNextPage, isLoading: isLoadingEvents, isFetching: isEventsFetching, fetchNextPage} = useEvents({eventTitle: searchQuery, tags: activeTagsNames})

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
  }, [setParams])

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

  // useDebug("Home", {
  //   eventId,
  //   searchQuery,
  //   activeTagsKeys: Object.keys(activeTags ?? {}).join(","),
  //   activeTagsNamesLen: activeTagsNames.length,
  //   activeTagsValuesLen: activeTagsValues.length,
  //   eventsLen: events.length,
  //   isLoadingEvents,
  //   isEventsFetching,
  //   countActiveFilters,
  //   selectedEventId,
  //   selectedEventDataId: selectedEventData?.id ?? null,
  //   paramsString: params.toString(),
  // })

  // ===================
  // == Effects
  // ===================

  useEffect(() => {
    if (!eventId) return;

    setSelectedEventId(eventId);
    setIsCardModalOpen(true);
  }, [eventId])

  return (
    <>
      {/* Modal Card Event */}
      <EventModal
        isOpen={isCardModalOpen}
        onClose={handleModalEventClose}
        selectedEventId={selectedEventId}
        selectedEventData={selectedEventData}
        searchQuery={searchQuery}
      />

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
        <EventsSectionMemo 
          events={events}
          isLoadingEvents={isLoadingEvents}
          isEventsFetching={isEventsFetching}
          hasNextPage={hasNextPage}
          handleEventCardClick={handleEventCardClick}
          fetchNextPage={fetchNextPage}
        />
      </main>
    </>
  )
}

interface EventSectionProps {
  events: Event[];
  isLoadingEvents: boolean;
  isEventsFetching: boolean;
  hasNextPage: boolean;
  handleEventCardClick: (id: string) => void;
  fetchNextPage: () => void;
}

const EventsSection = ({ 
  events, 
  isLoadingEvents, 
  isEventsFetching, 
  hasNextPage, 
  handleEventCardClick, 
  fetchNextPage 
}: EventSectionProps) => {
  return (
    <section className={`m-auto mt-10 flex flex-col items-center gap-8`}>
      {(events && events.length > 0) || isLoadingEvents ? (
        <>
          {events?.map((event) => (
            <EventCard key={event.id} event={event} selectEvent={handleEventCardClick} isFetching={isEventsFetching}/>
          ))}
          {(hasNextPage || isLoadingEvents) && (
            <>
            {/* Skeleton observável */}
              {hasNextPage && !isEventsFetching && (
                <LoadMoreTrigger
                  onVisible={fetchNextPage}
                >
                  <EventCardSkeleton />
                </LoadMoreTrigger>
              )}

              {/* Skeletons normais */}
              {[2, 3].map((i) => (
                <EventCardSkeleton key={`event-card-skeleton-${i}`} />
              ))}
            </>
          )}
        </>
      ) : (
        <p className="text-center font-medium p-4" style={{opacity: isEventsFetching ? 0.5 : 1}}>Nenhum evento encontrado com essa busca.</p>
      )}
    </section>
  )
}

const EventsSectionMemo = memo(EventsSection)