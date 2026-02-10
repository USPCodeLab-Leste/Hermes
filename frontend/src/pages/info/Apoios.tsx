// Hooks
import { useInfosCountByType } from '../../hooks/infos/useInfosCountByType';
import { useInfosCardsByType } from '../../hooks/infos/useInfosCardsByType';

// Components
import { InfoType } from './InfoType';

export default function Apoios() {
  const { data: count, isLoading: isLoadingCount } = useInfosCountByType('apoios');
  const { data: cards, isLoading: isLoadingCards } = useInfosCardsByType('apoios');

  const isLoading = isLoadingCount || isLoadingCards;
  
  return (
    <InfoType isLoading={isLoading} cards={cards} count={count} />
  );
}