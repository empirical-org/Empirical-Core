import { handleApiError, apiFetch } from '../../helpers/comprehension';

export const fetchRuleFeedbackHistories = async (key: string, activityId: string, selectedPromptId: string) => {
  if (!selectedPromptId) { return }

  const response = await apiFetch(`rule_feedback_histories/${activityId}?conjunction=${selectedPromptId}`);
  const rules = await response.json();
  return {
    error: handleApiError('Failed to fetch rules, please refresh the page.', response),
    rules: rules
  };
}
