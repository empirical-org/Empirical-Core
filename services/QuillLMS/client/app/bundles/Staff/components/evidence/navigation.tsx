import * as React from "react";
import { NavLink, } from 'react-router-dom';
import { queryCache } from 'react-query';

import SubmissionModal from './shared/submissionModal';
import ActivityForm from './configureSettings/activityForm';

import { ActivityInterface } from '../../interfaces/evidenceInterfaces';
import { createActivity } from '../../utils/evidence/activityAPIs';

const Navigation = ({ location, match }) => {
  const { pathname } = location
  const { params, } = match
  const { activityId, } = params
  const [showCreateActivityModal, setShowCreateActivityModal] = React.useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  function checkOverviewActive() {
    if(!location) return false;
    return pathname === '/activities' && !showCreateActivityModal;
  }

  function toggleCreateActivityModal() {
    setShowCreateActivityModal(!showCreateActivityModal);
  }

  function toggleSubmissionModal() {
    setShowSubmissionModal(!showSubmissionModal);
  }

  function submitActivity(activity: ActivityInterface) {
    createActivity(activity).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        // update activities cache to display newly created activity
        queryCache.refetchQueries('activities');
        setErrors([]);
        setShowCreateActivityModal(false);
        setShowSubmissionModal(true);
      }
    });
  }

  function renderSubmissionModal () {
    return <SubmissionModal close={toggleSubmissionModal} message='Submission successful!' />;
  }

  let rulesAnalysisSubLinks
  let semanticLabelsSubLinks
  let rulesIndexSubLinks

  if (pathname.includes('rules-analysis')) {
    rulesAnalysisSubLinks = (<React.Fragment>
      <NavLink activeClassName="is-active" className="sublink" to={`/activities/${activityId}/rules-analysis/because`}>
        Because
      </NavLink>
      <NavLink activeClassName="is-active" className="sublink" to={`/activities/${activityId}/rules-analysis/but`}>
        But
      </NavLink>
      <NavLink activeClassName="is-active" className="sublink" to={`/activities/${activityId}/rules-analysis/so`}>
        So
      </NavLink>
    </React.Fragment>)
  }

  if (pathname.includes('semantic-labels')) {
    semanticLabelsSubLinks = (<React.Fragment>
      <NavLink activeClassName="is-active" className="sublink" to={`/activities/${activityId}/semantic-labels/because`}>
        Because
      </NavLink>
      <NavLink activeClassName="is-active" className="sublink" to={`/activities/${activityId}/semantic-labels/but`}>
        But
      </NavLink>
      <NavLink activeClassName="is-active" className="sublink" to={`/activities/${activityId}/semantic-labels/so`}>
        So
      </NavLink>
    </React.Fragment>)
  }

  if (pathname.includes('rules-index')) {
    rulesIndexSubLinks = (<React.Fragment>
      <NavLink activeClassName="is-active" className="sublink" to={`/activities/${activityId}/rules-index/because`}>
        Because
      </NavLink>
      <NavLink activeClassName="is-active" className="sublink" to={`/activities/${activityId}/rules-index/but`}>
        But
      </NavLink>
      <NavLink activeClassName="is-active" className="sublink" to={`/activities/${activityId}/rules-index/so`}>
        So
      </NavLink>
    </React.Fragment>)
  }

  let activityEditorAndResults

  if (activityId && activityId !== 'new') {
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
        {semanticLabelsSubLinks}
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/regex-rules`}>
          RegEx Rules
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/plagiarism-rules`}>
          Plagiarism Rules
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/rules-index`}>
          View All Rules
        </NavLink>
        {rulesIndexSubLinks}
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
        {rulesAnalysisSubLinks}
      </ul>
      <p className="menu-label">
        Change Log
      </p>
      <ul className="menu-list">
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/change-log`}>
          Change Log
        </NavLink>
      </ul>
    </React.Fragment>)
  }

  return(
    <React.Fragment>
      <section className="left-side-menu">
        <p className="menu-label">
          Tool Views
        </p>
        <ul className="menu-list">
          <NavLink activeClassName='is-active' isActive={checkOverviewActive} to="/activities">
            View Activities
          </NavLink>
          <NavLink activeClassName='is-active' to="/activities/new">
            Create New Activity
          </NavLink>
          <NavLink activeClassName='is-active' to="/universal-rules">
            View Universal Rules
          </NavLink>
        </ul>
        {activityEditorAndResults}
      </section>
      {showSubmissionModal && renderSubmissionModal()}
    </React.Fragment>
  )
}

export default Navigation
