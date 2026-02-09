// Hooks
import { useInfosCountByType } from '../../hooks/infos/useInfosCountByType';
import { useInfosCardsByType } from '../../hooks/infos/useInfosCardsByType';

// Components
import { InfoType } from './InfoType';

export default function Carreira() {
  const { data: count, isLoading: isLoadingCount } = useInfosCountByType('carreira');
  const { data: cards, isLoading: isLoadingCards } = useInfosCardsByType('carreira');

  const isLoading = isLoadingCount || isLoadingCards;
  
  return (
    <InfoType isLoading={isLoading} cards={cards} count={count} />
  );
}