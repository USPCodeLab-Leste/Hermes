import { AnimatePresence, motion, stagger, type Variants } from 'framer-motion';

// Components
import { InfoCard } from '../../components/InfoCard';
import { InfoCardSkeleton } from '../../components/skeletons/InfoCardSkeleton';

// Types
import type { InfoCard as InfoCardType } from '../../types/infos';

interface InfoTypeProps {
  isLoading: boolean;
  cards: InfoCardType[] | undefined;
  count: Record<string, number> | undefined;
}

const infoCardsVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.1),
    }
  }
}

const infoCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  }
}

export function InfoType({isLoading, cards, count}: InfoTypeProps) {
  return (
    <section>
      <AnimatePresence mode='wait'>
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
          >
            {cards && cards.map((card, index) => (
              <InfoCard 
                key={`info-card-${index}`} 
                card={card} 
                count={count ? count[card.card] : undefined}
                variants={infoCardVariants}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}