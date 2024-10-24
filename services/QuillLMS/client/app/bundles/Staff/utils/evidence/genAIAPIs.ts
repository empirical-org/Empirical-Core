import { apiFetch, handleApiError, evidenceBaseUrl, } from '../../helpers/evidence/routingHelpers';
import { requestPost, } from '../../../../modules/request'

const researchGenAIBaseUrl = `${evidenceBaseUrl}research/gen_ai`

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

// we have to use a custom fetch request here because we need to use formData to submit the CSV, which requires non-standard headers (automatically formatted by formData)
export const uploadDataset = async (stemVault, file, notes, successFunction, errorFunction) => {
  const formData = new FormData();
  formData.append('research_gen_ai_dataset[file]', file);
  formData.append('research_gen_ai_dataset[notes]', notes);

  try {
    const response = await fetch(
      `${researchGenAIBaseUrl}/stem_vaults/${stemVault.id}/datasets`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (response.ok) {
      successFunction()
    } else {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error.file.toString());
    }
  } catch (error) {
    errorFunction(error.toString());
  }
};
