import { RuleInterface } from '../../interfaces/comprehensionInterfaces';
import { handleApiError, apiFetch, handleRequestError, requestFailed } from '../../helpers/comprehension';
import { getRulesUrl } from '../../helpers/comprehension/ruleHelpers';

export const fetchRules = async (key: string, activityId: string, promptId?: any, ruleType?: string) => {
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
  const { status } = response;

  if(requestFailed(status)) {
    const ruleToDelete = await response.json();
    const { errors } = ruleToDelete;
    const returnedErrors = await handleRequestError(errors, response);
    return { errors: returnedErrors };
  }
  return { errors: [] };
}

export const createRule = async (rule: RuleInterface) => {
  const response = await apiFetch(`rules`, {
    method: 'POST',
    body: JSON.stringify({ rule })
  });
  const newRule = await response.json();
  const { errors } = newRule;
  const returnedErrors = await handleRequestError(errors, response);
  return { errors: returnedErrors, rule: newRule };
}

export const updateRule = async (ruleId: number, rule: RuleInterface) => {
  const response = await apiFetch(`rules/${ruleId}`, {
    method: 'PUT',
    body: JSON.stringify({ rule })
  });
  const { status } = response;

  if(requestFailed(status)) {
    const updatedRule = await response.json();
    const { errors } = updatedRule;
    const returnedErrors = await handleRequestError(errors, response);
    return { errors: returnedErrors };
  }
  return { errors: [] };
}
