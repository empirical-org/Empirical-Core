import * as React from "react";
import { EditorState, ContentState } from 'draft-js'
import Dropzone from 'react-dropzone'

import { numericalWordOptions } from '../../../../../constants/evidence';
import { RuleFeedbackInterface, ClickEvent, TextAreaEvent,  } from '../../../interfaces/evidenceInterfaces';
import { handleSetFeedback, renderHighlights } from '../../../helpers/evidence/ruleHelpers';
import { TextEditor } from '../../../../Shared/index';
import { HIGHLIGHT_ADDITION, HIGHLIGHT_REMOVAL, FEEDBACK, FEEDBACK_LAYER_ADDITION, FEEDBACK_LAYER_REMOVAL, } from '../../../../../constants/evidence';
import getAuthToken from '../../../../Teacher/components/modules/get_auth_token'


/* esl-lint disable notes: arrow functions needed to get correct index of feedback/highlight being updated in array, and a
Fragment is appropriate since there can be multiple feedbacks */

// TODO: add ability to delete added feedback layer/ highlight sections

const RuleAttributesSection = ({
  errors,
  setUniversalFeedback,
  universalFeedback,
  hint,
  setHint,
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

  function onHandleRemoveHighlight(e: ClickEvent, feedbackIndex) {
    const highlightIndex = universalFeedback[feedbackIndex].highlights_attributes.filter(h => !h._destroy).length - 1
    const { target } = e;
    const { value } = (target as HTMLButtonElement);
    if (window.confirm('Are you sure you want to delete this highlight?')) {
      handleSetFeedback({
        text: '',
        feedback: universalFeedback,
        setFeedback: setUniversalFeedback,
        updateType: HIGHLIGHT_REMOVAL,
        feedbackIndex: parseInt(value),
        highlightIndex: highlightIndex
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

  function handleAddHint() {
    setHint({
      explanation: '',
      image_link: '',
      image_alt_text: ''
    });
  }

  function onHintExplanationChange(explanation) {
    setHint({ ...hint, explanation })
  }

  function handleRemoveHint() {
    setHint({ ...hint, _destroy: true, })
  }

  function handleHintAltTextChange(e: TextAreaEvent) {
    setHint({ ...hint, image_alt_text: e.target.value })
  }

  function handleDrop(acceptedFiles) {
    acceptedFiles.forEach(file => {
      const data = new FormData()
      data.append('file', file)
      fetch(`${process.env.DEFAULT_URL}/cms/images`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': getAuthToken()
        },
        body: data
      })
      .then(response => response.json()) // if the response is a JSON object
      .then(response => setHint({...hint, image_link: response.url, })); // Handle the success response object
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
            shouldCheckSpelling={true}
            text={universalFeedback[i].text}
          />
          {errors['Universal Feedback'] && errors['Universal Feedback'].length && <p className="error-message">{errors['Universal Feedback'][i]}</p>}
          {feedback.highlights_attributes && renderHighlights(feedback.highlights_attributes, i, onHandleSetUniversalFeedback)}
          <div className="button-wrapper">
            <button className={`add-highlight quill-button small primary outlined ${disabledStatus}`} disabled={!!disabledStatus} onClick={onHandleAddHighlight} type="button" value={`${i}`}>Add Highlight</button>
            {feedback.highlights_attributes && feedback.highlights_attributes.filter(h => !h._destroy) && feedback.highlights_attributes.filter(h => !h._destroy).length ? <button className="remove-highlight quill-button small secondary outlined" onClick={(e) => onHandleRemoveHighlight(e, i)} type="button" value={`${i}`}>Remove Highlight</button> : null}
          </div>
        </React.Fragment>
      );
    });
  }

  function renderHint() {
    return (
      <React.Fragment>
        <p className="form-subsection-label">Hint Explanation</p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={onHintExplanationChange}
          key="universal-feedback"
          shouldCheckSpelling={true}
          text={hint.explanation}
        />
        <p className="form-subsection-label">Hint Annotated Example</p>
        <i>Click the square below or drag a file into it to upload. Please make sure to upload an .svg image.</i>
        <Dropzone onDrop={handleDrop} />
        {hint.image_link && hint.image_link.length ? <img src={hint.image_link} /> : null}
        <p className="form-subsection-label">Hint Image Alt Text</p>
        <textarea
          className="image-attribution-text-area"
          onChange={handleHintAltTextChange}
          value={hint.image_alt_text}
        />
        <button className="remove-highlight quill-button small secondary outlined" onClick={handleRemoveHint} type="button">Remove Hint</button>
      </React.Fragment>
    )
  }

  return(
    // eslint-disable-next-line
    <React.Fragment>
      {universalFeedback && renderFeedbacks(universalFeedback)}
      <div className="button-wrapper">
        <button className="add-feedback-layer quill-button small primary outlined" onClick={onHandleAddFeedbackLayer} type="button">Add Feedback Layer</button>
        <button className="remove-highlight quill-button small secondary outlined" onClick={onHandleRemoveFeedbackLayer} type="button">Remove Feedback Layer</button>
      </div>
      {hint && !hint._destroy ? renderHint() : <button className="add-feedback-layer quill-button small primary outlined" onClick={handleAddHint} type="button">Add Hint</button>}
    </React.Fragment>
  );
};

export default RuleAttributesSection;
