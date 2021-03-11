import { RuleInterface } from '../../interfaces/comprehensionInterfaces';
import { handleApiError, apiFetch } from '../../helpers/comprehension';

export const fetchRules = async (key: string, activityId: string, promptId?: any, ruleType?: string) => {
  let url = `activities/${activityId}/rules`;
  if(promptId && !ruleType) {
    url = `rules?prompt_id=${promptId}`
  } else if(!promptId && ruleType) {
    url = `rules?rule_type=${ruleType}`
  } else if(promptId && ruleType) {
    url = `rules?prompt_id=${promptId}&rule_type=${ruleType}`
  }
  const response = await apiFetch(url);
  const rules = await response.json();
  return {
    error: handleApiError('Failed to fetch rules, please refresh the page.', response),
    rules: rules
  };
}

export const fetchUniversalRules = async (key: string) => {
  const response = await apiFetch(`rules`);
  let universalRules = await response.json();
  if(universalRules.rules && universalRules.rules.length) {
    universalRules = universalRules.rules.filter((rule: RuleInterface) => rule.universal);
  }
  return {
    error: handleApiError('Failed to fetch universal rules, please refresh the page.', response),
    universalRules: universalRules
  };
}

export const fetchRule = async (key: string, ruleId: string) => {
  const response = await apiFetch(`rules/${ruleId}`);
  const rule = await response.json();
  return {
    error: handleApiError('Failed to fetch rule, please refresh the page.', response),
    rule
  };
}

export const deleteRule = async (ruleId: string) => {
  const response = await apiFetch(`rules/${ruleId}`, {
    method: 'DELETE'
  });
  return { error: handleApiError('Failed to delete rule, please try again.', response)};
}

export const createRule = async (rule: RuleInterface) => {
  const response = await apiFetch(`rules`, {
    method: 'POST',
    body: JSON.stringify({ rule })
  });
  const newRule = await response.json();
  return { error: handleApiError('Failed to create rule, please try again.', response), rule: newRule };
}

export const updateRule = async (ruleId: number, rule: RuleInterface) => {
  const response = await apiFetch(`rules/${ruleId}`, {
    method: 'PUT',
    body: JSON.stringify({ rule })
  });
  return { error: handleApiError('Failed to update rule, please try again.', response) };
}
