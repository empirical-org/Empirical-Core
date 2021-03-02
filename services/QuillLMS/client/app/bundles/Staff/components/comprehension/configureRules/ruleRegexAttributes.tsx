import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import RegexRules from './regexRules';

import {
  handleSetRegexRule,
  handleAddRegexInput,
  handleDeleteRegexRule,
  handleSetFeedback,
  renderHighlights
} from '../../../helpers/comprehension/ruleHelpers';
import { TextEditor } from '../../../../Shared/index'
import { InputEvent, ClickEvent } from '../../../interfaces/comprehensionInterfaces';

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
    const { id } = (target as HTMLButtonElement);
    handleSetFeedback({
      text: '',
      feedback: regexFeedback,
      setFeedback: setRegexFeedback,
      updateType: 'highlight addition',
      feedbackIndex: parseInt(id),
      highlightIndex: null
    });
  }

  return(
    <React.Fragment>
      <p className="form-subsection-label">Feedback</p>
      {regexFeedback[0] && <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        // eslint-disable-next-line
        handleTextChange={(text) => onHandleSetRegexFeedback(text, 0, null, 'feedback')}
        key="regex-feedback"
        text={regexFeedback[0].text}
      />}
      {regexFeedback[0] && regexFeedback[0].highlights_attributes && renderHighlights(regexFeedback[0].highlights_attributes, 0, onHandleSetRegexFeedback)}
      {regexFeedback[0] && <button className="add-highlight quill-button small primary outlined" id="0" onClick={onHandleAddFeedbackHighlight} type="button">Add Highlight</button>}
      {errors['Regex Feedback'] && <p className="error-message">{errors['Regex Feedback']}</p>}
      <p className="form-subsection-label" id="regex-rules-label">Regex Rules</p>
      <RegexRules
        errors={errors}
        handleAddRegexInput={onHandleAddRegexInput}
        handleDeleteRegexRule={onHandleDeleteRegexRule}
        handleSetRegexRule={onHandleSetRegexRule}
        regexRules={regexRules}
      />
    </React.Fragment>
  );
};

export default RuleRegexAttributes;
