import { ModalWrapper } from "./Modal";
import MarkdownRenderer from "../MarkdownRenderer";
import type { Info } from "../../types/infos";
import { GenericButton } from "../GenericButton";
import { useCallback } from "react";

interface MarkdownModalProps {
  modalOpen: boolean;
  handleModalClose: () => void;
  selectedInfo: Info | undefined;
}

export function MarkdownModal({ modalOpen, handleModalClose, selectedInfo }: MarkdownModalProps) {
  const handleShareArticle = useCallback((info: Info) => {
    const tag = info.tags[0]
    const link = `/info/${tag.type}/${tag.name}?q=${info.title}&article=${info.id}`
  }, []);
    
  return (
    <ModalWrapper isOpen={modalOpen} onClose={handleModalClose}>
      <>
        {selectedInfo ? (
          <section className="flex flex-col gap-4">
            <div className="max-h-[60dvh] overflow-auto">
              <h2 className="text-2xl font-bold mb-4 before:content-['#_']">{selectedInfo?.title}</h2>
              <MarkdownRenderer>{selectedInfo.body}</MarkdownRenderer>
            </div>
            <GenericButton
              onClick={() => handleShareArticle(selectedInfo)}
            >
              <span className="text-paper">Compartilhar Artigo</span>
            </GenericButton>
          </section>
        ) : (
          <section className="min-h-70">
            <MarkdownModalSkeleton />
          </section>
        )}
      </>
    </ModalWrapper>
  );
}

const MarkdownModalSkeleton = () => {
  return (
    <div aria-hidden="true">
      <h2 className="text-2xl font-bold mb-4 shimmer text-transparent rounded-2xl w-fit">título grandao</h2>
      <div className="markdown-body">
        <h1 className="shimmer text-transparent rounded-2xl border-none!">Cabeçalho 1</h1>
        <p className="shimmer text-transparent rounded-2xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p className="shimmer text-transparent rounded-2xl">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p className="shimmer text-transparent rounded-2xl">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p className="shimmer text-transparent rounded-2xl">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        <p className="shimmer text-transparent rounded-2xl">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    </div>
  );
}