import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import {
  handleSetPlagiarismText,
  renderHighlights,
  handleSetFeedback
} from '../../../helpers/comprehension/ruleHelpers';
import { ClickEvent } from '../../../interfaces/comprehensionInterfaces';
import { TextEditor } from '../../../../Shared/index'

// TODO: add props interface

const RulePlagiarismAttributes = ({
  errors,
  plagiarismFeedbacks,
  plagiarismText,
  setPlagiarismFeedbacks,
  setPlagiarismText
}) => {

  function onHandleSetPlagiarismText(text: string) { handleSetPlagiarismText(text, plagiarismText, setPlagiarismText)}

  function onHandleSetPlagiarismFeedback(text: string, i: number, j: number, updateType:  string) {
    handleSetFeedback({
      text,
      feedback: plagiarismFeedbacks,
      setFeedback: setPlagiarismFeedbacks,
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
      feedback: plagiarismFeedbacks,
      setFeedback: setPlagiarismFeedbacks,
      updateType: 'highlight addition',
      feedbackIndex: parseInt(id),
      highlightIndex: null
    });
  }

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
        <p className="form-subsection-label">First Feedback</p>
        {plagiarismFeedbacks[0] && <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          // eslint-disable-next-line
          handleTextChange={(text) => onHandleSetPlagiarismFeedback(text, 0, null, 'feedback')}
          key="first-plagiarism-feedback"
          text={plagiarismFeedbacks[0].text}
        />}
        {plagiarismFeedbacks[0] && plagiarismFeedbacks[0].highlights_attributes && renderHighlights(plagiarismFeedbacks[0].highlights_attributes, 0, onHandleSetPlagiarismFeedback)}
        {plagiarismFeedbacks[0] && <button className="add-highlight quill-button small primary outlined" id="0" onClick={onHandleAddFeedbackHighlight} type="button">Add Highlight</button>}
        {errors['First Plagiarism Feedback'] && <p className="error-message">{errors['First Plagiarism Feedback']}</p>}
        <p className="form-subsection-label">Second Feedback</p>
        {plagiarismFeedbacks[1] && <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          // eslint-disable-next-line
          handleTextChange={(text) => onHandleSetPlagiarismFeedback(text, 1, null, 'feedback')}
          key="second-plagiarism-feedback"
          text={plagiarismFeedbacks[1].text}
        />}
        {plagiarismFeedbacks[1] && plagiarismFeedbacks[1].highlights_attributes && renderHighlights(plagiarismFeedbacks[1].highlights_attributes, 1, onHandleSetPlagiarismFeedback)}
        {plagiarismFeedbacks[1] && <button className="add-highlight quill-button small primary outlined" id="1" onClick={onHandleAddFeedbackHighlight} type="button">Add Highlight</button>}
        {errors['Second Plagiarism Feedback'] && <p className="error-message">{errors['Second Plagiarism Feedback']}</p>}
      </React.Fragment>
    );
};

export default RulePlagiarismAttributes;
