import * as React from "react";
import { EditorState, ContentState } from 'draft-js';
import stripHtml from "string-strip-html";

import { validateForm } from './miscHelpers';
import {
  AUTO_ML,
  PLAGIARISM,
  FEEDBACK,
  HIGHLIGHT_TEXT,
  HIGHLIGHT_ADDITION,
  HIGHLIGHT_REMOVAL,
  HIGHLIGHT_TYPE,
  FEEDBACK_LAYER_ADDITION,
  FEEDBACK_LAYER_REMOVAL,
  RULES_BASED_1,
  RULES_BASED_2,
  RULES_BASED_3
} from '../../../../constants/evidence';
import { InputEvent, DropdownObjectInterface, RuleInterface } from '../../interfaces/evidenceInterfaces';
import { ruleTypeOptions, universalRuleTypeOptions, ruleHighlightOptions, numericalWordOptions, regexRuleSequenceOptions, regexRuleTypes } from '../../../../constants/evidence';
import { TextEditor, DropdownInput, Modal } from '../../../Shared/index';

export function handleSetRuleType(ruleType: DropdownObjectInterface, setRuleType) { setRuleType(ruleType) };

export function handleSetRuleName(e: InputEvent, setRuleName) { setRuleName(e.target.value) };

export function handleSetRuleLabelName(e: InputEvent, setRuleLabelName) { setRuleLabelName(e.target.value) };

export function handleSetRuleOptimal(ruleOptimal: DropdownObjectInterface, setRuleOptimal) { setRuleOptimal(ruleOptimal) };

export function handleSetRuleConceptUID(value, setRuleConceptUID) { setRuleConceptUID(value) };

export function handleSetRuleNote(text: string, setRuleNote) { setRuleNote(text) }

export function handleSetPlagiarismTexts(text: string, index: number, plagiarismTexts, setPlagiarismTexts) {
  const newPlagiarismTexts = [...plagiarismTexts]
  newPlagiarismTexts[index].text = text;
  setPlagiarismTexts(newPlagiarismTexts)
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
  let updatedFeedback = [...feedback];

  switch(updateType) {
    case FEEDBACK:
      updatedFeedback[feedbackIndex].text = text;
      setFeedback(updatedFeedback);
      break
    case HIGHLIGHT_TEXT:
      updatedFeedback[feedbackIndex].highlights_attributes[highlightIndex].text = text;
      setFeedback(updatedFeedback);
      break
    case HIGHLIGHT_ADDITION:
      updatedFeedback[feedbackIndex].highlights_attributes.push({ text: '' });
      break
    case HIGHLIGHT_REMOVAL:
      updatedFeedback[feedbackIndex].highlights_attributes[highlightIndex]._destroy = true
      break
    case HIGHLIGHT_TYPE:
      updatedFeedback[feedbackIndex].highlights_attributes[highlightIndex].highlight_type = text
      break
    case FEEDBACK_LAYER_ADDITION:
      updatedFeedback.push({
        text: '',
        order: feedback.length,
        highlights_attributes: []
      });
      break
    case FEEDBACK_LAYER_REMOVAL:
      updatedFeedback = updatedFeedback.slice(0, -1)
      break
  }
  setFeedback(updatedFeedback);
}

