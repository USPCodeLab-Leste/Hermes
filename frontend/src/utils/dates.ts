function formatDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z"
}

type CalendarEvent = {
  title: string
  description?: string
  location?: string
  start: Date
  end: Date
}

export function downloadICS(event: CalendarEvent) {
  const start = formatDate(event.start)
  const end = formatDate(event.end)

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description ?? ""}
LOCATION:${event.location ?? ""}
DTSTART:${start}
DTEND:${end}
END:VEVENT
END:VCALENDAR
`.trim()

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = window.URL.createObjectURL(blob)

  window.location.href = url
}

export const formatDateTimeForInput = (isoDateString: string | null | undefined) => {
  if (!isoDateString) return "";

  const date = new Date(isoDateString);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (value: number) => value.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function createGoogleCalendarLink(event: {
  title: string
  description?: string
  location?: string
  start: Date
  end: Date
}) {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE"

  const text = encodeURIComponent(event.title)
  const details = encodeURIComponent(event.description || "")
  const location = encodeURIComponent(event.location || "")

  const start = formatDate(event.start)
  const end = formatDate(event.end)

  return `${base}&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`
}
