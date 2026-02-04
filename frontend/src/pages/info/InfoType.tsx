import type { InfoCard as InfoCardType } from '../../types/infos';
import { InfoCard } from '../../components/InfoCard';
import { InfoCardSkeleton } from '../../components/skeletons/InfoCardSkeleton';

interface InfoTypeProps {
  isLoading: boolean;
  cards: InfoCardType[] | undefined;
  count: Record<string, number> | undefined;
}

export function InfoType({isLoading, cards, count}: InfoTypeProps) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        <>
          {Array.from({ length: 6 }).map((_, index) => (
            <InfoCardSkeleton key={`info-card-skeleton-${index}`} />
          ))}
        </>

      ) : (
        <>
          {cards && cards.map((card, index) => (
            <InfoCard 
              key={`info-card-${index}`} 
              card={card} 
              count={count ? count[card.card] : undefined} 
            />
          ))}
        </>
      )}
    </section>
  )
}