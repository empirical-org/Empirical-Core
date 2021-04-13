import { handleApiError, mainApiFetch } from '../../helpers/comprehension';

export const fetchRuleFeedbackHistories = async (key: string, activityId: string, selectedConjunction: string) => {
  if (!selectedConjunction) { return }

  const response = await mainApiFetch(`rule_feedback_histories?activity_id=${activityId}&conjunction=${selectedConjunction}`);
  const ruleFeedbackHistories = await response.json();
  return {
    error: handleApiError('Failed to fetch rule feedback histories, please refresh the page.', response),
    ruleFeedbackHistories: ruleFeedbackHistories.rule_feedback_histories
  };
}

export const fetchRuleFeedbackHistoriesByRule = async (key: string, ruleUID: string) => {
  const response = await mainApiFetch(`rule_feedback_history/${ruleUID}`);
  const ruleFeedbackHistories = await response.json();
  return {
    error: handleApiError('Failed to fetch rule feedback histories, please refresh the page.', response),
    responses: ruleFeedbackHistories[ruleUID].responses
  };
}
