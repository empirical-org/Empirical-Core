import { ActivityRuleSetInterface, RegexRuleInterface } from '../../interfaces/comprehensionInterfaces';
import { handleApiError } from '../../helpers/comprehension';
const baseUrl = process.env.DEFAULT_URL;

export const fetchRuleSets = async (key: string, activityId: string) => {
  const response = await fetch(`${baseUrl}/api/v1/comprehension/activities/${activityId}/rule_sets.json`);
  const rulesets = await response.json();
  return { 
    error: handleApiError('Failed to fetch rule sets, please refresh the page.', response), 
    rulesets: rulesets.rule_sets || rulesets 
  };
}

export const fetchRuleSet = async (key: string, activityId: string, ruleSetId: string) => {
  let ruleset: ActivityRuleSetInterface;
  const response = await fetch(`${baseUrl}/api/v1/comprehension/activities/${activityId}/rule_sets/${ruleSetId}.json`);
  ruleset = await response.json();
  return { 
    error: handleApiError('Failed to fetch rule set, please refresh the page.', response), 
    ruleset 
  };
}

export const createRuleSet = async (activityId: string, ruleSet: { rule_set: ActivityRuleSetInterface }, csrfToken: string) => {
  const { rule_set } = ruleSet;
  const { rules } = rule_set;
  const response = await fetch(`${baseUrl}/api/v1/comprehension/activities/${activityId}/rule_sets.json`, {
    method: 'POST',
    body: JSON.stringify(ruleSet),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
  });
  const newRuleSet = await response.json();
  return { 
    error: handleApiError('Failed to create rule set, please try again.', response), 
    rules,
    ruleSetId: newRuleSet && newRuleSet.id
  };
}

export const updateRuleSet = async (activityId: string, ruleSetId: string, ruleSet: { rule_set: ActivityRuleSetInterface }, csrfToken: string) => {
  const { rule_set } = ruleSet;
  const { rules_attributes } = rule_set;

  const secondResponse = await fetch(`${baseUrl}/api/v1/comprehension/activities/${activityId}/rule_sets/${ruleSetId}.json`, {
    method: 'PUT',
    body: JSON.stringify(ruleSet),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
  });
  const updatedRuleSet = await secondResponse.json();

  let mergedRules: object[];
  if(updatedRuleSet) {
    mergedRules = updatedRuleSet.rules;
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

export const deleteRuleSet = async (activityId: string, ruleSetId: string, csrfToken: string) => {
  const response = await fetch(`${baseUrl}/api/v1/comprehension/activities/${activityId}/rule_sets/${ruleSetId}.json`, {
    method: 'DELETE',
    headers: {
      "X-CSRF-Token": csrfToken
    }
  });
  return { error: handleApiError('Failed to delete rule set, please try again.', response)};
}

export const createRule = async (rule: RegexRuleInterface, ruleSetId: string, csrfToken: string) => {
  const response = await fetch(`${baseUrl}/api/v1/comprehension/rule_sets/${ruleSetId}/rules.json`, {
    method: 'POST',
    body: JSON.stringify(rule),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
  });
  return { error: handleApiError('Failed to create rule, please try again.', response) };
}

export const updateRule = async (rule: RegexRuleInterface, ruleSetId: string, ruleId: number, csrfToken: string) => {
  const response = await fetch(`${baseUrl}/api/v1/comprehension/rule_sets/${ruleSetId}/rules/${ruleId}.json`, {
    method: 'PUT',
    body: JSON.stringify({
      regex_text: rule.regex_text,
      case_sensitive: rule.case_sensitive
    }),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
  });
  return { error: handleApiError('Failed to update rule, please try again.', response) };
}

export const deleteRule = async (ruleSetId: string, ruleId: number, csrfToken: string) => {
  const response = await fetch(`${baseUrl}/api/v1/comprehension/rule_sets/${ruleSetId}/rules/${ruleId}.json`, {
    method: 'DELETE',
    headers: {
      "X-CSRF-Token": csrfToken
    }
  });
  return { error: handleApiError('Failed to delete rule, please try again.', response) };
}
