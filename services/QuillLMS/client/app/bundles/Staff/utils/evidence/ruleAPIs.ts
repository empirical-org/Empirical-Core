import { apiFetch, handleApiError, handleRequestErrors, requestFailed } from '../../helpers/evidence/routingHelpers';
import { getRulesUrl } from '../../helpers/evidence/ruleHelpers';
import { RuleInterface } from '../../interfaces/evidenceInterfaces';

export const fetchRules = async ({ queryKey }) => {
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

export const fetchUniversalRules = async () => {
  const response = await apiFetch(`rules/universal`);
  let universalRules = await response.json();
  if(universalRules.rules && universalRules.rules.length) {
    universalRules = universalRules.rules.filter((rule: RuleInterface) => rule.universal);
  }
  return {
    error: handleApiError('Failed to fetch universal rules, please refresh the page.', response),
    universalRules: universalRules
  };
}

export const fetchRule = async ({ queryKey, }) => {
  const [key, ruleId]: [string, string] = queryKey

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
    const errors = await response.json();
    const returnedErrors = await handleRequestErrors(errors);
    return { errors: returnedErrors };
  }
  return { errors: [] };
}

export const createRule = async (rule: RuleInterface) => {
  const response = await apiFetch(`rules`, {
    method: 'POST',
    body: JSON.stringify({ rule })
  });
  const { status } = response;
  const newRuleOrErrors = await response.json();

  if(requestFailed(status)) {
    const returnedErrors = await handleRequestErrors(newRuleOrErrors);
    return { errors: returnedErrors, rule: null };
  }
  return { errors: [], rule: newRuleOrErrors };
}

export const updateRule = async (ruleId: number, rule: RuleInterface) => {
  const response = await apiFetch(`rules/${ruleId}`, {
    method: 'PUT',
    body: JSON.stringify({ rule })
  });

  const { status } = response;

  if(requestFailed(status)) {
    const errors = await response.json();
    const returnedErrors = await handleRequestErrors(errors);
    return { errors: returnedErrors };
  }
  return { errors: [] };
}

export const updateRuleOrders = async (orderedRuleIds: number[]) => {
  const response = await apiFetch(`rules/update_rule_order`, {
    method: 'PUT',
    body: JSON.stringify({ ordered_rule_ids: orderedRuleIds, })
  });
  const { status } = response;

  if(requestFailed(status)) {
    const errors = await response.json();
    const returnedErrors = await handleRequestErrors(errors);
    return { errors: returnedErrors };
  }
  return { errors: [] };
}
