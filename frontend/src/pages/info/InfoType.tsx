import { AnimatePresence, motion, stagger, type Variants } from "framer-motion";
import { useOutletContext, Link, useLocation } from "react-router-dom";
import Highlighter from "react-highlight-words";


// Components
import { InfoCard } from "../../components/InfoCard";
import { InfoCardSkeleton } from "../../components/skeletons/InfoCardSkeleton";

// Types
import type { Info, InfoCard as InfoCardType } from "../../types/infos";
import { useInfosByQueryAndType } from "../../hooks/infos/useInfosByQueryAndType";

// Icons
import SearchIcon from "../../assets/icons/search.svg?react";
import { useCallback, useState } from "react";
import { MarkdownModal } from "../../components/modals/MarkdownModal";

interface InfoCardProps {
  isLoading: boolean;
  cards: InfoCardType[] | undefined;
  count: Record<string, number> | undefined;
}

interface InfoTypeProps extends InfoCardProps {
  type: string;
}

const infoCardsVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.1),
    },
  },
};

const infoCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function InfoType({ isLoading, cards, count, type }: InfoTypeProps) {
  const { search } = useOutletContext<{ search: string }>();

  return (
    <section>
      <AnimatePresence mode="wait">
        {search ? (
          <motion.section
            key="search-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <InfoSearchResults search={search} type={type} />
          </motion.section>
        ) : (
          <motion.section
            key="info-cards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <InfoCards isLoading={isLoading} cards={cards} count={count} />
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
}

const InfoCards = ({ isLoading, cards, count }: InfoCardProps) => {
  return (
    <>
      {isLoading ? (
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-3 gap-6"
          key="info-cards-skeleton"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <InfoCardSkeleton key={`info-card-skeleton-${index}`} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-3 gap-6"
          key="info-cards"
          variants={infoCardsVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {cards &&
            cards.map((card, index) => (
              <InfoCard
                key={`info-card-${index}`}
                card={card}
                count={count ? count[card.card] : undefined}
                variants={infoCardVariants}
              />
            ))}
        </motion.div>
      )}
    </>
  );
};

interface InfoSearchResultsProps {
  search: string;
  type: string;
}

const InfoSearchResults = ({ search, type }: InfoSearchResultsProps) => {
  const { data: infos, isLoading } = useInfosByQueryAndType(search, type);

  return (
    <motion.section className="flex flex-col gap-4">
      <p className="mb-2">
        Você está buscando por <em>{search}</em>
      </p>
      {isLoading ? (
        <>Carregando resultados...</>
      ) : (
        <>
          {infos && infos.length > 0 ? (
            <InfoSearchResultCards infos={infos} />
          ) : (
            <p className="text-center font-medium p-4">Nenhum artigo encontrado com essa busca em <em className="capitalize">{type}</em></p>
          )}
        </>
      )}
    </motion.section>
  );
};

const InfoSearchResultCards = ({ infos }: { infos: Info[] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<Info | undefined>(undefined);

  // Handlers 

  const handleClick = useCallback((info: Info) => {
    setSelectedInfo(info);
    setModalOpen(true);
  }, []);

  return (
    <>
      <MarkdownModal
        modalOpen={modalOpen}
        handleModalClose={() => setModalOpen(false)}
        selectedInfo={selectedInfo}
      />
      <motion.div
        className="grid grid-cols-1 gap-4"
        key="info-search-result-cards"
        variants={infoCardsVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {infos.map((info, index) => (
          <InfoSearchResultCard
            key={`info-search-result-card-${index}`}
            info={info}
            handleClick={handleClick}
          />
        ))}
      </motion.div>
    </>
  );
};

interface InfoSearchResultCardProps {
  info: Info;
  handleClick: (info: Info) => void;
}

const InfoSearchResultCard = ({
  info,
  handleClick,
}: InfoSearchResultCardProps) => {
  const tagName = info.tags[0].name;
  const { search } = useLocation();

  return (
    <motion.div className="flex flex-row gap-2 items-center">
      <SearchIcon />
      <button
        className="w-full flex overflow-hidden font-medium cursor-pointer hover:underline text-left"
        onClick={() => handleClick(info)}
      >
        <Highlighter
          className="inline-block w-full whitespace-nowrap text-ellipsis overflow-hidden"
          highlightClassName="text-ink bg-violet-light rounded-sm"
          searchWords={[search.replace("?q=", "")]}
          autoEscape={true}
          textToHighlight={info.title}
        />
      </button>
      <div>
        <Link to={{ pathname: tagName, search }} className="transition-colors">
          <span className="capitalize hover:underline">/{tagName}</span>
        </Link>
      </div>
    </motion.div>
  );
};
