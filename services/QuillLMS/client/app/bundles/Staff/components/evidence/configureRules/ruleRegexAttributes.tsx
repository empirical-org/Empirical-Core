import { ContentState, EditorState } from 'draft-js';
import * as React from "react";

import RegexRules from './regexRules';

import { FEEDBACK, HIGHLIGHT_ADDITION, HIGHLIGHT_REMOVAL } from '../../../../../constants/evidence';
import { TextEditor } from '../../../../Shared/index';
import {
  handleAddRegexInput,
  handleDeleteRegexRule,
  handleSetFeedback, handleSetRegexRule,
  handleSetRegexRuleSequence, renderHighlights
} from '../../../helpers/evidence/ruleHelpers';
import { ClickEvent, DropdownObjectInterface, InputEvent } from '../../../interfaces/evidenceInterfaces';

// TODO: add props interface

const RuleRegexAttributes = ({
  errors,
  ruleConditional,
  regexFeedback,
  regexRules,
  rulesToUpdate,
  rulesToCreate,
  rulesToDelete,
  setRulesToDelete,
  setRegexRules,
  setRulesToUpdate,
  setRulesToCreate,
  setRegexFeedback,
  setRuleConditional
}) => {

  function onHandleSetRegexRule(e: InputEvent) {
    handleSetRegexRule({
      e,
      regexRules,
      rulesToUpdate,
      rulesToCreate,
      setRegexRules,
      setRulesToUpdate,
      setRulesToCreate})
  }

  function onHandleSetRegexRuleSequence(option: DropdownObjectInterface, ruleKey) {
    handleSetRegexRuleSequence({ option, ruleKey, regexRules, setRegexRules });
  }

  function onHandleAddRegexInput() { handleAddRegexInput(regexRules, setRegexRules) }

  function onHandleDeleteRegexRule(e) { handleDeleteRegexRule({ e, regexRules, rulesToDelete, setRulesToDelete, setRegexRules}) }

  function onHandleSetRegexFeedback(text: string, i: number, j: number, updateType:  string) {
    handleSetFeedback({
      text,
      feedback: regexFeedback,
      setFeedback: setRegexFeedback,
      updateType: updateType,
      feedbackIndex: i,
      highlightIndex: j
    });
  }

  function onHandleAddFeedbackHighlight(e: ClickEvent) {
    const { target } = e;
    const { value } = (target as HTMLButtonElement);
    handleSetFeedback({
      text: '',
      feedback: regexFeedback,
      setFeedback: setRegexFeedback,
      updateType: HIGHLIGHT_ADDITION,
      feedbackIndex: parseInt(value),
      highlightIndex: null
    });
  }

  function onHandleRemoveFeedbackHighlight(e: ClickEvent) {
    const highlightIndex = regexFeedback[0].highlights_attributes.filter(h => !h._destroy).length - 1
    const { target } = e;
    const { value } = (target as HTMLButtonElement);
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      handleSetFeedback({
        text: '',
        feedback: regexFeedback,
        setFeedback: setRegexFeedback,
        updateType: HIGHLIGHT_REMOVAL,
        feedbackIndex: parseInt(value),
        highlightIndex: highlightIndex
      });
    }
  }

  function onHandleToggleConditional() {
    setRuleConditional(!ruleConditional)
  }

  // TODO: break out Regex feedback into separate component

  return(
    <React.Fragment>
      <p className="form-subsection-label">Feedback</p>
      {regexFeedback[0] && <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        // eslint-disable-next-line
        handleTextChange={(text) => onHandleSetRegexFeedback(text, 0, null, FEEDBACK)}
        key="regex-feedback"
        shouldCheckSpelling={true}
        text={regexFeedback[0].text}
      />}
      {regexFeedback[0] && regexFeedback[0].highlights_attributes && renderHighlights(regexFeedback[0].highlights_attributes, 0, onHandleSetRegexFeedback)}
      {regexFeedback[0] && (<div className="button-wrapper">
        <button className="add-highlight quill-button small primary outlined" onClick={onHandleAddFeedbackHighlight} type="button" value="0">Add Highlight</button>
        {regexFeedback[0].highlights_attributes && regexFeedback[0].highlights_attributes.filter(h => !h._destroy) && regexFeedback[0].highlights_attributes.filter(h => !h._destroy).length ? <button className="remove-highlight quill-button small secondary outlined" onClick={onHandleRemoveFeedbackHighlight} type="button" value="0">Remove Highlight</button> : null}
      </div>)}
      {errors['Regex Feedback'] && <p className="error-message">{errors['Regex Feedback']}</p>}
      <label aria-label="conditional-sequence-label" className="conditional-label" htmlFor="conditional-label">
        Conditional Sequences?
      </label>
      <input
        aria-label="conditional-checkbox"
        checked={ruleConditional}
        id="conditional-checkbox"
        onChange={onHandleToggleConditional}
        type="checkbox"
        value="conditional-checkbox"
      />
      <p className="form-subsection-label" id="regex-rules-label">Sequences</p>
      <RegexRules
        errors={errors}
        handleAddRegexInput={onHandleAddRegexInput}
        handleDeleteRegexRule={onHandleDeleteRegexRule}
        handleSetRegexRule={onHandleSetRegexRule}
        handleSetRegexRuleSequence={onHandleSetRegexRuleSequence}
        regexRules={regexRules}
      />
    </React.Fragment>
  );
};

export default RuleRegexAttributes;
