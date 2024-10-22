import { apiFetch, handleApiError, handleRequestErrors, requestFailed } from '../../helpers/evidence/routingHelpers';

export const fetchStemVaultsForActivity = async ({ queryKey }) => {
  const [key, activityId, promptId, ruleType]: [string, string, any, string] = queryKey

  const url = getRulesUrl(activityId, promptId, ruleType)

  const response = await apiFetch(url);
  let rules = await response.json();
  if(rules && rules.rules) {
    rules = rules.rules;
  }
  return {
    error: handleApiError('Failed to fetch rules, please refresh the page.', response),
    rules: rules
  };
}
