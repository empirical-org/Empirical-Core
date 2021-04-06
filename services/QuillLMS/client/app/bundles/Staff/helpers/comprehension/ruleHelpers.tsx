import * as React from "react";
import { EditorState, ContentState } from 'draft-js';
import stripHtml from "string-strip-html";

import { validateForm } from '../comprehension';
import { AUTO_ML, ACTIVE, INACTIVE } from '../../../../constants/comprehension';
import { InputEvent, DropdownObjectInterface } from '../../interfaces/comprehensionInterfaces';
import { ruleTypeOptions, universalRuleTypeOptions, ruleHighlightOptions, numericalWordOptions, regexRuleSequenceOptions, regexRuleTypes } from '../../../../constants/comprehension';
import { TextEditor, DropdownInput } from '../../../Shared/index';

export function handleSetRuleType(ruleType: DropdownObjectInterface, setRuleType) { setRuleType(ruleType) };

export function handleSetRuleName(e: InputEvent, setRuleName) { setRuleName(e.target.value) };

export function handleSetRuleLabelName(e: InputEvent, setRuleLabelName) { setRuleLabelName(e.target.value) };

export function handleSetRuleOptimal(ruleOptimal: DropdownObjectInterface, setRuleOptimal) { setRuleOptimal(ruleOptimal) };

export function handleSetRuleConceptUID(value, setRuleConceptUID) { setRuleConceptUID(value) };

export function handleSetRuleDescription(text: string, setRuleDescription) { setRuleDescription(text) }

