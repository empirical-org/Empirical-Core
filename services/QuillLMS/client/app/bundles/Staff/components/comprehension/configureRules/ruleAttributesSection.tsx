import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import RegexSection from './regexSection';

import { TextEditor } from '../../../../Shared/index'

const RuleAttributesSection = ({
  errors,
  firstPlagiarismFeedback,
  handleAddRegexInput,
  handleDeleteRegexRule,
  handleSetRegexRule,
  plagiarismText,
  regexFeedback,
  regexRules,
  ruleType,
  secondPlagiarismFeedback,
  setFirstPlagiarismFeedback,
  setPlagiarismText,
  setSecondPlagiarismFeedback,
  setRegexFeedback,
}) => {
  if(ruleType === "Plagiarism") {
    return(
      <React.Fragment>
        <p className="form-subsection-label">Plagiarism Text</p>
        {plagiarismText && <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={setPlagiarismText}
          key="plagiarism-text"
          text={plagiarismText.text}
        />}
        {errors['Plagiarism Text'] && <p className="error-message">{errors['Plagiarism Text']}</p>}
        <p className="form-subsection-label">Feedback</p>
        {firstPlagiarismFeedback && <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={setFirstPlagiarismFeedback}
          key="first-plagiarism-feedback"
          text={firstPlagiarismFeedback.text}
        />}
        {errors['First Plagiarism Feedback'] && <p className="error-message">{errors['First Plagiarism Feedback']}</p>}
        {secondPlagiarismFeedback && <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={setSecondPlagiarismFeedback}
          key="second-plagiarism-feedback"
          text={secondPlagiarismFeedback.text}
        />}
        {errors['Second Plagiarism Feedback'] && <p className="error-message">{errors['Second Plagiarism Feedback']}</p>}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <p className="form-subsection-label">Feedback</p>
      {regexFeedback && <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        handleTextChange={setRegexFeedback}
        key="regex-feedback"
        text={regexFeedback.text}
      />}
      {errors['Regex Feedback'] && <p className="error-message">{errors['Regex Feedback']}</p>}
      <p className="form-subsection-label" id="regex-rules-label">Regex Rules</p>
      <RegexSection
        errors={errors}
        handleAddRegexInput={handleAddRegexInput}
        handleDeleteRegexRule={handleDeleteRegexRule}
        handleSetRegexRule={handleSetRegexRule}
        regexRules={regexRules}
      />
    </React.Fragment>
  );
};

export default RuleAttributesSection;
