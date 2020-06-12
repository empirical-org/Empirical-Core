import { ActivityRuleSetInterface, RegexRuleInterface } from '../../interfaces/comprehensionInterfaces';
import { requestFailed } from '../../../../helpers/comprehension'

export const fetchRuleSets = async (key: string, activityId: string) => {
  let rulesets: ActivityRuleSetInterface[];
  let error: string;
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets.json/`);
  rulesets = await response.json();
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to fetch rule sets, please refresh the page.';
  }
  return { error, rulesets };
}

export const fetchRuleSet = async (key: string, activityId: string, ruleSetId: string) => {
  let ruleset: ActivityRuleSetInterface;
  let error: string;
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}.json/`);
  ruleset = await response.json();
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to fetch rule set, please refresh the page.';
  }
  return { error, ruleset };
}

export const createRuleSet = async (activityId: string, ruleSet: ActivityRuleSetInterface) => {
  let error: string;
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
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to create rule set, please try again.';
  }
  return { 
    error, 
    rules,
    ruleSetId: newRuleSet && newRuleSet.id
  };
}

export const updateRuleSet = async (activityId: string, ruleSetId: string, ruleSet: ActivityRuleSetInterface) => {
  let error: string;
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
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to update rule set, please try again.';
  }
  const mergedRules = updatedRuleSet.rules;
  rules.forEach(rule => {
    // add rules without IDs for rule creation
    !rule.id && mergedRules.push(rule);
  });
  return { 
    error, 
    rules: mergedRules,
    ruleSetId: updatedRuleSet.id
  };
}

export const deleteRuleSet = async (activityId: string, ruleSetId: string) => {
  let error: string;
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}.json`, {
    method: 'DELETE'
  });
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to delete rule set, please try again.';
  }
  return { error };
}

export const createRule = async (activityId: string, rule: RegexRuleInterface, ruleSetId: string) => {
  let error: string;
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}/rules.json/`, {
    method: 'POST',
    body: JSON.stringify(rule),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to create rule, please try again.';
  }
  return { error };
}

export const updateRule = async (activityId: string, rule: RegexRuleInterface, ruleSetId: string, ruleId: number) => {
  let error: string;
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
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to update rule, please try again.';
  }
  return { error };
}

export const deleteRule = async (activityId: string, ruleSetId: string, ruleId: number) => {
  let error: string;
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}/rules/${ruleId}.json`, {
    method: 'DELETE'
  });
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to delete rule, please try again.';
  }
  return { error };
}
