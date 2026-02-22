import { Link, useParams, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, stagger, type Variants } from "framer-motion";

// Hooks
import { useInfosByTag } from "../../hooks/infos/useInfosByTag";
import { useSharedSearch } from "../../hooks/useSharedSearch";

// Components
import PerfilButton from "../../components/PerfilButton";
import { LazySvg } from "../../components/LazySvg";
import { InfoModal } from "../../components/modals/InfoModal";
import { PerfilButtonSkeleton } from "../../components/skeletons/PerfilButtonSkeleton";

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
  const { value: search } = useSharedSearch();
  const [params, setParams] = useSearchParams()
  const { data: infos, isLoading: isLoadingInfos, isFetching } = useInfosByTag(tagName!, search);
  const [modalOpen, setModalOpen] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);

  // Memos
  const selectedInfo = useMemo(() => infos?.find(info => info.id === articleId), [articleId, infos]);

  // Handlers
  const handleClick = useCallback((id: string) => {
    // setArticleId(id);
    // setModalOpen(true);
    setParams(prev => {
      prev.set("article", id);
      return prev;
    }, { replace: true });
  }, [setParams]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setArticleId(null);
    setParams(prev => {
      prev.delete("article");
      return prev;
    }, { replace: true });
  }, [setParams]);

  // Effects
  useEffect(() => {
    const articleId = params.get("article");

    if (articleId) {
      setArticleId(articleId);
      setModalOpen(true);
    }
  }, [params])
  
  if (!isLoadingInfos && infos?.length === 0 && !search) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 h-70">
        <div>A tag "{tagName}" não existe, tente novamente com outra tag</div>
        <Link to=".." relative="path" className="bg-teal-mid p-2 text-lg font-medium rounded-xl">Voltar para Infos</Link>
      </section>
    )
  }
  
  return (
    <>
      <InfoModal 
        modalOpen={modalOpen} 
        handleModalClose={handleModalClose} 
        selectedInfo={selectedInfo} 
      />
      <section className="flex flex-col gap-4 h-70">
        <motion.h2 
          className="text-2xl font-bold" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.2, ease: "easeInOut" }}
          aria-label={`Tag ${tagName}`}
        >
          {tagName}
        </motion.h2>
        <section 
          className="justify-start w-full"
          style={{
            opacity: isFetching ? 0.5 : 1,
            pointerEvents: isFetching ? "none" : "auto"
          }}
        >
          {isLoadingInfos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <PerfilButtonSkeleton key={`info-card-skeleton-${index}`} />
              ))}
            </div>
          ) : (infos && infos.length > 0) ? (
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
          ) : (
            <p className="text-center font-medium p-4">Nenhum artigo encontrado com essa busca em <em>{tagName}</em></p>
          )}
        </section>
      </section>
    </>
  );
}
