import * as React from "react";
import { NavLink, Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { queryCache } from 'react-query';

import Activities from './activities';
import Activity from './activity';
import SubmissionModal from './shared/submissionModal';
import ActivityForm from './configureSettings/activityForm';
import UniversalRulesIndex from './universalRules/listView';
import UniversalRule from './universalRules/ruleView';

import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { createActivity } from '../../utils/comprehension/activityAPIs';
import { Modal } from '../../../Shared/index';
import { blankActivity } from '../../../../constants/comprehension';
import { getCsrfToken } from "../../helpers/comprehension";

const ComprehensionLanding = ({ location }: RouteComponentProps) => {
  const { pathname } = location
  const [showCreateActivityModal, setShowCreateActivityModal] = React.useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const csrfToken = getCsrfToken();
  localStorage.setItem('csrfToken', csrfToken);

  const checkIndexActive = () => {
    if(!location) return false;
    return pathname === '/activities' && !showCreateActivityModal;
  }

  const checkOverviewActive = () => {
    if(!location) return false;
    return pathname !== '/activities' && !pathname.includes('/universal-rules') && !showCreateActivityModal;
  }

  const checkUniversalRulesActive = () => {
    if(!location) return false;
    return pathname.includes('/universal-rules') && !showCreateActivityModal;
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

  return(
    <div className="main-admin-container">
      <section className="left-side-menu">
        <p className="menu-label">
          Home
        </p>
        <ul className="menu-list">
          <NavLink activeClassName='is-active' isActive={checkIndexActive} to='/activities'>
            Activities Index
          </NavLink>
          <NavLink activeClassName='is-active' isActive={checkOverviewActive} to={pathname}>
            Activity Overview
          </NavLink>
          <button className={`create-activity-button ${showCreateActivityModal ? 'is-active' :''}`} onClick={toggleCreateActivityModal} type="submit">
            Create New Activity
          </button>
          <NavLink activeClassName='is-active' isActive={checkUniversalRulesActive} to='/universal-rules'>
            Universal Rules
          </NavLink>
        </ul>
      </section>
      {showCreateActivityModal && renderActivityForm()}
      {showSubmissionModal && renderSubmissionModal()}
      <Switch>
        <Redirect exact from='/' to='/activities' />
        <Route component={Activity} path='/activities/:activityId' />
        <Route component={Activities} path='/activities' />
        <Route component={UniversalRule} path='/universal-rules/:ruleId' />
        <Route component={UniversalRulesIndex} path='/universal-rules' />
      </Switch>
    </div>
  )
}

export default withRouter(ComprehensionLanding);
