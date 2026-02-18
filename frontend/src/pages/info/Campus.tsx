// Hooks
import { useInfosByType } from '../../hooks/infos/useInfosByType';

// Components
import { InfoType } from './InfoType';

export default function Campus() {
  const { data: infos, isLoading: isLoadingInfos } = useInfosByType("campus");

  const isLoading = isLoadingInfos;
  
  return (
    <InfoType isLoading={isLoading} infos={infos} type="campus" />
  );
}