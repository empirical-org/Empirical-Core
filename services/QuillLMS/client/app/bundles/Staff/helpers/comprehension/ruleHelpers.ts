type InputEvent = React.ChangeEvent<HTMLInputElement>;

export function handleSetRuleType(ruleType: { value: string, label: string }, setRuleType) { setRuleType(ruleType) };

export function handleSetRuleName(e: InputEvent, setRuleName) { setRuleName(e.target.value) };

export function handleSetRuleOptimal(ruleOptimal: { value: boolean, label: string }, setRuleOptimal) { setRuleOptimal(ruleOptimal) };

export function handleSetRuleConceptUID(e: InputEvent, setRuleConceptUID) { setRuleConceptUID(e.target.value) };

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
