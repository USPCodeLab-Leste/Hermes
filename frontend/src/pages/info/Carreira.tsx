// Hooks
import { useInfosByType } from '../../hooks/infos/useInfosByType';

// Components
import { InfoType } from './InfoType';

export default function Carreira() {
  const { data: infos, isLoading: isLoadingInfos } = useInfosByType("carreira");

  const isLoading = isLoadingInfos;
  
  return (
    <InfoType isLoading={isLoading} infos={infos} type="carreira" />
  );
}