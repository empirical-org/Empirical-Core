import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import { numericalWordOptions } from '../../../../../constants/comprehension';
import { RuleFeedbackInterface, ClickEvent } from '../../../interfaces/comprehensionInterfaces';
import { handleSetUniversalFeedback } from '../../../helpers/comprehension/ruleHelpers';
import { TextEditor } from '../../../../Shared/index';

/* esl-lint disable notes: arrow functions needed to get correct index of feedback/highlight being updated in array, and a
Fragment is appropriate since there can be multiple feedbacks */

const RuleAttributesSection = ({
  errors,
  setUniversalFeedback,
  universalFeedback
}) => {

  function onHandleSetUniversalFeedback(text: string, i: number, j: number, updateType:  string) {
    handleSetUniversalFeedback({
      text,
      universalFeedback,
      setUniversalFeedback,
      updateType: updateType,
      feedbackIndex: i,
      highlightIndex: j
    });
  }

  function onHandleAddHighlight(e: ClickEvent) {
    const { target } = e;
    const { id } = (target as HTMLButtonElement);
    handleSetUniversalFeedback({
      text: '',
      universalFeedback,
      setUniversalFeedback,
      updateType: 'highlight addition',
      feedbackIndex: parseInt(id),
      highlightIndex: null
    });
  }

  function renderHighlights(highlights, i) {
    return highlights.map((highlight, j) => {
      return(
        <React.Fragment key={j}>
          <p className="form-subsection-label">{`${numericalWordOptions[i]} Revision - Highlight`}</p>
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            // eslint-disable-next-line
            handleTextChange={(text) => onHandleSetUniversalFeedback(text, i, j, 'highlight text')}
            key="universal-feedback-highlight"
            text={highlight.text}
          />
        </React.Fragment>
      );
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
          <button className="quill-button small primary outlined" id={`${i}`} onClick={onHandleAddHighlight} type="button">Add Highlight</button>
          {feedback.highlights && feedback.highlights && renderHighlights(feedback.highlights, i)}
        </React.Fragment>
      )
    })
  }

  return(
    // eslint-disable-next-line
    <React.Fragment>
      {universalFeedback && renderFeedbacks(universalFeedback)}
    </React.Fragment>
  );
};

export default RuleAttributesSection;
