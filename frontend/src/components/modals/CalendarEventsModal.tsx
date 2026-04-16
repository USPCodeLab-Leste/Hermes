import type { MyDate } from "../../types/calendar";
import { months } from "../../utils/dates";
import { ModalWrapper } from "./Modal";

interface CalendarEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: MyDate;
}

export function CalendarEventsModal({ isOpen, onClose, date }: CalendarEventsModalProps) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
    >
      <>
        <h2 className="text-xl font-bold">{date.day} de {months[date.month]} de {date.year}</h2>
      </>
    </ModalWrapper>
  )
}