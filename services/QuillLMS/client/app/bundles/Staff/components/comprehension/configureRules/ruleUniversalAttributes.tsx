import * as React from "react";
import { EditorState, ContentState } from 'draft-js'

import { numericalWordOptions, ruleHighlightOptions } from '../../../../../constants/comprehension';
import { RuleFeedbackInterface, ClickEvent } from '../../../interfaces/comprehensionInterfaces';
import { handleSetUniversalFeedback } from '../../../helpers/comprehension/ruleHelpers';
import { TextEditor, DropdownInput } from '../../../../Shared/index';

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

  function onHandleAddFeedbackLayer(e: ClickEvent) {

  }

  function renderHighlights(highlights, i) {
    return highlights.map((highlight, j) => {
      let highlightTypeValue = ruleHighlightOptions[0];
      // this is an update for existing rule, convert to object for DropdownInput value
      if(highlight.highlight_type && typeof highlight.highlight_type === 'string') {
        const { highlight_type } = highlight;
        highlightTypeValue = { label: highlight_type, value: highlight_type };
      } else if(highlight.highlight_type && highlight.highlight_type.value) {
        const { highlight_type } = highlight;
        highlightTypeValue = highlight_type;
      }
      return(
        <section className="rule-highlight-section" key={j}>
          <p className="form-subsection-label">{`${numericalWordOptions[i]} Revision - ${numericalWordOptions[j]} Highlight`}</p>
          <DropdownInput
            className='rule-type-input'
            // eslint-disable-next-line
            handleChange={(e) => onHandleSetUniversalFeedback(e, i, j, 'highlight type')}
            isSearchable={true}
            label="Optimal?"
            options={ruleHighlightOptions}
            value={highlightTypeValue}
          />
          <TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            // eslint-disable-next-line
            handleTextChange={(text) => onHandleSetUniversalFeedback(text, i, j, 'highlight text')}
            key="universal-feedback-highlight"
            text={highlight.text}
          />
        </section>
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
          <button className="add-highlight quill-button small primary outlined" id={`${i}`} onClick={onHandleAddHighlight} type="button">Add Highlight</button>
          {feedback.highlights_attributes && feedback.highlights_attributes && renderHighlights(feedback.highlights_attributes, i)}
          <button className="add-feedback-layer quill-button small primary outlined" id={`${i}`} onClick={onHandleAddFeedbackLayer} type="button">Add Feedback Layer</button>
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
