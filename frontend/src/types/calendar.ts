import type { Event as CalendarEvent } from "./events"

export type Day = {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export type MyDate = {
  day?: number;
  month: number;
  year: number;
}

export type HashDays = {
  [key: number]: CalendarEvent[]
}