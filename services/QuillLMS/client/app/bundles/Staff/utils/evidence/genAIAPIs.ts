import { apiFetch, handleApiError, } from '../../helpers/evidence/routingHelpers';

export const fetchStemVaultsForEvidenceActivity = async ({ queryKey }) => {
  const [key, activityId]: [string, string] = queryKey

  const response = await apiFetch(`activities/${activityId}/stem_vaults`);

  let stemVaults = await response.json();

  if(stemVaults && stemVaults.stem_vaults) {
    stemVaults = stemVaults.stem_vaults;
  }

  return {
    error: handleApiError('Failed to fetch stem vaults, please refresh the page.', response),
    stemVaults
  };
}
