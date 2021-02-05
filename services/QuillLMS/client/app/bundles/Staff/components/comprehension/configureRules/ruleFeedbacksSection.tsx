import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import RegexSection from './regexSection';

import { TextEditor } from '../../../../Shared/index'

const RuleFeedbacksSection = ({
  ruleType,
  firstPlagiarismFeedback,
  setFirstPlagiarismFeedback,
  secondPlagiarismFeedback,
  setSecondPlagiarismFeedback,
  regexFeedback,
  setRegexFeedback,
  errors,
  handleAddRegexInput,
  handleDeleteRegexRule,
  handleSetRegexRule,
  regexRules,
}) => {
  if(ruleType === "Plagiarism") {
    return(
      <React.Fragment>
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

export default RuleFeedbacksSection;
