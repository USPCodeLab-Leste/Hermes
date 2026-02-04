import { Link, useParams } from "react-router-dom";
import { useInfosByTag } from "../../hooks/infos/useInfosByTag";
import PerfilButton from "../../components/PerfilButton";
import { useCallback, useMemo, useState } from "react";
import { LazySvg } from "../../components/LazySvg";
import { ModalWrapper } from "../../components/Modal";

export default function Info() {
  const { tagName } = useParams()
  const { data: infos, isLoading: isLoadingInfos } = useInfosByTag(tagName!);
  const [modalOpen, setModalOpen] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);

  // Memos
  const selectedInfo = useMemo(() => infos?.find(info => info.id === articleId), [articleId, infos]);

  // Handlers
  const handleClick = useCallback((id: string) => {
    setArticleId(id);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setArticleId(null);
  }, []);
  
  if (!isLoadingInfos && infos?.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 h-70">
        <div>A tag "{tagName}" não existe, tente novamente com outra tag</div>
        <Link to=".." relative="path" className="bg-teal-mid p-2 text-lg font-medium rounded-xl">Voltar para Infos</Link>
      </section>
    )
  }
  
  return (
    <>
    <ModalWrapper
      isOpen={modalOpen}
      onClose={handleModalClose}
    >
      <>
        <h2 className="text-2xl font-bold mb-4">{selectedInfo?.title}</h2>
        {selectedInfo && (
          <div className="h-50">
            {/* TODO: transformar o body que está em markdown para componente React */}
            {selectedInfo.body}
          </div>
        )}
      </>
    </ModalWrapper>
      <section className="flex flex-col gap-4 h-70">
        <h2 className="text-2xl font-bold">{tagName}</h2>
        <section className="flex flex-col justify-start gap-2 w-full">
          {isLoadingInfos ? (
            <div>Loading...</div>
          ) : (
            <>
            {infos && infos.map((info, index) => {
              return (
                <PerfilButton 
                  key={`info-${index}`} 
                  onClick={() => handleClick(info.id)} 
                  btnName={info.title}
                  icon={<LazySvg name={info.icon_name!} className="size-5" />} 
                />
              )
            })}
            </>
          )}
        </section>
      </section>
    </>
  );
}
