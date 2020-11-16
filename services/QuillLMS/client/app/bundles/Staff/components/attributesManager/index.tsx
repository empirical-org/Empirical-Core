import * as React from 'react'
import { Route, Switch, Link, } from 'react-router-dom';

import Topics from './topics/index'

const TOPICS = 'topics'

const AttributesManager = ({ match, location, }) => {

  let activeLink
  if (location.pathname.includes(TOPICS)) {
    activeLink = TOPICS
  }

  return (
    <div className="attributes-manager">
      <div className="cms-manager-nav">
        <div className="cms-manager-links">
          <Link className={activeLink === TOPICS ? 'active': ''} to={`${match.path}/${TOPICS}`}>Topics</Link>
        </div>
      </div>
      <Switch>
        <Route component={Topics} path={`${match.path}/${TOPICS}`} />
      </Switch>
    </div>
  )
}

export default AttributesManager
