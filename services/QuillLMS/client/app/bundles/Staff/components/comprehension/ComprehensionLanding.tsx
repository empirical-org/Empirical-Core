import * as React from "react";
import { NavLink, Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { Modal } from 'quill-component-library/dist/componentLibrary';
import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { blankActivity } from '../../../../constants/comprehension';
import ActivityForm from './configureSettings/activityForm'
import Activities from './activities'
import Activity from './activity'

const ComprehensionLanding = ({ location }: RouteComponentProps) => {
  const { pathname } = location
  const [modalActive, setModalActive] = React.useState<boolean>(false)

  const checkIndexActive = () => {
    if(!location) return false;
    return pathname === '/activities' && !modalActive;
  }

  const checkOverviewActive = () => {
    if(!location) return false;
    return pathname !== '/activities' && !modalActive;
  }

  const createNewActivity = () => {
    setModalActive(true);
  }

  const closeModal = () => {
    setModalActive(false)
  }

  const submitActivity = (activity: ActivityInterface) => {
    // TODO: hook into Activity POST API
    setModalActive(false)
  }

  const renderActivityForm = () => {
    return(
      <Modal>
        <ActivityForm activity={blankActivity} closeModal={closeModal} submitActivity={submitActivity} />
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
          <button className={`create-activity-button ${modalActive ? 'is-active' :''}`} onClick={createNewActivity} type="submit">
            Create New Activity
          </button>
        </ul>
      </section>
      {modalActive && renderActivityForm()}
      <Switch>
        <Redirect exact from='/' to='/activities' />
        <Route component={Activity} path='/activities/:activityId' />
        <Route component={Activities} path='/activities' />
      </Switch>
    </div>
  )
}

export default withRouter(ComprehensionLanding)
