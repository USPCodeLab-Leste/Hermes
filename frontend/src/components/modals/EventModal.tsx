import { SelectedEventDetails } from "../SelectedEventDetails";
import { SelectedEventDetailsSkeleton } from "../skeletons/SelectedEventDetailsSkeleton";
import { ModalWrapper } from "./Modal";
import { type Event } from "../../types/events";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEventId: string | null;
  selectedEventData: Event | null;
  searchQuery: string;
  isAdmin?: boolean;
}

export function EventModal({ isOpen, onClose, selectedEventId, selectedEventData, searchQuery, isAdmin = false }: EventModalProps) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
    >
      {(selectedEventId && selectedEventData) ? (
        <SelectedEventDetails
          event={selectedEventData}
          search={searchQuery}
          isAdmin={isAdmin}
          onDeleted={onClose}
        />
      ) : (
        <SelectedEventDetailsSkeleton />
      ) }
    </ModalWrapper>
  )
}