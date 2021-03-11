import { handleApiError, apiFetch } from '../../helpers/comprehension';

export const fetchResponses = async (key: string, activityId: string, ruleId: string) => {
  let responses
  const response = await apiFetch(`activities/${responsesId}`);
  responses = await response.json();
  return {
    responses,
  };
}
