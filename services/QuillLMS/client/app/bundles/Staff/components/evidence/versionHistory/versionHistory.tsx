import * as React from "react";
import { useQueryClient, } from 'react-query';
import { withRouter } from 'react-router-dom';


import { ActivityInterface } from '../../../interfaces/evidenceInterfaces';
import SubmissionModal from '../shared/submissionModal';
import { createActivity, updateActivity, updateActivityVersion } from '../../../utils/evidence/activityAPIs';
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { Input, Spinner } from '../../../../Shared/index';
import { TITLE } from "../../../../../constants/evidence";

const VersionHistory = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = React.useState<string>(null);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const queryClient = useQueryClient()

  const [activityVersionNote, setActivityVersionNote] = React.useState<string>('');

  function handleUpdateActivity () {
    updateActivityVersion(activityVersionNote, activityId).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        queryClient.refetchQueries(`activity-${activityId}`)
        queryClient.removeQueries('activities')
        setErrors([]);
        // reset errorOrSuccessMessage in case of subsequent submission
        setErrorOrSuccessMessage('Activity successfully updated!');
        toggleSubmissionModal();
      }
    });
  }

  function toggleSubmissionModal() {
    setShowSubmissionModal(!showSubmissionModal);
  }

  function renderSubmissionModal() {
    const message = errorOrSuccessMessage ? errorOrSuccessMessage : 'Activity successfully updated!';
    return <SubmissionModal close={toggleSubmissionModal} message={message} />;
  }

  function handleSetActivityVersionNote(e: InputEvent){ setActivityVersionNote(e.target.value) };


  if(!activityId) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  return(
    <div className="version-history-container">
      {showSubmissionModal && renderSubmissionModal()}
      <p> Current Version: 0</p>
      <Input
        className="notes-input"
        error={errors[TITLE]}
        handleChange={handleSetActivityVersionNote}
        label="version notes"
        value={activityVersionNote}
      />
      <div className="button-and-id-container">
        <button className="quill-button fun primary contained focus-on-light" id="activity-submit-button" onClick={handleUpdateActivity} type="submit">Save</button>
      </div>
    </div>
  );
}

export default VersionHistory;
