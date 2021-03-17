import { handleApiError, mainApiFetch } from '../../helpers/comprehension';

export const fetchConcepts = async (key: string) => {
  const response = await mainApiFetch(`concepts/level_zero_concepts_with_lineage`);
  const data = await response.json();
  return {
    error: handleApiError('Failed to fetch concepts, please refresh the page.', response),
    concepts: data.concepts
  };
}
