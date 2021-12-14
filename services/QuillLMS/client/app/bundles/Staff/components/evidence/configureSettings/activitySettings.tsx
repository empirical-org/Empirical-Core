import * as React from "react";
import { queryCache } from 'react-query';
import { withRouter } from 'react-router-dom';

import ActivityForm from './activityForm';

import { ActivityInterface } from '../../../interfaces/evidenceInterfaces';
import SubmissionModal from '../shared/submissionModal';
import { createActivity, updateActivity, archiveParentActivity } from '../../../utils/evidence/activityAPIs';
import { renderHeader } from "../../../helpers/evidence";
import { Spinner } from '../../../../Shared/index';

const ActivitySettings = ({ activity, history }: {activity: ActivityInterface, history: any}) => {
  const { id } = activity;
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = React.useState<string>(null);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  function handleClickArchiveActivity() {
    if (window.confirm('Are you sure you want to archive? If you archive, it will not be displayed on the "View Activities" page. Please also make sure that the activity has the correct parent activity id, because the parent activity will be archived as well.')) {
      archiveParentActivity(activity.parent_activity_id).then((response) => {
        const { error } = response;
        error && setErrorOrSuccessMessage(error);
        queryCache.refetchQueries(`activity-${id}`)
        if(!error) {
          // reset errorOrSuccessMessage in case of subsequent submission
          setErrorOrSuccessMessage('Activity successfully archived!');
        }
        toggleSubmissionModal();
      });

    }
  }

  function handleUpdateActivity (activity: ActivityInterface) {
    updateActivity(activity, id).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        queryCache.refetchQueries(`activity-${id}`)
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
        queryCache.refetchQueries('activities');
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
      {activity && renderHeader({activity: activity}, 'Activity Settings')}
      <ActivityForm activity={activity} handleClickArchiveActivity={handleClickArchiveActivity} requestErrors={errors} submitActivity={submitFunction} />
    </div>
  );
}

export default withRouter<any, any>(ActivitySettings);
