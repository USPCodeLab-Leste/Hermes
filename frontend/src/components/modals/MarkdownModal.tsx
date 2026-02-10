import { ModalWrapper } from "./Modal";
import MarkdownRenderer from "../MarkdownRenderer";
import type { Info } from "../../types/infos";

interface MarkdownModalProps {
  modalOpen: boolean;
  handleModalClose: () => void;
  selectedInfo: Info | undefined;
}

export function MarkdownModal({ modalOpen, handleModalClose, selectedInfo }: MarkdownModalProps) {
  return (
    <ModalWrapper isOpen={modalOpen} onClose={handleModalClose}>
      <>
        <h2 className="text-2xl font-bold mb-4">{selectedInfo?.title}</h2>
        {selectedInfo && (
          <section className="min-h-50 overflow-auto">
            <MarkdownRenderer>{selectedInfo.body}</MarkdownRenderer>
          </section>
        )}
      </>
    </ModalWrapper>
  );
}
