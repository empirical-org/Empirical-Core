import * as React from "react";

import { TextArea, } from '../../../../Shared/index';
import { uploadDataset, } from '../../../utils/evidence/genAIAPIs';

const NewDatasetModal = ({ stemVault, closeModal, }) => {
  const [file, setFile] = React.useState();
  const [notes, setNotes] = React.useState('');
  const [error, setError] = React.useState(null)

  function handleSetNotes(e) { setNotes(e.target.value) }

  function handleOnChange(e) { setFile(e.target.files[0]); };

  function uploadData() { uploadDataset(stemVault, file, notes, successFunction, errorFunction) }

  function successFunction() { window.location.reload() }

  function errorFunction(errorMessage: string) { setError(errorMessage) }

  return (
    <div className="modal-container new-dataset-modal-container">
      <div className="modal-background" />
      <div className="new-dataset-modal quill-modal modal-body">
        <div className="top-section">
          <h3>New Dataset</h3>
          {error && <span className="all-errors-message">{error}</span>}
          <input
            accept=".csv"
            aria-label="file"
            onChange={handleOnChange}
            type="file"
          />
          <TextArea
            handleChange={handleSetNotes}
            id="notes"
            label='Notes'
            timesSubmitted={0}
            value={notes}
          />
        </div>
        <div className="button-section">
          <button className="quill-button medium outlined focus-on-light" onClick={closeModal} type="button">Cancel</button>
          <button className="quill-button medium contained focus-on-light" onClick={uploadData} type="button">Upload</button>
        </div>
      </div>
    </div>
  )
}

export default NewDatasetModal
