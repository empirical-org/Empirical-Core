import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import RegexRules from './regexRules';

import {
  handleSetRegexFeedback,
  handleSetRegexRule,
  handleAddRegexInput,
  handleDeleteRegexRule
} from '../../../helpers/comprehension/ruleHelpers';
import { TextEditor } from '../../../../Shared/index'
import { InputEvent } from '../../../interfaces/comprehensionInterfaces';

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

  function onHandleSetRegexFeedback(text: string) { handleSetRegexFeedback(text, regexFeedback, setRegexFeedback)}

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

  return(
    <React.Fragment>
      <p className="form-subsection-label">Feedback</p>
      {regexFeedback && <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        handleTextChange={onHandleSetRegexFeedback}
        key="regex-feedback"
        text={regexFeedback.text}
      />}
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
