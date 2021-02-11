import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import {
  handleSetPlagiarismText,
  handleSetFirstPlagiarismFeedback,
  handleSetSecondPlagiarismFeedback
} from '../../../helpers/comprehension/ruleHelpers';
import { TextEditor } from '../../../../Shared/index'

const RulePlagiarismAttributes = ({
  errors,
  firstPlagiarismFeedback,
  plagiarismText,
  secondPlagiarismFeedback,
  setFirstPlagiarismFeedback,
  setPlagiarismText,
  setSecondPlagiarismFeedback
}) => {

  function onHandleSetPlagiarismText(text: string) { handleSetPlagiarismText(text, plagiarismText, setPlagiarismText)}

  function onHandleSetFirstPlagiarismFeedback(text: string) { handleSetFirstPlagiarismFeedback(text, firstPlagiarismFeedback, setFirstPlagiarismFeedback) }

  function onHandleSetSecondPlagiarismFeedback(text: string) { handleSetSecondPlagiarismFeedback(text, secondPlagiarismFeedback, setSecondPlagiarismFeedback) }

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
};

export default RulePlagiarismAttributes;
