import { ActivityRuleSetInterface } from '../../interfaces/comprehensionInterfaces';

export const fetchRuleSets = async (activityId: string) => {
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

export const fetchRuleSet = async (activityId: string, ruleSetId: string) => {
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
