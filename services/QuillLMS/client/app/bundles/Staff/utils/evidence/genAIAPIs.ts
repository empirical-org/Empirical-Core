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

export const uploadDataset = async (stemVault, file, notes) => {
  const formData = new FormData(); // Create a FormData instance
  formData.append('research_gen_ai_dataset[file]', file); // Add the file to the FormData
  formData.append('research_gen_ai_dataset[notes]', notes); // Add the notes field

  try {
    const response = await fetch(
      `${researchGenAIBaseUrl}/stem_vaults/${stemVault.id}/datasets`,
      {
        method: 'POST',
        body: formData, // Pass the FormData object in the body
        // No need to set headers; fetch automatically sets the correct headers for FormData
      }
    );

    if (response.ok) {
      // Handle success
      console.log('YAY YAY YAY AYAY YAYAY')
    } else {
      // Handle error
      console.error('Failed to upload dataset', await response.json());
    }
  } catch (error) {
    console.error('An error occurred while uploading dataset:', error);
  }
};
