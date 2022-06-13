import * as React from "react";
import { EditorState, ContentState } from 'draft-js'
import Dropzone from 'react-dropzone'

import { TextAreaEvent,  } from '../../../interfaces/evidenceInterfaces';
import { TextEditor } from '../../../../Shared/index';
import getAuthToken from '../../../../Teacher/components/modules/get_auth_token'

const RuleHint = ({
  errors,
  hint,
  setHint,
}) => {

  function handleHintCreation() {
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
        <i>Click the square below or drag a file into it to upload. Please make sure to upload an .svg image and ensure that any extra whitespace below the image is cropped.</i>
        <Dropzone onDrop={handleDrop} />
        {hint.image_link && hint.image_link.length ? <img alt={hint.image_alt_text} src={hint.image_link} /> : null}
        <p className="form-subsection-label">Hint Image Alt Text</p>
        <textarea
          aria-label="Hint Image Alt Text"
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
      {hint && !hint._destroy ? renderHint() : <button className="add-feedback-layer quill-button small primary outlined" onClick={handleHintCreation} type="button">Add Hint</button>}
    </React.Fragment>
  );
};

export default RuleHint;
