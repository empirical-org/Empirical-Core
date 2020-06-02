import * as React from "react";
import { NavLink, Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { Modal } from 'quill-component-library/dist/componentLibrary';
import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { blankActivity } from '../../../../constants/comprehension';
import ActivityForm from './configureSettings/activityForm'
import Activities from './activities'
import Activity from './activity'
import { activityPostAPI } from '../../utils/comprehensionAPIs';
import useSWR, { mutate } from 'swr'

const ComprehensionLanding = ({ location }: RouteComponentProps) => {
  const { pathname } = location
  const [showCreateActivityModal, setShowCreateActivityModal] = React.useState<boolean>(false)
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false)
  const [error, setError] = React.useState<{}>(null);

  const checkIndexActive = () => {
    if(!location) return false;
    return pathname === '/activities' && !showCreateActivityModal;
  }

  const checkOverviewActive = () => {
    if(!location) return false;
    return pathname !== '/activities' && !showCreateActivityModal;
  }

  const toggleCreateActivityModal = () => {
    setShowCreateActivityModal(!showCreateActivityModal);
  }

  const toggleSubmissionModal = () => {
    setShowSubmissionModal(!showSubmissionModal);
  }

  const submitActivity = async (activity: ActivityInterface) => {
    const activityObject = {
      flag: activity.flag,
      passages: activity.passages,
      prompts: activity.prompts,
      title: activity.title
    }
    const response = await fetch(activityPostAPI, {
      method: 'POST',
      body: JSON.stringify(activityObject),
      headers: {
        "Accept": "application/JSON",
        "Content-Type": "application/json"
      },
    });
    // not a 2xx status
    if(Math.round(response.status / 100) !== 2) {
      setError('Activity submission failed, please try again.');
    }
    setShowCreateActivityModal(false)
    setShowSubmissionModal(true)
    // update activities cache to display newly created activity
    mutate("activities");
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
    return(
      <Modal>
        <div className="close-button-container">
          <button className="quill-button fun primary contained" id="flag-close-button" onClick={toggleSubmissionModal} type="submit">x</button>
        </div>
        <p className="submission-message">{message}</p>
      </Modal>
    );
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
        </ul>
      </section>
      {showCreateActivityModal && renderActivityForm()}
      {showSubmissionModal && renderSubmissionModal()}
      <Switch>
        <Redirect exact from='/' to='/activities' />
        <Route component={Activity} path='/activities/:activityId' />
        <Route component={Activities} path='/activities' />
      </Switch>
    </div>
  )
}

export default withRouter(ComprehensionLanding)
