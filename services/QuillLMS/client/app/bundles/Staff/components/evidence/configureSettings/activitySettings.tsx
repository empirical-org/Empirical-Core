import * as React from "react";
import { useQueryClient } from 'react-query';
import { withRouter } from 'react-router-dom';

import ActivityForm from './activityForm';

import { Spinner } from '../../../../Shared/index';
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { ActivityInterface } from '../../../interfaces/evidenceInterfaces';
import { createActivity, updateActivity } from '../../../utils/evidence/activityAPIs';
import SubmissionModal from '../shared/submissionModal';

const ActivitySettings = ({ activity, history }: {activity: ActivityInterface, history: any}) => {
  const { id } = activity;
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = React.useState<string>(null);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const queryClient = useQueryClient()

  function handleUpdateActivity (activity: ActivityInterface) {
    updateActivity(activity, id).then((response) => {
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

  function handleSubmitActivity(activity: ActivityInterface) {
    createActivity(activity).then((response) => {
      const { errors, activityId } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        // update activities cache to display newly created activity
        queryClient.refetchQueries('activities');
        setErrors([]);
        setErrorOrSuccessMessage('Activity successfully created!');
        toggleSubmissionModal();
        history.push(`/activities/${activityId}/settings`)
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

  const submitFunction = id ? handleUpdateActivity : handleSubmitActivity;

  if(!activity) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  return(
    <div className="activity-settings-container">
      {showSubmissionModal && renderSubmissionModal()}
      {activity && renderHeader({activity: activity}, 'Activity Settings', true)}
      <ActivityForm activity={activity} requestErrors={errors} submitActivity={submitFunction} />
    </div>
  );
}

export default withRouter<any, any>(ActivitySettings);