export function handleSetPlagiarismText(text: string, plagiarismText, setPlagiarismText) {
  const plagiarismTextObject = {...plagiarismText};
  plagiarismTextObject.text = text;
  setPlagiarismText(plagiarismTextObject)
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

export function handleSetRegexRuleSequence({ option, ruleKey, regexRules, setRegexRules }) {
  const updatedRules = {...regexRules};
  updatedRules[ruleKey].sequence_type = option;
  setRegexRules(updatedRules);
}

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

export const getSequenceType = (sequenceType) => {
  if(sequenceType) {
    return regexRuleSequenceOptions.filter(option => option.value === sequenceType)[0];
  }
  return null;
}

export const formatRegexRules = ({ rule, setRegexRules }) => {
  let formatted = {};
  rule && rule.regex_rules && rule.regex_rules.map((rule, i) => {
    const { case_sensitive, id, regex_text, sequence_type } = rule;
    const regexRuleSequenceType = getSequenceType(sequence_type);
    const formattedRule = {
      id: id,
      case_sensitive: case_sensitive,
      regex_text: regex_text,
      sequence_type: regexRuleSequenceType
    }
    formatted[`regex-rule-${i}`] = formattedRule;
  });
  setRegexRules(formatted);
}

export function handleSetFeedback({
    text,
    feedback,
    setFeedback,
    updateType,
    feedbackIndex,
    highlightIndex
}) {
  const updatedFeedback = [...feedback];
  if(updateType === 'feedback') {
    updatedFeedback[feedbackIndex].text = text;
    setFeedback(updatedFeedback);
  } else if(updateType === 'highlight text') {
    updatedFeedback[feedbackIndex].highlights_attributes[highlightIndex].text = text;
    setFeedback(updatedFeedback);
  } else if(updateType === 'highlight addition') {
    updatedFeedback[feedbackIndex].highlights_attributes.push({ text: '' });
  } else if(updateType === 'highlight type') {
    updatedFeedback[feedbackIndex].highlights_attributes[highlightIndex].highlight_type = text
  } else if(updateType === 'feedback layer addition') {
    updatedFeedback.push({
      text: '',
      order: feedback.length,
      highlights_attributes: []
    });
  }
  setFeedback(updatedFeedback);
}

export function renderHighlights(highlights, i, changeHandler) {
  return highlights.map((highlight, j) => {
    let highlightTypeValue = ruleHighlightOptions[0];
    // this is an update for existing rule, convert to object for DropdownInput value
    if(highlight.highlight_type && typeof highlight.highlight_type === 'string') {
      const { highlight_type } = highlight;
      const label = highlight_type[0].toUpperCase() + highlight_type.slice(1).toLowerCase();
      highlightTypeValue = { label: label, value: highlight_type };
    } else if(highlight.highlight_type && highlight.highlight_type.value) {
      const { highlight_type } = highlight;
      highlightTypeValue = highlight_type;
    }
    return(
      <section className="rule-highlight-section" key={j}>
        <p className="form-subsection-label">{`${numericalWordOptions[i]} Revision - ${numericalWordOptions[j]} Highlight`}</p>
        <DropdownInput
          className='rule-type-input'
          // eslint-disable-next-line
          handleChange={(e) => changeHandler(e, i, j, 'highlight type')}
          isSearchable={true}
          label="Highlight Type"
          options={ruleHighlightOptions}
          value={highlightTypeValue}
        />
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          // eslint-disable-next-line
          handleTextChange={(text) => changeHandler(text, i, j, 'highlight text')}
          key="universal-feedback-highlight"
          text={highlight.text}
        />
      </section>
    );
  });
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

export const returnInitialFeedback = (ruleType: string) => {
  if(ruleType === 'plagiarism') {
    return [{ text: '', order: 0, highlights_attributes: [] }, { text: '', order: 1, highlights_attributes: [] }];
  }
  return [{ text: '', order: 0, highlights_attributes: [] }];
}

export const formatInitialFeedbacks = (feedbacks) => {
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

const buildFeedbacks = (feedbacks) => {
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

export const buildRule = ({
  plagiarismText,
  regexRules,
  rule,
  rulesCount,
  ruleConceptUID,
  ruleDescription,
  ruleName,
  ruleLabelName,
  ruleOptimal,
  rulePrompts,
  rulePromptIds,
  ruleType,
  ruleFeedbacks,
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
    feedbacks_attributes: buildFeedbacks(ruleFeedbacks),
    name: ruleName,
    optimal: !!ruleOptimal.value,
    prompt_ids: promptIds,
    rule_type: ruleType.value,
    suborder: suborder ? suborder : order,
    universal: universal,
    state: ruleType.value === AUTO_ML ? INACTIVE : ACTIVE
  };

  if(regexRuleTypes.includes(newOrUpdatedRule.rule_type)) {
    let rules = [];
    Object.keys(regexRules).forEach(key => {
      rules.push(regexRules[key]);
    });
    // format from DropdownInput option
    rules = rules.map(rule => {
      // choose default Incorrect option for case where user doesn't change dropdown option
      rule.sequence_type = rule.sequence_type && rule.sequence_type.value ? rule.sequence_type.value : regexRuleSequenceOptions[0].value;
      return rule;
    });
    newOrUpdatedRule.regex_rules_attributes = rules;
  } else if(newOrUpdatedRule.rule_type === 'plagiarism') {
    newOrUpdatedRule.plagiarism_text_attributes = {
      id: plagiarismText.id,
      text: stripHtml(plagiarismText.text)
    };
  } else if(newOrUpdatedRule.rule_type === AUTO_ML) {
    newOrUpdatedRule.label_attributes = {
      name: ruleLabelName
    };
    newOrUpdatedRule.prompt_ids = rulePromptIds;
  }
  return {
    rule: newOrUpdatedRule
  };
}

export async function handleSubmitRule({
  plagiarismText,
  regexRules,
  rule,
  ruleName,
  ruleId,
  ruleLabelName,
  ruleConceptUID,
  ruleDescription,
  ruleOptimal,
  rulePrompts,
  rulePromptIds,
  rulesCount,
  ruleType,
  setErrors,
  submitRule,
  ruleFeedbacks,
  universalRulesCount
}) {
  const newOrUpdatedRule = buildRule({
    plagiarismText,
    regexRules,
    rule,
    ruleName,
    ruleLabelName,
    ruleConceptUID,
    ruleDescription,
    ruleOptimal,
    rulePrompts,
    rulePromptIds,
    rulesCount,
    ruleType,
    ruleFeedbacks,
    universalRulesCount
  });
  const { universal } = rule;
  let keys: string[] = ['Name', 'Concept UID'];
  let state: any[] = [ruleName, ruleConceptUID];
  if(regexRuleTypes.includes(ruleType.value)) {
    keys.push('Regex Feedback');
    state.push(ruleFeedbacks[0].text);
    Object.keys(regexRules).map((key, i) => {
      keys.push(`Regex rule ${i + 1}`);
      state.push(regexRules[key].regex_text);
    });
  } else if(ruleType.value === 'plagiarism') {
    keys = keys.concat(['Plagiarism Text', 'First Plagiarism Feedback', 'Second Plagiarism Feedback']);
    state = state.concat([plagiarismText.text, ruleFeedbacks[0].text, ruleFeedbacks[1].text]);
  } else if(ruleType.value === AUTO_ML) {
    keys.push('Label Name');
    state.push(ruleLabelName);
  }
  if(!universal && ruleType.value !== AUTO_ML) {
    keys.push('Stem Applied');
    state.push(rulePrompts);
  }
  const validationErrors = validateForm(keys, state);
  if(validationErrors && Object.keys(validationErrors).length) {
    setErrors(validationErrors);
  } else {
    setErrors({});
    submitRule(newOrUpdatedRule, ruleId);
  }
}

export function getRulesUrl(activityId: string, promptId: string, ruleType: string) {
  let url = `activities/${activityId}/rules`;
  if(promptId && !ruleType) {
    url = `rules?prompt_id=${promptId}`
  } else if(!promptId && ruleType) {
    url = `rules?rule_type=${ruleType}`
  } else if(promptId && ruleType) {
    url = `rules?prompt_id=${promptId}&rule_type=${ruleType}`
  }
  return url;
}

export function renderErrorsContainer(formErrorsPresent: boolean, requestErrors: string[]) {
  if(formErrorsPresent) {
    return(
      <div className="error-message-container">
        <p className="all-errors-message">Please check that all fields have been completed correctly.</p>
      </div>
    );
  }
  return(
    <div className="error-message-container">
      {requestErrors.map((error, i) => {
        return <p className="all-errors-message" key={i}>{error}</p>
      })}
    </div>
  )
}
