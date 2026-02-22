import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';

// Hooks
import { useSharedSearch } from "../../hooks/useSharedSearch";
import { useMyInfos } from "../../hooks/infos/useMyInfos";

// Components
import PerfilButton from "../../components/PerfilButton";
import { LazySvg } from "../../components/LazySvg";
import { PerfilButtonSkeleton } from "../../components/skeletons/PerfilButtonSkeleton";
import { InfoModal } from '../../components/modals/InfoModal';
import { CreateInfoModal } from '../../components/modals/CreateInfoModal';

// Icons
import PlusIcon from "../../assets/icons/plus.svg?react";

export default function CreateInfo() {
  const { value: search } = useSharedSearch();

  return (
    <>
        <AdminInfosGrid search={search} />
    </>
  );
}

interface AdminInfosGridProps {
  search: string;
}

function AdminInfosGrid({ search }: AdminInfosGridProps) {
  const queryClient = useQueryClient();
  const { data: infos, isLoading, isFetching } = useMyInfos(search);

  const [modalOpen, setModalOpen] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleNewInfo = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCreateInfoModalClose = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleSelectInfo = useCallback((id: string) => {
    setArticleId(id);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setArticleId(null);
  }, []);

  const handleOnCreated = useCallback(() => {
    queryClient.invalidateQueries({ predicate: (query: any) => {
      return query.queryKey[0] === 'my-infos' || query.queryKey[0] === 'infos';
    }})
  }, [])

  const selectedInfo = useMemo(
    () => infos?.find((info) => info.id === articleId),
    [infos, articleId],
  );

  return (
    <>
      <CreateInfoModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateInfoModalClose}
        onCreated={handleOnCreated}
      />

      <InfoModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        selectedInfo={selectedInfo}
        isAdmin={true}
      />

      <section
        className="justify-start w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        <CreateInfoButton onClick={handleNewInfo} />
        {isLoading ? (
          <>
            {Array.from({ length: 11 }).map((_, index) => (
              <PerfilButtonSkeleton key={`admin-info-skeleton-${index}`} />
            ))}
          </>
        ) : infos && infos.length > 0 ? (
          <>
            {infos.map((info) => (
              <PerfilButton
                key={info.id}
                onClick={() => handleSelectInfo(info.id)}
                btnName={info.title}
                isFetching={isFetching}
                icon={
                  <LazySvg
                    name={info.icon_name ?? 'unknown'}
                    className="size-5"
                  />
                }
              />
            ))}
          </>
        ) : (
          <p className={`text-center font-medium p-4 ${isFetching ? 'opacity-50' : ''}`}>
            Nenhuma informação encontrada com essa busca.
          </p>
        )}
      </section>
    </>
  )
}

const CreateInfoButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Adicionar Informação"
      className="cursor-pointer text-[20px]/[24px] flex items-center justify-between gap-2 md:max-w-95 w-full h-11.25 border-2 border-dashed px-2 py-4 
                 rounded-2xl transition-colors duration-200 ease-in hover:bg-violet-mid/50 focus:bg-violet-mid/50 outline-none group"

    >
      <PlusIcon className="size-5" />
      <span className='inline-block text-left whitespace-nowrap text-ellipsis overflow-hidden flex-1'>Crie uma nova Informação</span>
    </motion.button>
  )
}
