import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import RegexRules from './regexRules';

import {
  handleSetRegexRule,
  handleSetRegexRuleSequence,
  handleAddRegexInput,
  handleDeleteRegexRule,
  handleSetFeedback,
  renderHighlights
} from '../../../helpers/comprehension/ruleHelpers';
import { TextEditor } from '../../../../Shared/index'
import { HIGHLIGHT_ADDITION, HIGHLIGHT_REMOVAL, FEEDBACK, } from '../../../../../constants/comprehension';
import { InputEvent, ClickEvent, DropdownObjectInterface } from '../../../interfaces/comprehensionInterfaces';

// TODO: add props interface

const RuleRegexAttributes = ({
  errors,
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
    const { target } = e;
    const { value } = (target as HTMLButtonElement);
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      handleSetFeedback({
        text: '',
        feedback: regexFeedback,
        setFeedback: setRegexFeedback,
        updateType: HIGHLIGHT_REMOVAL,
        feedbackIndex: parseInt(value),
        highlightIndex: null
      });
    }
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
        text={regexFeedback[0].text}
      />}
      {regexFeedback[0] && regexFeedback[0].highlights_attributes && renderHighlights(regexFeedback[0].highlights_attributes, 0, onHandleSetRegexFeedback)}
      {regexFeedback[0] && (<div className="button-wrapper">
        <button className="add-highlight quill-button small primary outlined" onClick={onHandleAddFeedbackHighlight} type="button" value="0">Add Highlight</button>
        {regexFeedback[0].highlights_attributes && regexFeedback[0].highlights_attributes.length ? <button className="remove-highlight quill-button small secondary outlined" onClick={onHandleRemoveFeedbackHighlight} type="button" value="0">Remove Highlight</button> : null}
      </div>)}
      {errors['Regex Feedback'] && <p className="error-message">{errors['Regex Feedback']}</p>}
      <p className="form-subsection-label" id="regex-rules-label">Regex Rules</p>
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
