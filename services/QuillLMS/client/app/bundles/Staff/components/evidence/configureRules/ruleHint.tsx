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

  function onHintNameChange(e: InputEvent) {
    setHint({ ...hint, name: e.target.value })
  }

  function onHintExplanationChange(explanation) {
    setHint({ ...hint, explanation })
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
        <label className="form-subsection-label">Name</label><br />
        <input className="name-input" onChange={onHintNameChange} type="text" value={hint.name || ''} />
        <p className="form-subsection-label">Hint Explanation</p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={onHintExplanationChange}
          key={`hint-explanation-${hint.id}`}
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
          className="image-alt-text-area"
          onChange={handleHintAltTextChange}
          value={hint.image_alt_text}
        />
      </React.Fragment>
    )
  }

  return(
    <React.Fragment>
      {renderHint()}
    </React.Fragment>
  );
};

export default RuleHint;
