import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Icons
import Arrow from "../assets/icons/right-arrow.svg?react"

// Types
import type { Day, MyDate, HashDays } from "../types/calendar";

// Utils
import { daysOfWeek, months } from "../utils/dates";
import type { Event as CalendarEvent } from "../types/events";

function getMonthDays(month: number, year: number): Day[] {
  let days: Day[] = []

  const TOTAL_DAYS = 6 * 7

  const today = new Date()
  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear()
  const start = new Date(year, month, 1).getDay() // Dia da semana do primeiro dia do mês (1-Domingo, 2-Segunda, ..., 7-Sábado)
  const endDate = new Date(year, month + 1, 0).getDate() // Último dia do mês (28, 29, 30 ou 31)
  const endDatePrev = new Date(year, month, 0).getDate() // Último dia do mês anterior (28, 29, 30 ou 31)

  // Prev
  for (let i = start; i > 0; i--) {
    const date: Day = {
      date: endDatePrev - i + 1,
      isCurrentMonth: false,
      isToday: false
    }

    days.push(date)
  }

  // Current
  for (let i = 1; i <= endDate; i++) {
    const date: Day = {
      date: i,
      isCurrentMonth: true,
      isToday: isCurrentMonth && i === today.getDate()
    }

    days.push(date)
  }

  const missingDays = TOTAL_DAYS - days.length

  // Next
  for (let i = 1; i <= missingDays; i++) {
    const date: Day = {
      date: i,
      isCurrentMonth: false,
      isToday: false

    }

    days.push(date)
  }

  return days
}

interface CalendarDayProps {
  day: Day
  onClick: (day: Day, events: CalendarEvent[]) => void
  events: CalendarEvent[]
}

const CalendarDay = ({ day, onClick, events }: CalendarDayProps) => {
  const handleClick = useCallback(() => {
    if (!day.isCurrentMonth) return

    onClick(day, events);
  }, [onClick, day]);

  const hasEvents = events.length > 0

  return (
    <button
      className={`p-2 md:aspect-4/3 aspect-3/4 rounded-lg flex items-center justify-center transition-colors md:text-[16px] text-xs ${day.isCurrentMonth ? 'text-paper hover:bg-violet-mid cursor-pointer' : 'text-violet-light'}`}
      aria-label={`Dia ${day.date} ${day.isCurrentMonth ? '' : 'fora do mês atual'}`}
      onClick={handleClick}
    >
      <span className={`inline-flex items-center justify-center relative rounded-full aspect-square md:size-7 size-6 ${day.isToday ? 'bg-teal-light/50' : ''} ${hasEvents ? 'after:contet-[""] after:absolute after:-bottom-3.5 after:left-1/2 after:size-2 after:rounded-full after:bg-teal-light after:-translate-1/2' : ''}`}>{day.date}</span>
    </button>
  )
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0
  })
}

interface CalendarProps {
  date: MyDate;
  events: CalendarEvent[]
  monthSpan?: number;
  onClickDay: (day: Day, events: CalendarEvent[]) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function Calendar({ date, monthSpan = 6, events, onClickDay, onPrevMonth, onNextMonth }: CalendarProps) {
  const currDate = new Date()
  const currYear = currDate.getFullYear()
  const currMonth = currDate.getMonth()

  const isPrevEnabled = new Date(currYear, currMonth - monthSpan) <= new Date(date.year, date.month)
  const isNextEnabled = new Date(currYear, currMonth + monthSpan) >= new Date(date.year, date.month)

  const [direction, setDirection] = useState< -1| 1>(1)

  const days = getMonthDays(date.month, date.year)

  const eventsHash = events.reduce((acc, curr) => {
    const day = new Date(curr.data_inicio).getDate()

    if (acc[day]) {
      acc[day].push(curr)
    } else {
      acc[day] = [curr]
    }

    return acc
  }, {} as HashDays)

  // Handlers
  const handlePrevMonth = useCallback(() => {
    if (!isPrevEnabled) return

    setDirection(-1)
    onPrevMonth()
  }, [isPrevEnabled])

  const handleNextMonth = useCallback(() => {
    if (!isNextEnabled) return

    setDirection(1)
    onNextMonth()
  }, [isNextEnabled])

  return (
    <div className="w-full bg-violet-dark p-4 rounded-2xl shadow-2xl overflow-hidden">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-paper">
          {months[date.month]} {date.year}
        </h2>
        <div>
          <button onClick={handlePrevMonth}>
            <Arrow 
              className={`text-paper rotate-180 hover:text-paper/75 transition-colors ${!isPrevEnabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} 
              aria-label="Mês anterior"
            />
          </button>
          <button onClick={handleNextMonth}>
            <Arrow 
              className={`text-paper hover:text-paper/75 transition-colors ${!isNextEnabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label="Mês seguinte"
            />
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${date.month}-${date.year}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="w-full"
        >
          <div className="grid grid-cols-7">
            {/* Days of the week */}
            {daysOfWeek.map((day, index) => (
              <div key={`day-of-week-${index}`} className="md:text-[16px] py-2 text-xs text-center text-paper/75 font-bold select-none">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => (
              <CalendarDay key={`day-${index}`} day={day} onClick={onClickDay} events={eventsHash[day.date] || []} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  )
}
