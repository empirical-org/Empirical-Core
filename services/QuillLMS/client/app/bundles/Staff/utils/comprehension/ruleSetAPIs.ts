import { ActivityRuleSetInterface, RegexRuleInterface } from '../../interfaces/comprehensionInterfaces';
import { handleApiError } from '../../helpers/comprehension'

export const fetchRuleSets = async (key: string, activityId: string) => {
  let rulesets: ActivityRuleSetInterface[];
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets.json/`);
  rulesets = await response.json();
  return { 
    error: handleApiError('Failed to fetch rule sets, please refresh the page.', response), 
    rulesets 
  };
}

export const fetchRuleSet = async (key: string, activityId: string, ruleSetId: string) => {
  let ruleset: ActivityRuleSetInterface;
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}.json/`);
  ruleset = await response.json();
  return { 
    error: handleApiError('Failed to fetch rule set, please refresh the page.', response), 
    ruleset 
  };
}

export const createRuleSet = async (activityId: string, ruleSet: ActivityRuleSetInterface) => {
  const { rules } = ruleSet;
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets.json/`, {
    method: 'POST',
    body: JSON.stringify(ruleSet),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  const newRuleSet = await response.json();
  return { 
    error: handleApiError('Failed to create rule set, please try again.', response), 
    rules,
    ruleSetId: newRuleSet && newRuleSet.id
  };
}

export const updateRuleSet = async (activityId: string, ruleSetId: string, ruleSet: ActivityRuleSetInterface) => {
  const { rules } = ruleSet;
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}.json/`, {
    method: 'PUT',
    body: JSON.stringify(ruleSet),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  const updatedRuleSet = await response.json();
  let mergedRules: object[];
  if(updatedRuleSet) {
    mergedRules = updatedRuleSet.rules;
    rules.forEach(rule => {
      // add rules without IDs for rule creation
      !rule.id && mergedRules.push(rule);
    });
  }
  return { 
    error: handleApiError('Failed to update rule set, please try again.', response), 
    rules: updatedRuleSet && mergedRules,
    ruleSetId: updatedRuleSet && updatedRuleSet.id
  };
}

export const deleteRuleSet = async (activityId: string, ruleSetId: string) => {
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}.json`, {
    method: 'DELETE'
  });
  return { error: handleApiError('Failed to delete rule set, please try again.', response)};
}

export const createRule = async (activityId: string, rule: RegexRuleInterface, ruleSetId: string) => {
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}/rules.json/`, {
    method: 'POST',
    body: JSON.stringify(rule),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  return { error: handleApiError('Failed to create rule, please try again.', response) };
}

export const updateRule = async (activityId: string, rule: RegexRuleInterface, ruleSetId: string, ruleId: number) => {
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}/rules/${ruleId}.json/`, {
    method: 'PUT',
    body: JSON.stringify({
      regex_text: rule.regex_text,
      case_sensitive: rule.case_sensitive
    }),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  return { error: handleApiError('Failed to update rule, please try again.', response) };
}

export const deleteRule = async (activityId: string, ruleSetId: string, ruleId: number) => {
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}/rules/${ruleId}.json`, {
    method: 'DELETE'
  });
  return { error: handleApiError('Failed to delete rule, please try again.', response) };
}
