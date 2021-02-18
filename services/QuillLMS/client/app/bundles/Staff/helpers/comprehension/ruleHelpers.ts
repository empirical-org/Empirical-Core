import { validateForm } from '../comprehension';
import { InputEvent, DropdownObjectInterface } from '../../interfaces/comprehensionInterfaces';
import { ruleTypeOptions, universalRuleTypeOptions, ruleHighlightOptions } from '../../../../constants/comprehension';

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
    updatedFeedback[feedbackIndex].highlights_attributes[highlightIndex].text = text;
    setUniversalFeedback(updatedFeedback);
  } else if(updateType === 'highlight addition') {
    updatedFeedback[feedbackIndex].highlights_attributes.push({ text: '' });
  } else if(updateType === 'highlight type') {
    updatedFeedback[feedbackIndex].highlights_attributes[highlightIndex].highlight_type = text
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

export const formatFeedbacks = ({ rule, ruleType, setFirstPlagiarismFeedback, setSecondPlagiarismFeedback, setRegexFeedback }) => {
  if(rule && rule.feedbacks && Object.keys(rule.feedbacks).length) {
    const { feedbacks } =  rule;
    if(ruleType && ruleType.value === "Plagiarism") {
      const formattedFirstFeedback = {
        id: feedbacks[0].id,
        order: 0,
        description: feedbacks[0].description,
        text: feedbacks[0].text
      }
      const formattedSecondFeedback = {
        id: feedbacks[1].id,
        order: 1,
        description: feedbacks[1].description,
        text: feedbacks[1].text
      }
      setFirstPlagiarismFeedback(formattedFirstFeedback);
      setSecondPlagiarismFeedback(formattedSecondFeedback);
    }
    else if(ruleType && ruleType.value === "Regex") {
      const formattedFeedback = {
        id: feedbacks[0].id,
        order: 0,
        description: feedbacks[0].description,
        text: feedbacks[0].text
      }
      setRegexFeedback(formattedFeedback);
    }
  } else {
    // creating new rule, set all to empty break tag in case user switches between rule types
    setFirstPlagiarismFeedback({ text: '<br/>'});
    setSecondPlagiarismFeedback({ text: '<br/>'});
    setRegexFeedback({ text: '<br/>'});
  }
}

export const formatInitialUniversalFeedback = (feedbacks) => {
  return feedbacks.map(feedback => {
    const { id, description, order, text, highlights } = feedback;
    const formattedFeedback = {
      id,
      description,
      order,
      text,
      highlights_attributes: null
    };
    const formattedHighlights = highlights && highlights.map(highlight => {
      const { id, text,  highlight_type, starting_index} = highlight;
      return {
        id,
        text,
        highlight_type,
        starting_index
      };
    });
    formattedFeedback.highlights_attributes = formattedHighlights || [];
    return formattedFeedback;
  });
}

const formatUniversalFeedback = (feedbacks) => {
  return feedbacks.map(feedback => {
    const formattedFeedback = {...feedback};
    const formattedHighlights = feedback.highlights_attributes.map(highlight => {
      const { highlight_type } = highlight;
      const formattedHighlight = {...highlight};
      // convert highlight type into string from DropdownInput value type
      if(highlight_type && highlight_type.value) {
        formattedHighlight.highlight_type = highlight_type.value;
      // default option of type Passage was left selected
      } else {
        formattedHighlight.highlight_type = ruleHighlightOptions[0].value;
      }
      // default starting index at 0, future functionality will allow user to have option to change starting index
      formattedHighlight.starting_index = 0;
      return formattedHighlight;
    });
    formattedFeedback.highlights_attributes = formattedHighlights;
    return formattedFeedback;
  });
}

const buildFeedbacks = ({ ruleType, regexFeedback, firstPlagiarismFeedback, secondPlagiarismFeedback, universalFeedback }) => {
  if(ruleType.value === "Regex") {
    return [regexFeedback];
  } else if(ruleType.value === "Plagiarism") {
    return [firstPlagiarismFeedback, secondPlagiarismFeedback];
  } else {
    return formatUniversalFeedback(universalFeedback);
  }
}

export const buildRule = ({
  firstPlagiarismFeedback,
  plagiarismText,
  regexFeedback,
  regexRules,
  rule,
  rulesCount,
  ruleConceptUID,
  ruleDescription,
  ruleName,
  ruleOptimal,
  rulePrompts,
  ruleType,
  secondPlagiarismFeedback,
  universalFeedback,
  universalRulesCount
}) => {
  const { suborder, universal } =  rule;
  const promptIds = [];
  Object.keys(rulePrompts).forEach(key => {
    rulePrompts[key].checked && promptIds.push(rulePrompts[key].id);
  });
  const order = universal ? universalRulesCount : rulesCount;

  let newOrUpdatedRule: any = {
    concept_uid: ruleConceptUID,
    description: ruleDescription,
    feedbacks_attributes: buildFeedbacks({
      ruleType,
      regexFeedback,
      firstPlagiarismFeedback,
      secondPlagiarismFeedback,
      universalFeedback
    }),
    name: ruleName,
    optimal: !!ruleOptimal.value,
    prompt_ids: promptIds,
    rule_type: ruleType.value,
    suborder: suborder ? suborder : order,
    universal: universal
  };

  if(newOrUpdatedRule.rule_type === 'Regex') {
    const rules = [];
    Object.keys(regexRules).forEach(key => {
      rules.push(regexRules[key]);
    });
    newOrUpdatedRule.regex_rules_attributes = rules;
  } else if(newOrUpdatedRule.rule_type === 'Plagiarism') {
    newOrUpdatedRule.plagiarism_text_attributes = {
      id: plagiarismText.id,
      text: plagiarismText.text
    };
  }

  return {
    rule: newOrUpdatedRule
  };
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
  submitRule,
  universalFeedback,
  universalRulesCount
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
    universalFeedback,
    universalRulesCount
  });
  const { universal } = rule;
  let keys: string[] = ['Name', 'Concept UID'];
  let state: any[] = [ruleName, ruleConceptUID];
  if(ruleType.value === "Regex") {
    keys.push("Regex Feedback");
    state.push(regexFeedback.text);
    Object.keys(regexRules).map((key, i) => {
      keys.push(`Regex rule ${i + 1}`);
      state.push(regexRules[key].regex_text);
    });
  } else if(ruleType.value === "Plagiarism") {
    keys = keys.concat(["Plagiarism Text", "First Plagiarism Feedback", "Second Plagiarism Feedback"]);
    state = state.concat([plagiarismText.text, firstPlagiarismFeedback.text, secondPlagiarismFeedback.text]);
  }
  if(!universal) {
    keys.push('Stem Applied');
    state.push(rulePrompts);
  }
  const validationErrors = validateForm(keys, state);
  if(validationErrors && Object.keys(validationErrors).length) {
    setErrors(validationErrors);
  } else {
    submitRule(newOrUpdatedRule);
  }
}