export function renderHighlights(highlights, i, changeHandler) {
  return highlights.map((highlight, j) => {
    if (highlight._destroy) return null;
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
    const passageMismatch = (highlight.highlight_type == 'passage' && !highlight.valid_in_all_targets)
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
          shouldCheckSpelling={true}
          text={highlight.text}
        />
        {passageMismatch && <p className="all-errors-message">The text of this highlight does not match with the associated activity text. This means that it will not highlight the text as intended. Please update the text above.</p>}
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
  if(ruleType === PLAGIARISM) {
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
      const { id, text,  highlight_type, starting_index, valid_in_all_targets } = highlight;
      return {
        id,
        text,
        highlight_type,
        starting_index,
        valid_in_all_targets
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
  plagiarismTexts,
  regexRules,
  rule,
  rulesCount,
  ruleConceptUID,
  ruleNote,
  ruleName,
  ruleLabelName,
  ruleOptimal,
  rulePrompts,
  rulePromptIds,
  ruleType,
  ruleFeedbacks,
  ruleConditional,
  universalRulesCount,
  ruleHint,
}) => {
  const { suborder, universal, state } =  rule;
  const promptIds = [];
  Object.keys(rulePrompts).forEach(key => {
    rulePrompts[key].checked && promptIds.push(rulePrompts[key].id);
  });
  const order = universal ? universalRulesCount : rulesCount;

  let newOrUpdatedRule: any = {
    concept_uid: ruleConceptUID,
    note: ruleNote,
    feedbacks_attributes: buildFeedbacks(ruleFeedbacks),
    name: ruleName,
    optimal: !!ruleOptimal.value,
    prompt_ids: promptIds,
    rule_type: ruleType.value,
    suborder: suborder ? suborder : order,
    universal: universal,
    hint_attributes: ruleHint,
    state
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
      rule.conditional = ruleConditional;
      return rule;
    });
    newOrUpdatedRule.regex_rules_attributes = rules;
  } else if(newOrUpdatedRule.rule_type === PLAGIARISM) {
    const rules = plagiarismTexts.map(plagiarismText => ({
      ...plagiarismText,
      text: stripHtml(plagiarismText.text)
    }))
    newOrUpdatedRule.plagiarism_texts_attributes = rules
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
  plagiarismTexts,
  regexRules,
  rule,
  ruleName,
  ruleId,
  ruleLabelName,
  ruleConceptUID,
  ruleNote,
  ruleOptimal,
  rulePrompts,
  rulePromptIds,
  rulesCount,
  ruleConditional,
  ruleType,
  setErrors,
  submitRule,
  ruleFeedbacks,
  universalRulesCount,
  ruleHint
}) {
  const newOrUpdatedRule = buildRule({
    plagiarismTexts,
    regexRules,
    rule,
    ruleName,
    ruleLabelName,
    ruleConceptUID,
    ruleNote,
    ruleOptimal,
    rulePrompts,
    rulePromptIds,
    rulesCount,
    ruleType,
    ruleFeedbacks,
    universalRulesCount,
    ruleConditional,
    ruleHint
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
  } else if(ruleType.value === PLAGIARISM) {
    plagiarismTexts.map((plagiarismText, i) => {
      keys.push(`Plagiarism Text - Text String ${i + 1}`);
      state.push(plagiarismText.text);
    });
    keys = keys.concat(['First Plagiarism Feedback', 'Second Plagiarism Feedback']);
    state = state.concat([ruleFeedbacks[0].text, ruleFeedbacks[1].text]);
  } else if(ruleType.value === AUTO_ML) {
    keys.push('Label Name');
    state.push(ruleLabelName);
  }
  if(!universal && ruleType.value !== AUTO_ML) {
    keys.push('Stem Applied');
    state.push(rulePrompts);
  }
  const validationErrors = validateForm(keys, state, ruleType.value);
  if(validationErrors && Object.keys(validationErrors).length) {
    setErrors(validationErrors);
  } else {
    setErrors({});
    submitRule(newOrUpdatedRule, ruleId);
  }
}

export function getRulesUrl(activityId: string, promptId: string, ruleType: string) {
  if (activityId) {
    return `activities/${activityId}/rules`
  } else if (!ruleType) {
    throw new Error('A rule type must be specified.')
  } else if(!promptId) {
    return `rules?rule_type=${ruleType}`
  } else {
    return `rules?prompt_id=${promptId}&rule_type=${ruleType}`
  }
}

export function getRulesUrlWithPlagiarismTexts(activityId: string) {
  if (activityId) {
    return `activities/${activityId}/rules_with_plagiarism_texts`
  } else {
    throw new Error('An Activity ID must be specified')
  }
}

export function getReturnLinkRuleType(ruleType) {
  if(!ruleType) {
    return 'rules-index';
  }
  const { value } = ruleType
  if(regexRuleTypes.includes(value)) {
    return 'regex-rules';
  } else if(value === PLAGIARISM) {
    return 'plagiarism-rules';
  }
  return 'rules-index';
}

export function getReturnLinkLabel(ruleType) {
  let label = '← Return to ';
  if(!ruleType) {
    return label + 'Rules Index';
  }
  const { value } = ruleType
  if(regexRuleTypes.includes(value)) {
    return label + 'Regex Rules Index';
  } else if(value === PLAGIARISM) {
    return label + 'Plagiarism Rules Index';
  }
  return label + 'Rules Index';
}

export function getRefetchQueryString(rule: RuleInterface, activityId: string) {
  const { rule_type } = rule;
  switch (rule_type) {
    case RULES_BASED_1:
      return `rules-${activityId}-${RULES_BASED_1}`;
    case RULES_BASED_2:
      return `rules-${activityId}-${RULES_BASED_2}`;
    case RULES_BASED_3:
      return `rules-${activityId}-${RULES_BASED_3}`;
    case PLAGIARISM:
      return `rules-${activityId}-${PLAGIARISM}`;
    case AUTO_ML:
      return `rules-${activityId}-${AUTO_ML}`;
    default:
      return `rules-${activityId}`;
  }
}

export function getPromptIdString(prompts) {
  let promptIdString = '';
  prompts.forEach((prompt, i) => {
    if(i !== prompts.length - 1) {
      promptIdString += `${prompt.id},`
    } else {
      promptIdString += `${prompt.id}`
    }
  });
  return promptIdString;
}

export function renderDeleteRuleModal(handleDeleteRule, toggleShowDeleteRuleModal) {
  return(
    <Modal>
      <div className="delete-rule-container">
        <p className="delete-rule-text">Are you sure that you want to delete this rule?</p>
        <div className="delete-rule-button-container">
          <button className="quill-button fun primary contained" id="delete-rule-button" onClick={handleDeleteRule} type="button">
            Delete
          </button>
          <button className="quill-button fun primary contained" id="close-rule-modal-button" onClick={toggleShowDeleteRuleModal} type="button">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function calculatePercentageForResponses(totalResponsesByRule, totalResponsesByConjunction) {
  if(!totalResponsesByRule || !totalResponsesByConjunction) {
    return null;
  }
  return ((totalResponsesByRule / totalResponsesByConjunction) * 100).toFixed(2);
}

export function getConceptName(conceptsData, conceptUID) {
  if(!conceptsData) { return 'loading...' }
  if(!conceptsData.concepts) { return 'loading...' }

  const { concepts } = conceptsData;
  const concept = concepts.filter(concept => concept.uid === conceptUID)[0];
  if(!concept) { return 'N/A' }
  const splitConcepts = concept.name.split('|');
  const finalConceptString = splitConcepts[splitConcepts.length - 1];
  if(finalConceptString[0] === ' ') {
    return finalConceptString.substring(1);
  }
  return finalConceptString;
}
