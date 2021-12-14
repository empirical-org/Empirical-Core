import { handleApiError, mainApiFetch, getRuleFeedbackHistoriesUrl, getRuleFeedbackHistoryUrl, getActivityStatsUrl } from '../../helpers/evidence';

export const fetchRuleFeedbackHistories = async (key: string, activityId: string, selectedConjunction: string, startDate?: string, endDate?: string, turkSessionID?: string) => {
  if (!selectedConjunction || !startDate) { return }
  const url = getRuleFeedbackHistoriesUrl({ activityId, selectedConjunction, startDate, endDate, turkSessionID });
  const response = await mainApiFetch(url);
  const ruleFeedbackHistories = await response.json();
  return {
    error: handleApiError('Failed to fetch rule feedback histories, please refresh the page.', response),
    ruleFeedbackHistories: ruleFeedbackHistories.rule_feedback_histories
  };
}

export const fetchRuleFeedbackHistoriesByRule = async (key: string, ruleUID: string, promptId: string, startDate?: string, endDate?: string, turkSessionID?: string) => {
  const url = getRuleFeedbackHistoryUrl({ ruleUID, promptId, startDate, endDate, turkSessionID });
  const response = await mainApiFetch(url);
  const ruleFeedbackHistories = await response.json();
  return {
    error: handleApiError('Failed to fetch rule feedback histories, please refresh the page.', response),
    responses: ruleFeedbackHistories[ruleUID].responses
  };
}

export const fetchPromptHealth = async (key: string, activityId: string, startDate?: string, endDate?: string, turkSessionID?: string) => {
  const url = getActivityStatsUrl({ activityId, startDate, endDate, turkSessionID });
  const response = await mainApiFetch(url);
  const promptHealth = await response.json();
  return {
    error: handleApiError('Failed to fetch rule feedback histories, please refresh the page.', response),
    prompts: promptHealth
  };
}
