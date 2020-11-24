import * as React from 'react'
import { Route, Switch, Link, } from 'react-router-dom';

import Topics from './topics/index'
import Readability from './readability/index'

const TOPICS = 'topics'
const READABILITY = 'readability'

const AttributesManager = ({ match, location, }) => {

  let activeLink
  if (location.pathname.includes(TOPICS)) {
    activeLink = TOPICS
  } else if (location.pathname.includes(READABILITY)) {
    activeLink = READABILITY
  }

  return (
    <div className="attributes-manager">
      <div className="cms-manager-nav">
        <div className="cms-manager-links">
          <Link className={activeLink === READABILITY ? 'active': ''} to={`${match.path}/${READABILITY}`}>Readability</Link>
          <Link className={activeLink === TOPICS ? 'active': ''} to={`${match.path}/${TOPICS}`}>Topics</Link>
        </div>
      </div>
      <Switch>
        <Route component={Readability} path={`${match.path}/${READABILITY}`} />
        <Route component={Topics} path={`${match.path}/${TOPICS}`} />
      </Switch>
    </div>
  )
}

export default AttributesManager
