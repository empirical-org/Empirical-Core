import { ContentState, EditorState } from 'draft-js';
import * as React from "react";

import { FEEDBACK, HIGHLIGHT_ADDITION, HIGHLIGHT_REMOVAL } from '../../../../../constants/evidence';
import { TextEditor } from '../../../../Shared/index';
import {
  handleSetFeedback, handleSetPlagiarismTexts,
  renderHighlights
} from '../../../helpers/evidence/ruleHelpers';
import { ClickEvent } from '../../../interfaces/evidenceInterfaces';

// TODO: add props interface

export const PlagiarismTextEditor = ({ text, index, setPlagiarismText, }) => {
  function onHandleSetPlagiarismText(text) {
    setPlagiarismText(text, index)
  }

  return (
    <React.Fragment key={index}>
      <p className="form-subsection-label">Plagiarism Text - Text String {index + 1}</p>
      <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        handleTextChange={onHandleSetPlagiarismText}
        key={`plagiarism-text-${index}`}
        shouldCheckSpelling={true}
        text={text}
      />
    </React.Fragment>
  )
}

const RulePlagiarismAttributes = ({
  errors,
  plagiarismFeedbacks,
  plagiarismTexts,
  setPlagiarismFeedbacks,
  setPlagiarismTexts
}) => {

  function onAddPlagiarismTextString() {
    const newPlagiarismTexts = [...plagiarismTexts, { text: '', }]
    setPlagiarismTexts(newPlagiarismTexts)
  }

  function onRemovePlagiarismTextString() {
    if (window.confirm('Are you sure you want to remove this text string?')) {
      const newPlagiarismTexts = [...plagiarismTexts]
      newPlagiarismTexts[plagiarismTexts.length - 1]._destroy = true
      setPlagiarismTexts(newPlagiarismTexts)
    }
  }

  function onHandleSetPlagiarismText(text: string, index: number) { handleSetPlagiarismTexts(text, index, plagiarismTexts, setPlagiarismTexts)}

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

  function onHandleRemoveFeedbackHighlight(e: ClickEvent, plagiarismFeedbackIndex) {
    const highlightIndex = plagiarismFeedbacks[plagiarismFeedbackIndex].highlights_attributes.filter(h => !h._destroy).length - 1
    const { target } = e;
    const { value } = (target as HTMLButtonElement);
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      handleSetFeedback({
        text: '',
        feedback: plagiarismFeedbacks,
        setFeedback: setPlagiarismFeedbacks,
        updateType: HIGHLIGHT_REMOVAL,
        feedbackIndex: parseInt(value),
        highlightIndex: highlightIndex
      });
    }
  }

  // TODO: break out Plagiarism feedbacks into separate components

  const plagiarismTextEditorElements = plagiarismTexts.map((plagiarismText, i) => {
    if (plagiarismText._destroy) { return <span /> }

    return (
      <PlagiarismTextEditor
        index={i}
        key={i}
        setPlagiarismText={onHandleSetPlagiarismText}
        text={plagiarismText.text}
      />
    )
  })

  return(
    <React.Fragment>
      {plagiarismTextEditorElements}
      <div className="button-wrapper">
        <button className="add-highlight quill-button small primary outlined" onClick={onAddPlagiarismTextString} type="button">Add Text String</button>
        {!!plagiarismTexts.length && <button className="remove-highlight quill-button small primary outlined" onClick={onRemovePlagiarismTextString} type="button">Remove Text String</button>}
      </div>
      {errors['Plagiarism Text'] && <p className="error-message">{errors['Plagiarism Text']}</p>}
      <p className="form-subsection-label">First Feedback</p>
      {plagiarismFeedbacks[0] && <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        // eslint-disable-next-line
          handleTextChange={(text) => onHandleSetPlagiarismFeedback(text, 0, null, FEEDBACK)}
        key="first-plagiarism-feedback"
        shouldCheckSpelling={true}
        text={plagiarismFeedbacks[0].text}
      />}
      {plagiarismFeedbacks[0] && plagiarismFeedbacks[0].highlights_attributes && renderHighlights(plagiarismFeedbacks[0].highlights_attributes, 0, onHandleSetPlagiarismFeedback)}
      {plagiarismFeedbacks[0] && (<div className="button-wrapper">
        <button className="add-highlight quill-button small primary outlined" onClick={onHandleAddFeedbackHighlight} type="button" value="0">Add Highlight</button>
        {plagiarismFeedbacks[0].highlights_attributes && plagiarismFeedbacks[0].highlights_attributes.filter(h => !h._destroy) && plagiarismFeedbacks[0].highlights_attributes.filter(h => !h._destroy).length ? <button className="remove-highlight quill-button small secondary outlined" onClick={(e) => onHandleRemoveFeedbackHighlight(e, 0)} type="button" value="0">Remove Highlight</button> : null}
      </div>)}
      {errors['First Plagiarism Feedback'] && <p className="error-message">{errors['First Plagiarism Feedback']}</p>}
      <p className="form-subsection-label">Second Feedback</p>
      {plagiarismFeedbacks[1] && <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        // eslint-disable-next-line
          handleTextChange={(text) => onHandleSetPlagiarismFeedback(text, 1, null, FEEDBACK)}
        key="second-plagiarism-feedback"
        shouldCheckSpelling={true}
        text={plagiarismFeedbacks[1].text}
      />}
      {plagiarismFeedbacks[1] && plagiarismFeedbacks[1].highlights_attributes && renderHighlights(plagiarismFeedbacks[1].highlights_attributes, 1, onHandleSetPlagiarismFeedback)}
      {plagiarismFeedbacks[1] && (<div className="button-wrapper">
        <button className="add-highlight quill-button small primary outlined" onClick={onHandleAddFeedbackHighlight} type="button" value="1">Add Highlight</button>
        {plagiarismFeedbacks[1].highlights_attributes && plagiarismFeedbacks[1].highlights_attributes.filter(h => !h._destroy) && plagiarismFeedbacks[1].highlights_attributes.filter(h => !h._destroy).length ? <button className="remove-highlight quill-button small secondary outlined" onClick={(e) => onHandleRemoveFeedbackHighlight(e, 1)} type="button" value="1">Remove Highlight</button> : null}
      </div>)}
      {errors['Second Plagiarism Feedback'] && <p className="error-message">{errors['Second Plagiarism Feedback']}</p>}
    </React.Fragment>
  );
};

export default RulePlagiarismAttributes;
