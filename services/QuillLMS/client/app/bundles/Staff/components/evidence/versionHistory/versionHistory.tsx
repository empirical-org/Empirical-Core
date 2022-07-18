import * as React from "react";
import { useQueryClient, } from 'react-query';
import { withRouter } from 'react-router-dom';


import { ActivityInterface } from '../../../interfaces/evidenceInterfaces';
import SubmissionModal from '../shared/submissionModal';
import { createActivity, updateActivity, updateActivityVersion } from '../../../utils/evidence/activityAPIs';
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { Input, Spinner } from '../../../../Shared/index';
import { TITLE } from "../../../../../constants/evidence";

const VersionHistory = ({ activity, history }: {activity: ActivityInterface, history: any}) => {
  const { id } = activity;
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = React.useState<string>(null);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const queryClient = useQueryClient()

  const [activityNote, setActivityNote] = React.useState<string>('');

  function handleUpdateActivity () {
    updateActivityVersion(activityNote, id).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        queryClient.refetchQueries(`activity-${id}`)
        queryClient.removeQueries('activities')
        setErrors([]);
        // reset errorOrSuccessMessage in case of subsequent submission
        setErrorOrSuccessMessage('Activity successfully updated!');
        toggleSubmissionModal();
      }
    });
  }

  // function handleSubmitActivity(activity: ActivityInterface) {
  //   createActivity(activity).then((response) => {
  //     const { errors, activityId } = response;
  //     if(errors && errors.length) {
  //       setErrors(errors);
  //     } else {
  //       // update activities cache to display newly created activity
  //       queryClient.refetchQueries('activities');
  //       setErrors([]);
  //       setErrorOrSuccessMessage('Activity successfully created!');
  //       toggleSubmissionModal();
  //       history.push(`/activities/${activityId}/settings`)
  //     }
  //   });
  // }

  function toggleSubmissionModal() {
    setShowSubmissionModal(!showSubmissionModal);
  }

  function renderSubmissionModal() {
    const message = errorOrSuccessMessage ? errorOrSuccessMessage : 'Activity successfully updated!';
    return <SubmissionModal close={toggleSubmissionModal} message={message} />;
  }


  if(!activity) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  return(
    <div className="version-history-container">
      {showSubmissionModal && renderSubmissionModal()}
      {false && renderHeader({activity: activity}, 'Version History', true)}
      <Input
        className="notes-input"
        error={errors[TITLE]}
        handleChange={setActivityNote}
        label="version notes"
        value={activityNote}
      />
      <div className="button-and-id-container">
        <button className="quill-button fun primary contained focus-on-light" id="activity-submit-button" onClick={handleUpdateActivity} type="submit">Save</button>
      </div>
    </div>
  );
}

export default VersionHistory;
