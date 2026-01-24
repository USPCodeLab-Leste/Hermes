import { motion, stagger, type Variants } from "framer-motion"
import { useState } from "react"
import { useEvents } from "../hooks/useEvents"
import { ModalWrapper } from "../components/Modal"
import type { Event } from "../types/events"
import AppHeader from "../components/AppHeader"

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
              {data?.map((event) => (
                <EventCard event={event} selectEvent={handleEventCardClick} />
              ))}
            </section>
          </>
        )}
      </main>
    </>
  )
}

const eventVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.85 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

function EventCard({ event, selectEvent }: { event: Event, selectEvent: (id: string) => void }) {
  const [isReady, setIsReady] = useState(false)

  return (  
    <motion.button
      variants={eventVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{amount: 0.4, once: true}}
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 18,
        duration: 0.5,
        delayChildren: 0.2,
      }}
      key={event.id} 
      className={`max-w-120 h-60 w-full overflow-hidden bg-violet-dark rounded-xl flex flex-col bg-cover bg-no-repeat 
                 bg-center justify-between cursor-pointer hover:-translate-y-2 shadow-lg hover:shadow-2xl 
                 outline-2 hover:outline-paper focus:outline-paper outline-transparent ${isReady ? 'transition-all' : ''}`}
      style={{ backgroundImage: `url('https://picsum.photos/600/200?random=${event.id}')`}}
      onClick={() => selectEvent(event.id)}
      onAnimationComplete={() => setIsReady(true)}
      aria-label={`Selecionar evento ${event.title}`}
    >
      <Tags tags={event.tags} />
      <div className="self-end w-full p-4 flex flex-col items-start backdrop-blur-sm from-violet-light/30 to-violet-mid bg-linear-to-b">
        <h2 className="font-bold text-xl">{event.title}</h2>
        <p>{event.date}</p>
      </div>
    </motion.button>
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