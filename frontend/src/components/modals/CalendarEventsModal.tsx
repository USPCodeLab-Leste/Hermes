import { useMemo } from "react";

// Componentes
import { ModalWrapper } from "./Modal";
import { ScrollingTitle } from "../ScrollingTittle";
// import { DateWrapper } from "../Date";
// import { EventCard } from "../Events";

// Utils
import { months } from "../../utils/dates";

// Icons
import MapPinIcon from "../../assets/icons/map-pin.svg?react"
import ClockIcon from "../../assets/icons/clock.svg?react"

// Types
import type { MyDate } from "../../types/calendar";
import type { Event as CalendarEvent } from "../../types/events"

interface CalendarEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: MyDate;
  events: CalendarEvent[]
}

export function CalendarEventsModal({ isOpen, date, events, onClose }: CalendarEventsModalProps) {
  const eventsSorted = useMemo(() => events.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()), [events])

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
    >
      <section className="min-h-100 flex gap-4 flex-col">
        <h2 className="text-xl font-bold">{date.day} de {months[date.month]} de {date.year}</h2>
        {eventsSorted.length > 0 ? (
          <ul className="flex flex-col gap-4 max-h-120 overflow-y-auto overflow-x-hidden pl-5 relative before:content-[''] before:absolute before:h-full before:w-1 before:bg-violet-light before:left-2 before:rounded-b-full">
            {eventsSorted.map((event) => (
              <CalendarEvent key={event.id} event={event} />
            ))}
          </ul>
        ) : (
          <p className="text-violet-light">Nenhum evento para este dia.</p>
        )}
      </section>
    </ModalWrapper>
  )
}

const CalendarEvent = ({ event }: { event: CalendarEvent }) => {
  const hour = new Date(event.created_at).getHours()
  const minutes = new Date(event.created_at).getMinutes()

  const hourFormatted = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

  return (
    <li key={event.id} className="py-2 pl-2 relative before:content-[''] before:absolute before:size-4 before:bg-violet-light before:-left-4.5 before:top-1/2 before:-translate-y-1/2 before:rounded-full">
      {/* <h3 className="font-bold">{event.title}</h3> */}
      <div className="self-end w-full flex flex-col items-startrounded-b-xl">
        <ScrollingTitle title={event.title} className="font-bold text-[18px] md:text-xl text-left" />
        {/* <span>{hour}:{minutes < 10 ? `0${minutes}` : minutes}</span> */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center">
            <ClockIcon className="inline-block mr-1 shrink-0 md:size-5 size-4" />
            <span className="font-medium md:text-[18px] text-[16px]">{hourFormatted}</span>
          </div>
          <div className="flex items-center w-full">
            <MapPinIcon className="inline-block mr-1 shrink-0 md:size-5 size-4" />
            <ScrollingTitle title={event.local} className="font-medium md:text-[18px] text-[16px]" />
            {/* <span className="font-medium">{event.local}</span> */}
          </div>
        </div>
      </div>
      {/* <EventCard 
        event={event}
        selectEvent={() => {}}
      /> */}
    </li>
  )
}