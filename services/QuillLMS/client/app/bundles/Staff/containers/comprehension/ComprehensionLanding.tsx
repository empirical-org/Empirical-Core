import * as React from "react";
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Activities from '../../components/comprehension/activities'
import Activity from '../../components/comprehension/activity'

const ComprehensionLanding = () => {
  return(
    <div className="main-admin-container">
      <section className="left-side-menu">
        <p className="menu-label">
          Home
        </p>
        <ul className="menu-list">
          <NavLink activeClassName="is-active" to='/activities'>Activities Index</NavLink>
        </ul>
      </section>
      <Switch>
        <Redirect component={Activities} exact from='/' to='/activities' />
        <Route component={Activity} path='/activities/:activityId' />
        <Route component={Activities} path='/activities' />
      </Switch>
      <section className="right-panel" />
    </div>
  )
}

export default withRouter(ComprehensionLanding)
