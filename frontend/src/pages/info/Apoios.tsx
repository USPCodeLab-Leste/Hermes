// Hooks
import { useInfosByType } from '../../hooks/infos/useInfosByType';

// Components
import { InfoType } from './InfoType';

export default function Apoios() {
  const { data: infos, isLoading: isLoadingInfos } = useInfosByType("apoios");

  const isLoading = isLoadingInfos;
  
  return (
    <InfoType isLoading={isLoading} infos={infos} type="apoios" />
  );
}