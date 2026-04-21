import { useCallback, useState } from "react";

// Componentes
import AppHeader from "../components/AppHeader";
import { Calendar } from '../components/Calendar';
import { CalendarEventsModal } from "../components/modals/CalendarEventsModal";

// Hooks
import { useMonthlyEvent } from "../hooks/events/useMonthlyEvent";

//Types
import type { Day } from "../types/calendar";
import type { Event as CalendarEvent } from "../types/events"

export default function CalendarPage() {
  const currDate = new Date()
  const currMonth = currDate.getMonth()
  const currYear = currDate.getFullYear()

  const [date, setDate] = useState({
    month: currMonth,
    year: currYear,
  })
  const [isCalendarEventsModalOpen, setIsCalendarEventsModalOpen] = useState(false)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const { data: events, isLoading, isFetching } = useMonthlyEvent(date)

  // Handlers
  const handlePrevMonth = useCallback(() => {
    setDate(prev => {
      const nextDate = new Date(prev.year, prev.month - 1)

      return {
        month: nextDate.getMonth(),
        year: nextDate.getFullYear()
      }
    })

  }, [])

  const handleNextMonth = useCallback(() => {
    setDate(prev => {
      const nextDate = new Date(prev.year, prev.month + 1)

      return {
        month: nextDate.getMonth(),
        year: nextDate.getFullYear()
      }
    })

  }, [])

  const handleClickDay = useCallback((day: Day, events: CalendarEvent[]) => {
    setCalendarEvents(events)
    setIsCalendarEventsModalOpen(true)
    setDate(prev => ({
      ...prev,
      day: day.date
    }))
  }, [])

  return (
    <>
      <CalendarEventsModal
        isOpen={isCalendarEventsModalOpen}
        onClose={() => setIsCalendarEventsModalOpen(false)}
        date={date}
        events={calendarEvents}
      />

      <AppHeader />
      <main className="main-app px-0! pt-5!">
        <Calendar 
          date={date}
          events={events?.data || []}
          onClickDay={handleClickDay}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </main>
    </>
  )
}