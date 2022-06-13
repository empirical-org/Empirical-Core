import { handleApiError, mainApiFetch } from '../../helpers/evidence/routingHelpers';

export const fetchConcepts = async () => {
  const response = await mainApiFetch(`concepts/level_zero_concepts_with_lineage`);
  const data = await response.json();
  return {
    error: handleApiError('Failed to fetch concepts, please refresh the page.', response),
    concepts: data.concepts
  };
}
