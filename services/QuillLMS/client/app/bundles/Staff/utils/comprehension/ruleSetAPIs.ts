import { ActivityRuleInterface, RegexRuleInterface } from '../../interfaces/comprehensionInterfaces';
import { handleApiError, apiFetch } from '../../helpers/comprehension';

export const fetchRules = async (key: string, activityId: string) => {
  const response = await apiFetch(`activities/${activityId}/rules`);
  const rules = await response.json();
  // rulesets.forEach((ruleset) => { ruleset.rules = ruleset.regex_rules });
  return {
    error: handleApiError('Failed to fetch rules, please refresh the page.', response),
    rules: rules
  };
}

export const fetchRuleSets = async (key: string, activityId: string) => {
  const response = await apiFetch(`activities/${activityId}/rule_sets`);
  const rulesets = await response.json();
  rulesets.forEach((ruleset) => { ruleset.rules = ruleset.regex_rules });
  return {
    error: handleApiError('Failed to fetch rule sets, please refresh the page.', response),
    rulesets: rulesets.rule_sets || rulesets
  };
}

export const fetchRuleSet = async (key: string, activityId: string, ruleSetId: string) => {
  let ruleset: ActivityRuleInterface;
  const response = await apiFetch(`activities/${activityId}/rule_sets/${ruleSetId}`);
  ruleset = await response.json();
  ruleset.rules = ruleset.regex_rules;
  return {
    error: handleApiError('Failed to fetch rule set, please refresh the page.', response),
    ruleset
  };
}

export const fetchRule = async (key: string, ruleSetId: string) => {
  const response = await apiFetch(`rules/${ruleSetId}`);
  const rule = await response.json();
  return {
    error: handleApiError('Failed to fetch rule, please refresh the page.', response),
    rule
  };
}

export const deleteRule = async (ruleSetId: string) => {
  const response = await apiFetch(`rules/${ruleSetId}`, {
    method: 'DELETE'
  });
  return { error: handleApiError('Failed to delete rule, please try again.', response)};
}

export const createRule = async (rule: RegexRuleInterface, ruleSetId: string) => {
  const response = await apiFetch(`rule_sets/${ruleSetId}/regex_rules`, {
    method: 'POST',
    body: JSON.stringify(rule)
  });
  return { error: handleApiError('Failed to create rule, please try again.', response) };
}

export const updateRule = async (ruleId: number, rule: ActivityRuleInterface) => {
  const response = await apiFetch(`rules/${ruleId}`, {
    method: 'PUT',
    body: JSON.stringify({ rule })
  });
  return { error: handleApiError('Failed to update rule, please try again.', response) };
}
