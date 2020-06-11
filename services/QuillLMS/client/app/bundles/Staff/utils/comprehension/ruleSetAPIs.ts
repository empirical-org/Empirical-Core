import { ActivityRuleSetInterface, RegexRuleInterface } from '../../interfaces/comprehensionInterfaces';

export const fetchRuleSets = async (key: string, activityId: string) => {
  let rulesets: ActivityRuleSetInterface[];
  let error: any;
  try {
    const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets.json/`);
    rulesets = await response.json();
  } catch (err) {
    error = err;
  }
  return { error, rulesets };
}

export const fetchRuleSet = async (key: string, activityId: string, ruleSetId: string) => {
  let ruleset: ActivityRuleSetInterface;
  let error: any;
  try {
    const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}.json/`);
    ruleset = await response.json();
  } catch (err) {
    error = err;
  }
  return { error, ruleset };
}

export const createRuleSet = async (activityId: string, ruleSet: ActivityRuleSetInterface) => {
  let error: any;
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
  // not a 2xx status
  if(Math.round(response.status / 100) !== 2) {
    error = 'RuleSet creation failed, please try again.';
  }
  return { 
    error, 
    rules,
    ruleSetId: newRuleSet && newRuleSet.id
  };
}

export const updateRuleSet = async (activityId: string, ruleSetId: string, ruleSet: ActivityRuleSetInterface) => {
  let error: any;
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
  // not a 2xx status
  if(Math.round(response.status / 100) !== 2) {
    error = `RuleSet with id ${ruleSetId} failed, please try again.`;
  }
  return { 
    error, 
    rules,
    ruleSetId: updatedRuleSet && updatedRuleSet.id
  };
}

export const deleteRuleSet = async (activityId: string, ruleSetId: string) => {
  let error: any;
  try {
    await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}.json`, {
      method: 'DELETE'
    });
  } catch (err) {
    error = err;
  }
  return { error };
}

export const createRule = async (activityId: string, rule: RegexRuleInterface, ruleSetId: string) => {
  let error: any;
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}/rules.json/`, {
    method: 'POST',
    body: JSON.stringify(rule),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  // not a 2xx status
  if(Math.round(response.status / 100) !== 2) {
    error = 'Rule creation failed, please try again.';
  }
  return { error };
}

export const updateRule = async (activityId: string, rule: RegexRuleInterface, ruleSetId: string, ruleId: number) => {
  let error: any;
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
  // not a 2xx status
  if(Math.round(response.status / 100) !== 2) {
    error = `Rule with id ${ruleId} update failed, please try again.`;
  }
  return { error };
}

export const deleteRule = async (activityId: string, ruleSetId: string, ruleId: number) => {
  let error: any;
  try {
    await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}/rulesets/${ruleSetId}/rules/${ruleId}.json`, {
      method: 'DELETE'
    });
  } catch (err) {
    error = err;
  }
  return { error };
}
