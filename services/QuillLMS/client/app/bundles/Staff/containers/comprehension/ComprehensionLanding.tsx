import * as React from "react";
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Activities from '../../components/comprehension/activities'
import Activity from '../../components/comprehension/activity'

const ComprehensionLanding = (props) => {
  const { location } = props
  const { pathname } = location
  
  const checkActive = () => {
    if(!location) return false;
    return pathname !== "/activities";
  }

  return(
    <div className="main-admin-container">
      <section className="left-side-menu">
        <p className="menu-label">
          Home
        </p>
        <ul className="menu-list">
          <NavLink activeClassName="is-active" exact to='/activities'>Activities Index</NavLink>
          <NavLink activeClassName="is-active" isActive={checkActive} to={pathname}>Activities Overview</NavLink>
        </ul>
      </section>
      <Switch>
        <Redirect component={Activities} exact from='/' to='/activities' />
        <Route component={Activity} path='/activities/:activityId' />
        <Route component={Activities} path='/activities' />
      </Switch>
    </div>
  )
}

export default withRouter(ComprehensionLanding)
