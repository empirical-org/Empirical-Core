import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import { numericalWordOptions } from '../../../../../constants/comprehension';
import { RuleFeedbackInterface, ClickEvent } from '../../../interfaces/comprehensionInterfaces';
import { handleSetFeedback, renderHighlights } from '../../../helpers/comprehension/ruleHelpers';
import { TextEditor } from '../../../../Shared/index';

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
    const { id } = (target as HTMLButtonElement);
    handleSetFeedback({
      text: '',
      feedback: universalFeedback,
      setFeedback: setUniversalFeedback,
      updateType: 'highlight addition',
      feedbackIndex: parseInt(id),
      highlightIndex: null
    });
  }

  function onHandleAddFeedbackLayer() {
    handleSetFeedback({
      text: '',
      feedback: universalFeedback,
      setFeedback: setUniversalFeedback,
      updateType: 'feedback layer addition',
      feedbackIndex: null,
      highlightIndex: null
    });
  }

  function renderFeedbacks(feedbacks) {
    return feedbacks.map((feedback: RuleFeedbackInterface, i: number) => {
      return(
        <React.Fragment key={i}>
          <p className="form-subsection-label">{`${numericalWordOptions[i]} Revision - Feedback`}</p>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            // eslint-disable-next-line
            handleTextChange={(text) => onHandleSetUniversalFeedback(text, i, null, 'feedback')}
            key="universal-feedback"
            text={universalFeedback[i].text}
          />
          {errors['Universal Feedback'] && errors['Universal Feedback'].length && <p className="error-message">{errors['Universal Feedback'][i]}</p>}
          <button className="add-highlight quill-button small primary outlined" id={`${i}`} onClick={onHandleAddHighlight} type="button">Add Highlight</button>
          {feedback.highlights_attributes && renderHighlights(feedback.highlights_attributes, i, onHandleSetUniversalFeedback)}
        </React.Fragment>
      );
    });
  }

  return(
    // eslint-disable-next-line
    <React.Fragment>
      {universalFeedback && renderFeedbacks(universalFeedback)}
      <button className="add-feedback-layer quill-button small primary outlined" onClick={onHandleAddFeedbackLayer} type="button">Add Feedback Layer</button>
    </React.Fragment>
  );
};

export default RuleAttributesSection;
