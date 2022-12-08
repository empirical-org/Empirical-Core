import { handleApiError, mainApiFetch, getRuleFeedbackHistoriesUrl, getRuleFeedbackHistoryUrl, getActivityStatsUrl, getActivityHealthUrl, getAggregatedActivityHealthsUrl } from '../../helpers/evidence/routingHelpers';

export const fetchRuleFeedbackHistories = async ({ queryKey, }) => {
  const [key, activityId, selectedConjunction, startDate, endDate]: [string, string, string, string?, string?, string?] = queryKey

  if (!selectedConjunction || !startDate) { return }
  const url = getRuleFeedbackHistoriesUrl({ activityId, selectedConjunction, startDate, endDate });
  const response = await mainApiFetch(url);
  const ruleFeedbackHistories = await response.json();
  return {
    error: handleApiError('Failed to fetch rule feedback histories, please refresh the page.', response),
    ruleFeedbackHistories: ruleFeedbackHistories.rule_feedback_histories
  };
}

export const fetchRuleFeedbackHistoriesByRule = async ({ queryKey, }) => {
  const [key, ruleUID, promptId, startDate, endDate]: [string, string, string, string?, string?, string?] = queryKey

  const url = getRuleFeedbackHistoryUrl({ ruleUID, promptId, startDate, endDate });
  const response = await mainApiFetch(url);
  const ruleFeedbackHistories = await response.json();
  return {
    error: handleApiError('Failed to fetch rule feedback histories by rule, please refresh the page.', response),
    responses: ruleFeedbackHistories[ruleUID].responses
  };
}

export const fetchPromptHealth = async ({ queryKey, }) => {
  const [key, activityId, startDate, endDate]: [string, string, string?, string?, string?] = queryKey

  const url = getActivityStatsUrl({ activityId, startDate, endDate });
  const response = await mainApiFetch(url);
  const promptHealth = await response.json();
  return {
    error: handleApiError('Failed to fetch prompt healths, please refresh the page.', response),
    prompts: promptHealth
  };
}

export const fetchActivityHealth = async({queryKey, }) => {
  const [key, activityId, ]: [string, string, ] = queryKey

  const url = getActivityHealthUrl({ activityId, });
  const response = await mainApiFetch(url);
  const activityHealth = await response.json();
  return {
    error: handleApiError('Failed to fetch overall activity stats, please refresh the page.', response),
    activity: activityHealth
  };
}

export const fetchActivityHealths = async({queryKey, }) => {
  const [key]: [string] = queryKey

  const url = getAggregatedActivityHealthsUrl();
  const response = await mainApiFetch(url);
  const activityHealths = await response.json();
  return {
    error: handleApiError('Failed to fetch activity healths, please refresh the page.', response),
    activityHealths: activityHealths
  };
}

