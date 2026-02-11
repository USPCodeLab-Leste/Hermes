// Hooks
import { useInfosCountByType } from '../../hooks/infos/useInfosCountByType';
import { useInfosCardsByType } from '../../hooks/infos/useInfosCardsByType';

// Components
import { InfoType } from './InfoType';

export default function Estudos() {
  const { data: count, isLoading: isLoadingCount } = useInfosCountByType('estudos');
  const { data: cards, isLoading: isLoadingCards } = useInfosCardsByType('estudos');

  const isLoading = isLoadingCount || isLoadingCards;
  
  return (
    <InfoType isLoading={isLoading} cards={cards} count={count} type="estudos" />
  );
}