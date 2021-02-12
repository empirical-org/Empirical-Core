import { buildRule, validateForm } from '../comprehension';
import { InputEvent, DropdownObjectInterface } from '../../interfaces/comprehensionInterfaces';
import { ruleTypeOptions, universalRuleTypeOptions } from '../../../../constants/comprehension';

export function handleSetRuleType(ruleType: DropdownObjectInterface, setRuleType) { setRuleType(ruleType) };

export function handleSetRuleName(e: InputEvent, setRuleName) { setRuleName(e.target.value) };

export function handleSetRuleOptimal(ruleOptimal: DropdownObjectInterface, setRuleOptimal) { setRuleOptimal(ruleOptimal) };

export function handleSetRuleConceptUID(e: InputEvent, setRuleConceptUID) { setRuleConceptUID(e.target.value) };

export function handleSetRuleDescription(text: string, setRuleDescription) { setRuleDescription(text) }

export function handleSetPlagiarismText(text: string, plagiarismText, setPlagiarismText) {
  const plagiarismTextObject = {...plagiarismText};
  plagiarismTextObject.text = text;
  setPlagiarismText(plagiarismTextObject)
}

export function handleSetFirstPlagiarismFeedback(text: string, firstPlagiarismFeedback, setFirstPlagiarismFeedback) {
  const feedback = {...firstPlagiarismFeedback};
  if(!feedback.order) {
    feedback.order = 0;
  }
  feedback.text = text;
  setFirstPlagiarismFeedback(feedback)
}

export function handleSetSecondPlagiarismFeedback(text: string, secondPlagiarismFeedback, setSecondPlagiarismFeedback) {
  const feedback = {...secondPlagiarismFeedback};
  if(!feedback.order) {
    feedback.order = 1;
  }
  feedback.text = text;
  setSecondPlagiarismFeedback(feedback)
}

export function handleSetRegexFeedback(text: string, regexFeedback, setRegexFeedback) {
  const feedback = {...regexFeedback};
  if(!feedback.order) {
    feedback.order = 0;
  }
  feedback.text = text;
  setRegexFeedback(feedback)
}

export function handleRulePromptChange(e: InputEvent, rulePrompts, setRulePrompts) {
  const { target } = e;
  const { id, value } = target;
  let updatedPrompts = {...rulePrompts};
  const checked = updatedPrompts[value].checked;
  updatedPrompts[value] = {
    id: parseInt(id),
    checked: !checked
  };
  setRulePrompts(updatedPrompts);
};

export function handleSetRegexRule({
  e,
  regexRules,
  rulesToUpdate,
  rulesToCreate,
  setRegexRules,
  setRulesToUpdate,
  setRulesToCreate
}) {
  const { target } = e;
  const { id, type, value } = target;
  let updatedRules = {...regexRules};
  if(type === 'checkbox') {
    updatedRules[value].case_sensitive = !regexRules[value].case_sensitive;
  } else {
    updatedRules[id].regex_text = value;
  }
  const rule = updatedRules[value] || updatedRules[id];
  if(rule.id) {
    const updatedHash = rulesToUpdate;
    updatedHash[rule.id] = rule;
    setRulesToUpdate(updatedHash);
  } else {
    const updatedHash = rulesToCreate;
    updatedHash[rule] = rule;
    setRulesToCreate(updatedHash);
  }
  setRegexRules(updatedRules);
}

export function handleAddRegexInput(regexRules, setRegexRules) {
  let updatedRules = {...regexRules};
  let id = Object.keys(updatedRules).length;
  const newRegexRule = { regex_text: '', case_sensitive: false };
  // increment id so exisiting rules are not overwritten
  while(updatedRules[`regex-rule-${id}`] ) {
    id += 1;
  }
  updatedRules[`regex-rule-${id}`] = newRegexRule;
  setRegexRules(updatedRules);
}

export function handleDeleteRegexRule({ e, regexRules, rulesToDelete, setRulesToDelete, setRegexRules }) {
  const { target } = e;
  const { value } = target;
  let updatedRules = {...regexRules};
  const rule = updatedRules[value]
  // add to regexRulesToDelete array to delete during ruleSet update
  if(rule.id) {
    const updatedHash = rulesToDelete;
    updatedHash[rule.id] = rule;
    setRulesToDelete(updatedHash);
  }
  delete updatedRules[value];
  setRegexRules(updatedRules);
}

export function handleSetUniversalFeedback({
    text,
    universalFeedback,
    setUniversalFeedback,
    updateType,
    feedbackIndex,
    highlightIndex
}) {
  const updatedFeedback = [...universalFeedback];
  if(updateType === 'feedback') {
    updatedFeedback[feedbackIndex].text = text;
    setUniversalFeedback(updatedFeedback);
  } else if(updateType === 'highlight text') {
    updatedFeedback[feedbackIndex].highlights[highlightIndex].text = text;
    setUniversalFeedback(updatedFeedback);
  } else if(updateType === 'highlight addition') {
    updatedFeedback[feedbackIndex].highlights.push({ text: '' });
  }
  setUniversalFeedback(updatedFeedback);
}

export function getInitialRuleType({ isUniversal, rule_type, universalRuleType }) {
  const options = isUniversal ? universalRuleTypeOptions : ruleTypeOptions;
  if(rule_type) {
    return options.filter(ruleType => ruleType.value === rule_type)[0];
  } else if(universalRuleType) {
    return options.filter(ruleType => ruleType.value === universalRuleType)[0];
  } else {
    return options[0];
  }
}

export function handleSubmitRule({
  plagiarismText,
  firstPlagiarismFeedback,
  regexFeedback,
  regexRules,
  rule,
  ruleName,
  ruleConceptUID,
  ruleDescription,
  ruleOptimal,
  rulePrompts,
  rulesCount,
  ruleType,
  secondPlagiarismFeedback,
  setErrors,
  submitRule
}) {
  const newOrUpdatedRule = buildRule({
    plagiarismText,
    firstPlagiarismFeedback,
    regexFeedback,
    regexRules,
    rule,
    ruleName,
    ruleConceptUID,
    ruleDescription,
    ruleOptimal,
    rulePrompts,
    rulesCount,
    ruleType,
    secondPlagiarismFeedback,
  });
  let keys: string[] = ['Name', 'Concept UID'];
  let state: any[] = [ruleName, ruleConceptUID];
  if(ruleType.value === "Regex") {
    keys.push("Regex Feedback");
    state.push(regexFeedback.text)
  } else if(ruleType.value === "Plagiarism") {
    keys = keys.concat(["Plagiarism Text", "First Plagiarism Feedback", "Second Plagiarism Feedback"]);
    state = state.concat([plagiarismText.text, firstPlagiarismFeedback.text, secondPlagiarismFeedback.text]);
  }
  Object.keys(regexRules).map((key, i) => {
    keys.push(`Regex rule ${i + 1}`);
    state.push(regexRules[key].regex_text);
  });
  keys.push('Stem Applied');
  state.push(rulePrompts);
  const validationErrors = validateForm(keys, state);
  if(validationErrors && Object.keys(validationErrors).length) {
    setErrors(validationErrors);
  } else {
    submitRule(newOrUpdatedRule);
  }
}
