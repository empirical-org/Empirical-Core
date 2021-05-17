import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import { numericalWordOptions } from '../../../../../constants/comprehension';
import { RuleFeedbackInterface, ClickEvent } from '../../../interfaces/comprehensionInterfaces';
import { handleSetFeedback, renderHighlights } from '../../../helpers/comprehension/ruleHelpers';
import { TextEditor } from '../../../../Shared/index';
import { HIGHLIGHT_ADDITION, HIGHLIGHT_REMOVAL, FEEDBACK, FEEDBACK_LAYER_ADDITION, FEEDBACK_LAYER_REMOVAL, } from '../../../../../constants/comprehension';

/* esl-lint disable notes: arrow functions needed to get correct index of feedback/highlight being updated in array, and a
Fragment is appropriate since there can be multiple feedbacks */

// TODO: add ability to delete added feedback layer/ highlight sections

const RuleAttributesSection = ({
  errors,
  setUniversalFeedback,
  universalFeedback
}) => {

  function onHandleSetUniversalFeedback(text: string, i: number, j: number, updateType:  string) {
    handleSetFeedback({
      text,
      feedback: universalFeedback,
      setFeedback: setUniversalFeedback,
      updateType: updateType,
      feedbackIndex: i,
      highlightIndex: j
    });
  }

  function onHandleAddHighlight(e: ClickEvent) {
    const { target } = e;
    const { value } = (target as HTMLButtonElement);
    handleSetFeedback({
      text: '',
      feedback: universalFeedback,
      setFeedback: setUniversalFeedback,
      updateType: HIGHLIGHT_ADDITION,
      feedbackIndex: parseInt(value),
      highlightIndex: null
    });
  }

  function onHandleRemoveHighlight(e: ClickEvent) {
    const { target } = e;
    const { value } = (target as HTMLButtonElement);
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      handleSetFeedback({
        text: '',
        feedback: universalFeedback,
        setFeedback: setUniversalFeedback,
        updateType: HIGHLIGHT_REMOVAL,
        feedbackIndex: parseInt(value),
        highlightIndex: null
      });
    }
  }

  function onHandleAddFeedbackLayer() {
    handleSetFeedback({
      text: '',
      feedback: universalFeedback,
      setFeedback: setUniversalFeedback,
      updateType: FEEDBACK_LAYER_ADDITION,
      feedbackIndex: null,
      highlightIndex: null
    });
  }

  function onHandleRemoveFeedbackLayer() {
    if (window.confirm('Are you sure you want to delete this feedback layer?')) {
      handleSetFeedback({
        text: '',
        feedback: universalFeedback,
        setFeedback: setUniversalFeedback,
        updateType: FEEDBACK_LAYER_REMOVAL,
        feedbackIndex: null,
        highlightIndex: null
      });
    }
  }

  function renderFeedbacks(feedbacks) {
    return feedbacks.map((feedback: RuleFeedbackInterface, i: number) => {
      const disabledStatus = feedbacks.length > 5 ?  'disabled' : '';
      return(
        <React.Fragment key={i}>
          <p className="form-subsection-label">{`${numericalWordOptions[i]} Layer Feedback`}</p>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            // eslint-disable-next-line
            handleTextChange={(text) => onHandleSetUniversalFeedback(text, i, null, FEEDBACK)}
            key="universal-feedback"
            text={universalFeedback[i].text}
          />
          {errors['Universal Feedback'] && errors['Universal Feedback'].length && <p className="error-message">{errors['Universal Feedback'][i]}</p>}
          {feedback.highlights_attributes && renderHighlights(feedback.highlights_attributes, i, onHandleSetUniversalFeedback)}
          <div className="button-wrapper">
            <button className={`add-highlight quill-button small primary outlined ${disabledStatus}`} disabled={!!disabledStatus} onClick={onHandleAddHighlight} type="button" value={`${i}`}>Add Highlight</button>
            {feedback.highlights_attributes && feedback.highlights_attributes.length ? <button className="remove-highlight quill-button small secondary outlined" onClick={onHandleRemoveHighlight} type="button" value={`${i}`}>Remove Highlight</button> : null}
          </div>
        </React.Fragment>
      );
    });
  }

  return(
    // eslint-disable-next-line
    <React.Fragment>
      {universalFeedback && renderFeedbacks(universalFeedback)}
      <div className="button-wrapper">
        <button className="add-feedback-layer quill-button small primary outlined" onClick={onHandleAddFeedbackLayer} type="button">Add Feedback Layer</button>
        <button className="remove-highlight quill-button small secondary outlined" onClick={onHandleRemoveFeedbackLayer} type="button">Remove Feedback Layer</button>
      </div>
    </React.Fragment>
  );
};

export default RuleAttributesSection;
