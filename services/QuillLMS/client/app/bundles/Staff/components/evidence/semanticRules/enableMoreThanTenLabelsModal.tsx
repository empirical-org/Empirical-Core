import * as React from 'react'

import { Input, } from '../../../../Shared/index'

const EnableMoreThanLabelsModal = ({ cancel, isOpen, save }) => {
  if (!isOpen) return null;

  const [additionalLabels, setAdditionalLabels] = React.useState('')

  function handleSaveClick() { save(additionalLabels) }

  function renderAdditionalLabels() {
    return (
      <Input
        handleChange={e => setAdditionalLabels(e.target.value)}
        label="Additional labels (separated by commas)"
        value={additionalLabels}
      />
    )
  }

  function renderSaveAndCancelButtons() {
    return (
      <div className="save-and-cancel-buttons">
        <button
          className="quill-button medium secondary outlined focus-on-light"
          onClick={cancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="quill-button medium primary contained focus-on-light"
          onClick={handleSaveClick}
          type="button"
        >
          Save
        </button>
      </div>
    )
  }

  function renderTitleAndDescription() {
    return (
      <div className="title-and-description">
        <h2>Vertex AI: Enable more than 10 labels</h2>
        <p className="description">
          When adding a vertex AI model through the Google Cloud UI, it will only allow us to pull 10 labels in
          automatically. This modal will allow you to manually specify the additional labels you want enabled on our
          platform.
        </p>
      </div>
    )
  }

  return (
    <div className="modal-container">
      <div className="enable-more-than-ten-labels-modal quill-modal modal-body">
        <div>
          {renderTitleAndDescription()}
          {renderAdditionalLabels()}
          {renderSaveAndCancelButtons()}
        </div>
      </div>
    </div>
  );
}

export default EnableMoreThanLabelsModal;
