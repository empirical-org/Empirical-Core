import * as React from "react";
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Activities from '../../components/comprehension/activities'

const ComprehensionIndex = () => {
  return(
    <div className="main-admin-container">
      <section className="left-side-menu">
        <p className="menu-label">
          Activity
        </p>
        <ul className="menu-list">
          <NavLink activeClassName="is-active" to='/activities'>Overview</NavLink>
        </ul>
      </section>
      <Switch>
        <Redirect component={Activities} exact from='/' to='/activities' />
        <Route component={Activities} path='/activities' />
      </Switch>
      <section className="right-panel" />
    </div>
  )
}

export default withRouter(ComprehensionIndex)
