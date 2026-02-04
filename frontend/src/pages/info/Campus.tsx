// Hooks
import { useInfosCountByType } from '../../hooks/infos/useInfosCountByType';
import { useInfosCardsByType } from '../../hooks/infos/useInfosCardsByType';

// Components
import { InfoType } from './InfoType';

export default function Campus() {
  const { data: count, isLoading: isLoadingCount } = useInfosCountByType('campus');
  const { data: cards, isLoading: isLoadingCards } = useInfosCardsByType('campus');

  const isLoading = isLoadingCount || isLoadingCards;
  
  return (
    <InfoType isLoading={isLoading} cards={cards} count={count} />
  );
}