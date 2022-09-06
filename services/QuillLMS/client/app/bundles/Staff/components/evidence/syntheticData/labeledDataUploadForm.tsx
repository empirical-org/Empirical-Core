import * as React from "react";
import { useQuery, useQueryClient, } from 'react-query';
import Dropzone from 'react-dropzone'

import SubmissionModal from '../shared/submissionModal';
import { fetchActivity, createLabeledSyntheticData } from '../../../utils/evidence/activityAPIs';
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { Input, Spinner } from '../../../../Shared/index';
import { TITLE } from "../../../../../constants/evidence";
import getAuthToken from '../../../../Teacher/components/modules/get_auth_token'

const LabeledDataUploadForm = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = React.useState<string>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const queryClient = useQueryClient()

  const [filenames, setFilenames] = React.useState<string[]>([]);

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const handleDrop = (acceptedFiles) => {
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
        .then(response => response.json()) // if the response is a JSON object
        .then(response => setFilenames(filenames.concat(response.filename))); // Handle the success response object
    });
  }

  const handleSubmit = () => {
    createLabeledSyntheticData(filenames, activityId).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        setFilenames([]);
        setErrorOrSuccessMessage('Synthetic Data started! You will receive an email with the csv files');
        toggleSubmissionModal();
      }
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
        <i>The file should be a <b>.csv</b> with <b>two columns</b>: (text, label) and <b>no header row</b>.</i>
      </p>
      <Dropzone onDrop={handleDrop} />
      <h4> Uploaded Files To Process</h4>
      {filenames.map(name => <li>{name}</li>)}

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
