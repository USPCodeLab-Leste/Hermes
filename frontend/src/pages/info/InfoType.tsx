import { AnimatePresence, motion, stagger, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";


// Components
import { InfoCard } from "../../components/InfoCard";
import { InfoCardSkeleton } from "../../components/skeletons/InfoCardSkeleton";

// Types
import type { Info, InfoCard as InfoCardType } from "../../types/infos";

// Icons
import SearchIcon from "../../assets/icons/search.svg?react";
import { useCallback, useMemo, useState } from "react";
import { MarkdownModal } from "../../components/modals/MarkdownModal";

// Hooks
import { useInfosByTitle } from "../../hooks/infos/useInfos";
import { useDebounce } from "../../hooks/useDebounce";
import { useSharedSearch } from "../../hooks/useSharedSearch";

interface InfoTypeProps {
  isLoading: boolean;
  infos?: Info[] | undefined;
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

export function InfoType({ isLoading, type, infos }: InfoTypeProps) {
  const { value: search } = useSharedSearch();

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
            <InfoCards isLoading={isLoading} infos={infos} type={type} />
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
}

const InfoCards = ({ isLoading, infos, type }: InfoTypeProps) => {

  const cards = useMemo(() => {
    if (!infos) return []

    const map = new Map<string, InfoCardType>()

    for (const info of infos) {
      for (const tag of info.tags) {
        if (tag.type !== type) continue;

        const existing = map.get(tag.name)

        if (existing) {
          existing.count! += 1
        } else {
          map.set(tag.name, {
            cardName: tag.name,
            icon: tag.name.toLocaleLowerCase(),
            count: 1
          })
        }
      }
    }

    return Array.from(map.values())
  }, [infos, type])

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
  const debounceSearch = useDebounce(search);
  const { data: infos, isLoading, isFetching } = useInfosByTitle(debounceSearch);

  const isTyping = search !== debounceSearch || isFetching;

  return (
    <motion.section className="flex flex-col gap-4">
      <p className="mb-2">
        Você está buscando por <em>{debounceSearch}</em>
      </p>
      {isLoading ? (
        <>Carregando resultados...</>
      ) : (
        <div className={`${isTyping ? "pointer-events-none opacity-50" : ""}`}>
          {infos && infos.length > 0 ? (
            <>
              <InfoSearchResultCards infos={infos} search={search} />
            </>
          ) : (
            <p className="text-center font-medium p-4">Nenhum artigo encontrado com essa busca em <em className="capitalize">{type}</em></p>
          )}
        </div>
      )}
    </motion.section>
  );
};

const InfoSearchResultCards = ({ infos, search }: { infos: Info[]; search: string }) => {
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
            search={search}
          />
        ))}
      </motion.div>
    </>
  );
};

interface InfoSearchResultCardProps {
  info: Info;
  handleClick: (info: Info) => void;
  search: string;
}

const InfoSearchResultCard = ({
  info,
  handleClick,
  search
}: InfoSearchResultCardProps) => {
  const { name: tagName, type: tagType } = info.tags[0];

  return (
    <motion.div className="flex flex-row gap-2 items-center">
      <SearchIcon />
      <button
        className="flex-1 flex overflow-hidden font-medium cursor-pointer hover:underline text-left"
        onClick={() => handleClick(info)}
      >
        <Highlighter
          className="inline-block w-full whitespace-nowrap text-ellipsis overflow-hidden"
          highlightClassName="text-ink bg-violet-light rounded-sm"
          searchWords={[search]}
          autoEscape={true}
          textToHighlight={info.title}
        />
      </button>
      <Link to={{ pathname: `/info/${tagType}/${tagName}`, search: `?q=${search}` }} className="transition-colors text-right flex flex-col hover:underline text-sm text-ink/75 dark:text-paper/75">
        {/* <span></span> */}
        <span className="capitalize">{tagType}/</span>
        <span className="capitalize">{tagName}</span>
      </Link>
    </motion.div>
  );
};
