import * as React from "react";
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { Modal } from 'quill-component-library/dist/componentLibrary';
import ActivityForm from '../../components/comprehension/activityForm'
import Activities from '../../components/comprehension/activities'
import Activity from '../../components/comprehension/activity'

const ComprehensionLanding = (props) => {
  const { location } = props
  const { pathname } = location
  const [modalActive, setModalActive] = React.useState(false)

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

  const submitActivity = (activity) => {
    // TODO: hook into Activity POST API
    setModalActive(false)
  }

  const renderActivityForm = () => {
    return(
      <Modal>
        <ActivityForm activity={{}} closeModal={closeModal} submitActivity={submitActivity} />
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
        <Redirect component={Activities} exact from='/' to='/activities' />
        <Route component={Activity} path='/activities/:activityId' />
        <Route component={Activities} path='/activities' />
      </Switch>
    </div>
  )
}

export default withRouter(ComprehensionLanding)
