import { useCallback, useState } from "react";
import AppHeader from "../components/AppHeader";
import { Calendar } from '../components/Calendar';
import type { Day } from "../types/calendar";
import { CalendarEventsModal } from "../components/modals/CalendarEventsModal";

export default function CalendarPage() {
  const currDate = new Date()
  const currMonth = currDate.getMonth()
  const currYear = currDate.getFullYear()

  const [date, setDate] = useState({
    month: currMonth,
    year: currYear,
  })
  const [isCalendarEventsModalOpen, setIsCalendarEventsModalOpen] = useState(false)

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

  const handleClickDay = useCallback((day: Day) => {
    setIsCalendarEventsModalOpen(true)
    setDate(prev => ({
      ...prev,
      day: day.date
    }))
  }, [])

  console.log(date)

  return (
    <>
      <CalendarEventsModal
        isOpen={isCalendarEventsModalOpen}
        onClose={() => setIsCalendarEventsModalOpen(false)}
        date={date}
      />

      <AppHeader />
      <main className="main-app px-0! pt-5!">
        <Calendar 
          date={date}
          onClickDay={handleClickDay}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </main>
    </>
  )
}