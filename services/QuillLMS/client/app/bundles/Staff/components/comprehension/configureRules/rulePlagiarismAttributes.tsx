import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import {
  handleSetPlagiarismText,
  renderHighlights,
  handleSetFeedback
} from '../../../helpers/comprehension/ruleHelpers';
import { ClickEvent } from '../../../interfaces/comprehensionInterfaces';
import { TextEditor } from '../../../../Shared/index'
import { HIGHLIGHT_ADDITION, HIGHLIGHT_REMOVAL, FEEDBACK, } from '../../../../../constants/comprehension';

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
    const { value } = (target as HTMLButtonElement);
    handleSetFeedback({
      text: '',
      feedback: plagiarismFeedbacks,
      setFeedback: setPlagiarismFeedbacks,
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
        feedback: plagiarismFeedbacks,
        setFeedback: setPlagiarismFeedbacks,
        updateType: HIGHLIGHT_REMOVAL,
        feedbackIndex: parseInt(value),
        highlightIndex: null
      });
    }
  }

  // TODO: break out Plagiarism feedbacks into separate components

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
          handleTextChange={(text) => onHandleSetPlagiarismFeedback(text, 0, null, FEEDBACK)}
          key="first-plagiarism-feedback"
          text={plagiarismFeedbacks[0].text}
        />}
        {plagiarismFeedbacks[0] && plagiarismFeedbacks[0].highlights_attributes && renderHighlights(plagiarismFeedbacks[0].highlights_attributes, 0, onHandleSetPlagiarismFeedback)}
        {plagiarismFeedbacks[0] && (<div className="button-wrapper">
          <button className="add-highlight quill-button small primary outlined" onClick={onHandleAddFeedbackHighlight} type="button" value="0">Add Highlight</button>
          {plagiarismFeedbacks[0].highlights_attributes && plagiarismFeedbacks[0].highlights_attributes.length ? <button className="remove-highlight quill-button small secondary outlined" onClick={onHandleRemoveFeedbackHighlight} type="button" value="0">Remove Highlight</button> : null}
        </div>)}
        {errors['First Plagiarism Feedback'] && <p className="error-message">{errors['First Plagiarism Feedback']}</p>}
        <p className="form-subsection-label">Second Feedback</p>
        {plagiarismFeedbacks[1] && <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          // eslint-disable-next-line
          handleTextChange={(text) => onHandleSetPlagiarismFeedback(text, 1, null, FEEDBACK)}
          key="second-plagiarism-feedback"
          text={plagiarismFeedbacks[1].text}
        />}
        {plagiarismFeedbacks[1] && plagiarismFeedbacks[1].highlights_attributes && renderHighlights(plagiarismFeedbacks[1].highlights_attributes, 1, onHandleSetPlagiarismFeedback)}
        {plagiarismFeedbacks[1] && (<div className="button-wrapper">
          <button className="add-highlight quill-button small primary outlined" onClick={onHandleAddFeedbackHighlight} type="button" value="1">Add Highlight</button>
          {plagiarismFeedbacks[1].highlights_attributes && plagiarismFeedbacks[1].highlights_attributes.length ? <button className="remove-highlight quill-button small secondary outlined" onClick={onHandleRemoveFeedbackHighlight} type="button" value="1">Remove Highlight</button> : null}
        </div>)}
        {errors['Second Plagiarism Feedback'] && <p className="error-message">{errors['Second Plagiarism Feedback']}</p>}
      </React.Fragment>
    );
};

export default RulePlagiarismAttributes;
