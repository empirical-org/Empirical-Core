import * as React from "react";
import Dropzone from 'react-dropzone';
import { useQuery, useQueryClient, } from 'react-query';

import { BECAUSE, BUT, SO } from "../../../../../constants/evidence";
import { Spinner } from '../../../../Shared/index';
import getAuthToken from '../../../../Teacher/components/modules/get_auth_token';
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { createLabeledSyntheticData, fetchActivity } from '../../../utils/evidence/activityAPIs';
import SubmissionModal from '../shared/submissionModal';

const LabeledDataUploadForm = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = React.useState<string>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const queryClient = useQueryClient()

  const blankPromptFiles = { [BECAUSE] : [], [BUT] : [], [SO] : [], };
  const [promptFiles, setPromptFiles] = React.useState({...blankPromptFiles});

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const raiseResponseErrors = (response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  const displayError = (error) => {
    setErrorOrSuccessMessage(`Error: ${error.message}`);
    toggleSubmissionModal();
  }

  const handleDrop = (acceptedFiles, rejected, event, conjunction) => {
    acceptedFiles.forEach(file => {
      const data = new FormData()
      data.append('file', file)
      fetch(`${process.env.DEFAULT_URL}/cms/csv_uploads`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': getAuthToken()
        },
        body: data
      })
        .then(raiseResponseErrors)
        .then(response => response.json()) // if the response is a JSON object
        .then(response => {
          const data = {...promptFiles}
          const conjunctionData = [...data[conjunction]]

          conjunctionData.push(response.filename)
          data[conjunction] = conjunctionData

          setPromptFiles(data)
        })
        .catch(displayError)
    });
  }

  const handleSubmit = () => {
    createLabeledSyntheticData(promptFiles, activityId).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
        setErrorOrSuccessMessage(errors.first.message);
      } else {
        setErrors([]);
        setPromptFiles({...blankPromptFiles});
        setErrorOrSuccessMessage('Synthetic Data started! You will receive an email with the csv files');
      }
      toggleSubmissionModal();
    });
  }

  const toggleSubmissionModal = () => setShowSubmissionModal(!showSubmissionModal);

  function renderSubmissionModal() {
    const message = errorOrSuccessMessage || 'Synthetic Labeled Data Started!';
    return <SubmissionModal close={toggleSubmissionModal} message={message} />;
  }

  if(!activityId || !activityData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const { activity } = activityData

  function renderConjunctionUploader(conjunction) {
    const capitalizeConjunction = conjunction.charAt(0).toUpperCase() + conjunction.substring(1)
    return (
      <div>
        <h4 className='bg-quill-teal label-title'>
          <span className='highlight'>{capitalizeConjunction}</span>
          &nbsp;File Upload
        </h4>
        <Dropzone
          className="upload-section"
          onDrop={(accepted, rejected, event) => handleDrop(accepted, rejected, event, conjunction)}
        >
          <p>Drag {conjunction} file here (or click here)</p>
        </Dropzone>

        {promptFiles[conjunction].length !== 0 && <h5>Uploaded</h5>}
        <ul>
          {promptFiles[conjunction].map((name, index) => <li key={index}>{name}</li>)}
        </ul>
      </div>
    );
  }

  return(
    <div className="seed-data-form-container">
      <h4>{activity && activity.title}</h4>
      {showSubmissionModal && renderSubmissionModal()}
      {activity && renderHeader({activity: activity}, 'Upload Labeled Data', true)}
      <label>CSV upload</label>
      <p>
        <i>Click the square below or drag a file into it to upload.</i>
      </p>
      <p>
        <i>Each file should be a <b>.csv</b> with <b>two columns</b>: (text, label) and <b>no header row</b>.</i>
      </p>

      {[BECAUSE, BUT, SO].map((conjunction) => renderConjunctionUploader(conjunction))}

      <div className="button-and-id-container">
        <button className="quill-button fun large primary contained focus-on-light" id="activity-submit-button" onClick={handleSubmit} type="submit">
          <span aria-label="robot" role="img">🤖</span>
          <span aria-label="label" role="img">🏷</span>

          Generate Synthetic Data
        </button>
      </div>
      <br />
    </div>
  );
}

export default LabeledDataUploadForm;
