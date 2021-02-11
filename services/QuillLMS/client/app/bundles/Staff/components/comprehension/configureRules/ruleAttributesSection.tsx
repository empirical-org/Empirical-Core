import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import RegexSection from './regexSection';

import {
  handleSetPlagiarismText,
  handleSetFirstPlagiarismFeedback,
  handleSetSecondPlagiarismFeedback,
  handleSetRegexFeedback,
  handleSetRegexRule,
  handleAddRegexInput,
  handleDeleteRegexRule
} from '../../../helpers/comprehension/ruleHelpers';
import { TextEditor } from '../../../../Shared/index'
import { InputEvent } from '../../../interfaces/comprehensionInterfaces';

const RuleAttributesSection = ({
  errors,
  firstPlagiarismFeedback,
  plagiarismText,
  regexFeedback,
  regexRules,
  ruleType,
  rulesToUpdate,
  rulesToCreate,
  rulesToDelete,
  setRulesToDelete,
  setRegexRules,
  setRulesToUpdate,
  setRulesToCreate,
  secondPlagiarismFeedback,
  setFirstPlagiarismFeedback,
  setPlagiarismText,
  setRegexFeedback,
  setSecondPlagiarismFeedback
}) => {

  function onHandleSetPlagiarismText(text: string) { handleSetPlagiarismText(text, plagiarismText, setPlagiarismText)}

  function onHandleSetFirstPlagiarismFeedback(text: string) { handleSetFirstPlagiarismFeedback(text, firstPlagiarismFeedback, setFirstPlagiarismFeedback) }

  function onHandleSetSecondPlagiarismFeedback(text: string) { handleSetSecondPlagiarismFeedback(text, secondPlagiarismFeedback, setSecondPlagiarismFeedback) }

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

  if(ruleType === 'Plagiarism') {
    return(
      <React.Fragment>
        <p className="form-subsection-label">Plagiarism Text</p>
        {plagiarismText && <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={onHandleSetPlagiarismText}
          key="plagiarism-text"
          text={plagiarismText.text}
        />}
        {errors['Plagiarism Text'] && <p className="error-message">{errors['Plagiarism Text']}</p>}
        <p className="form-subsection-label">Feedback</p>
        {firstPlagiarismFeedback && <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={onHandleSetFirstPlagiarismFeedback}
          key="first-plagiarism-feedback"
          text={firstPlagiarismFeedback.text}
        />}
        {errors['First Plagiarism Feedback'] && <p className="error-message">{errors['First Plagiarism Feedback']}</p>}
        {secondPlagiarismFeedback && <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={onHandleSetSecondPlagiarismFeedback}
          key="second-plagiarism-feedback"
          text={secondPlagiarismFeedback.text}
        />}
        {errors['Second Plagiarism Feedback'] && <p className="error-message">{errors['Second Plagiarism Feedback']}</p>}
      </React.Fragment>
    );
  } else if(ruleType === 'Regex') {
    return (
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
        <RegexSection
          errors={errors}
          handleAddRegexInput={onHandleAddRegexInput}
          handleDeleteRegexRule={onHandleDeleteRegexRule}
          handleSetRegexRule={onHandleSetRegexRule}
          regexRules={regexRules}
        />
      </React.Fragment>
    );
  }
};

export default RuleAttributesSection;
