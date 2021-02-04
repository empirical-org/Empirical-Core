import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import RegexSection from './regexSection';

import { Input, TextEditor } from '../../../../Shared/index'

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
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={setFirstPlagiarismFeedback}
          key="first-plagiarism-feedback"
          text={firstPlagiarismFeedback.text}
        />
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={setSecondPlagiarismFeedback}
          key="second-plagiarism-feedback"
          text={secondPlagiarismFeedback.text}
        />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Input
        className="regex-feedback"
        error={errors['Regex Feedback']}
        handleChange={setRegexFeedback}
        label="Feedback"
        value={regexFeedback.text}
      />
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
