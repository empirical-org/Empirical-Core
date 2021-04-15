import * as React from "react";
import { NavLink, } from 'react-router-dom';
import { queryCache } from 'react-query';

import SubmissionModal from './shared/submissionModal';
import ActivityForm from './configureSettings/activityForm';

import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { createActivity } from '../../utils/comprehension/activityAPIs';
import { Modal } from '../../../Shared/index';
import { blankActivity } from '../../../../constants/comprehension';
import { getCsrfToken } from "../../helpers/comprehension";

const Navigation = ({ location, match }) => {
  const { pathname } = location
  const { params, } = match
  const { activityId, } = params
  const [showCreateActivityModal, setShowCreateActivityModal] = React.useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const csrfToken = getCsrfToken();
  localStorage.setItem('csrfToken', csrfToken);

  const checkOverviewActive = () => {
    if(!location) return false;
    return pathname === '/activities' && !showCreateActivityModal;
  }

  const toggleCreateActivityModal = () => {
    setShowCreateActivityModal(!showCreateActivityModal);
  }

  const toggleSubmissionModal = () => {
    setShowSubmissionModal(!showSubmissionModal);
  }

  const submitActivity = (activity: ActivityInterface) => {
    createActivity(activity).then((response) => {
      const { error } = response;
      if(error) setError(error);
      setShowCreateActivityModal(false);
      setShowSubmissionModal(true);

      // update activities cache to display newly created activity
      queryCache.refetchQueries('activities')
    });
  }

  const renderActivityForm = () => {
    return(
      <Modal>
        <ActivityForm activity={blankActivity} closeModal={toggleCreateActivityModal} submitActivity={submitActivity} />
      </Modal>
    );
  }

  const renderSubmissionModal = () => {
    const message = error ? error : 'Submission successful!';
    return <SubmissionModal close={toggleSubmissionModal} message={message} />;
  }

  let activityEditorAndResults

  if (activityId) {
    activityEditorAndResults = (<React.Fragment>
      <p className="menu-label">
        Activity Editor
      </p>
      <ul className="menu-list">
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/settings`}>
          Activity Settings
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/turk-sessions`}>
          Collect Turk Responses
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/semantic-labels`}>
          Semantic Labels
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/regex-rules`}>
          RegEx Rules
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/plagiarism-rules`}>
          Plagiarism Rules
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/rules`}>
          View All Rules
        </NavLink>
      </ul>
      <p className="menu-label">
        Activity Results
      </p>
      <ul className="menu-list">
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/stats`}>
          Activity Stats
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/activity-sessions`}>
          View Sessions
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/rules-analysis`}>
          Rules Analysis
        </NavLink>
      </ul>
    </React.Fragment>)
  }

  return(<React.Fragment>
    <section className="left-side-menu">
      <p className="menu-label">
        Tool Views
      </p>
      <ul className="menu-list">
        <NavLink activeClassName='is-active' isActive={checkOverviewActive} to="/activities">
          View Activities
        </NavLink>
        <button className={`create-activity-button ${showCreateActivityModal ? 'is-active' :''}`} onClick={toggleCreateActivityModal} type="submit">
          Create New Activity
        </button>
        <NavLink activeClassName={!showCreateActivityModal ? 'is-active' :''} to="/universal-rules">
          View Universal Rules
        </NavLink>
      </ul>
      {activityEditorAndResults}
    </section>
    {showCreateActivityModal && renderActivityForm()}
    {showSubmissionModal && renderSubmissionModal()}
  </React.Fragment>)
}

export default Navigation
