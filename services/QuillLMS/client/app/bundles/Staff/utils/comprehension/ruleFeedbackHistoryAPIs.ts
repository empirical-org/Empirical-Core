import { handleApiError, apiFetch } from '../../helpers/comprehension';

export const fetchRuleFeedbackHistories = async (key: string, activityId: string, selectedPromptId: string) => {
  if (!selectedPromptId) { return }

  const response = await apiFetch(`rule_feedback_histories/${activityId}?conjunction=${selectedPromptId}`);
  const ruleFeedbackHistories = await response.json();
  return {
    error: handleApiError('Failed to fetch rule feedback histories, please refresh the page.', response),
    ruleFeedbackHistories
  };
}
