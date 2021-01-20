import { ActivityRuleSetInterface, RegexRuleInterface } from '../../interfaces/comprehensionInterfaces';
import { handleApiError, apiFetch } from '../../helpers/comprehension';

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
  let ruleset: ActivityRuleSetInterface;
  const response = await apiFetch(`activities/${activityId}/rule_sets/${ruleSetId}`);
  ruleset = await response.json();
  ruleset.rules = ruleset.regex_rules;
  return { 
    error: handleApiError('Failed to fetch rule set, please refresh the page.', response), 
    ruleset 
  };
}

export const createRuleSet = async (activityId: string, ruleSet: { rule_set: ActivityRuleSetInterface }) => {
  const { rule_set } = ruleSet;
  const { rules } = rule_set;
  ruleSet.regex_rules = rules;
  const response = await apiFetch(`activities/${activityId}/rule_sets`, {
    method: 'POST',
    body: JSON.stringify(ruleSet)
  });
  const newRuleSet = await response.json();
  return { 
    error: handleApiError('Failed to create rule set, please try again.', response), 
    rules,
    ruleSetId: newRuleSet && newRuleSet.id
  };
}

export const updateRuleSet = async (activityId: string, ruleSetId: string, ruleSet: { rule_set: ActivityRuleSetInterface }) => {
  const { rule_set } = ruleSet;
  const { rules_attributes } = rule_set;
  ruleSet.regex_rules_attributes = rules_attributes;

  const secondResponse = await apiFetch(`activities/${activityId}/rule_sets/${ruleSetId}`, {
    method: 'PUT',
    body: JSON.stringify(ruleSet)
  });
  const updatedRuleSet = await secondResponse.json();

  let mergedRules: object[];
  if(updatedRuleSet) {
    mergedRules = updatedRuleSet.regex_rules;
    rules_attributes.forEach(rule => {
      // add rules without IDs for rule creation
      !rule.id && mergedRules.push(rule);
    });
  }
  return { 
    error: handleApiError('Failed to update rule set, please try again.', secondResponse), 
    rules: updatedRuleSet && mergedRules,
    ruleSetId: updatedRuleSet && updatedRuleSet.id
  };
}

export const deleteRuleSet = async (activityId: string, ruleSetId: string) => {
  const response = await apiFetch(`activities/${activityId}/rule_sets/${ruleSetId}`, {
    method: 'DELETE'
  });
  return { error: handleApiError('Failed to delete rule set, please try again.', response)};
}

export const createRule = async (rule: RegexRuleInterface, ruleSetId: string) => {
  const response = await apiFetch(`rule_sets/${ruleSetId}/regex_rules`, {
    method: 'POST',
    body: JSON.stringify(rule)
  });
  return { error: handleApiError('Failed to create rule, please try again.', response) };
}

export const updateRule = async (rule: RegexRuleInterface, ruleSetId: string, ruleId: number) => {
  const response = await apiFetch(`rule_sets/${ruleSetId}/regex_rules/${ruleId}`, {
    method: 'PUT',
    body: JSON.stringify({
      regex_text: rule.regex_text,
      case_sensitive: rule.case_sensitive
    })
  });
  return { error: handleApiError('Failed to update rule, please try again.', response) };
}

export const deleteRule = async (ruleSetId: string, ruleId: number) => {
  const response = await apiFetch(`rule_sets/${ruleSetId}/regex_rules/${ruleId}`, {
    method: 'DELETE'
  });
  return { error: handleApiError('Failed to delete rule, please try again.', response) };
}
