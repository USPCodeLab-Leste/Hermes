// Hooks
import { useInfosByType } from '../../hooks/infos/useInfosByType';

// Components
import { InfoType } from './InfoType';

export default function Estudos() {
  const { data: infos, isLoading: isLoadingInfos } = useInfosByType("estudos");

  const isLoading = isLoadingInfos;
  
  return (
    <InfoType isLoading={isLoading} infos={infos} type="estudos" />
  );
}