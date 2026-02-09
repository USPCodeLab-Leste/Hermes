import { Link, useParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { motion, stagger, type Variants } from "framer-motion";

// Hooks
import { useInfosByTag } from "../../hooks/infos/useInfosByTag";

// Components
import PerfilButton from "../../components/PerfilButton";
import { LazySvg } from "../../components/LazySvg";
import { ModalWrapper } from "../../components/Modal";
import MarkdownRenderer from "../../components/MarkdownRenderer";

const variants: Variants = {
  visible: { 
    transition: {
      delayChildren: stagger(0.05),
    },
  }
}

const variantsChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      // ease: "easeOut", 
      // duration: 0.3,
      type: 'spring',
      stiffness: 320,
      damping: 20,
    }
  },
}

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
          <section className="min-h-50 overflow-auto">
            {/* TODO: transformar o body que está em markdown para componente React */}
            <MarkdownRenderer >
              {selectedInfo.body}
            </MarkdownRenderer>
          </section>
        )}
      </>
    </ModalWrapper>
      <section className="flex flex-col gap-4 h-70">
        <h2 className="text-2xl font-bold">{tagName}</h2>
        <section className="justify-start w-full">
          {isLoadingInfos ? (
            <div>Loading...</div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-2"
              variants={variants}
              initial="hidden"
              animate="visible"
            >
              {infos && infos.map((info, index) => (
                <PerfilButton 
                  key={`info-${index}`} 
                  onClick={() => handleClick(info.id)} 
                  btnName={info.title}
                  icon={<LazySvg name={info.icon_name!} className="size-5" />}
                  variants={variantsChild}
                />
              ))}
            </motion.div>
          )}
        </section>
      </section>
    </>
  );
}
