import { type Variants } from "framer-motion"
import { useState } from "react"
import { useEvents } from "../hooks/useEvents"
import { ModalWrapper } from "../components/Modal"
import type { Event } from "../types/events"
import AppHeader from "../components/AppHeader"
import { EventCard } from "../components/Events"

const eventVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.85 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

export default function Home() {
  const { data, isLoading } = useEvents()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const handleEventCardClick = (id: string) => {
    setSelectedEventId(id)
    setIsModalOpen(true)
  }

  const selectedEventData = data?.find((e) => e.id === selectedEventId) ?? null

  return (
    <>
      <AppHeader />
      <main className="main-app">
        {isLoading ? <p>Carregando eventos...</p> : (
          <>
            <ModalWrapper
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            >
              {selectedEventId && selectedEventData && (
                <SelectedEventDetails
                  event={selectedEventData}
                />
              )}
            </ModalWrapper>

            <section className="m-auto mt-10 flex flex-col items-center gap-8">
            {/* <section className="m-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8"> */}
              {data?.map((event) => (
                <EventCard event={event} selectEvent={handleEventCardClick} variants={eventVariants} />
              ))}
            </section>
          </>
        )}
      </main>
    </>
  )
}

function SelectedEventDetails({ event }: { event: Event | null }) {
  return (
    <div>
      <div className="bg-paper dark:bg-violet-dark p-6 rounded-lg max-w-lg w-full flex flex-col gap-2">
        <h2 className="text-2xl font-bold mb-2">{event?.title}</h2>
        <p><strong>Data:</strong> {event?.date}</p>
        <p><strong>Localização:</strong> {event?.location}</p>
        <p><strong>Descrição:</strong> {event?.description}</p>
      </div>
    </div>
  )
}