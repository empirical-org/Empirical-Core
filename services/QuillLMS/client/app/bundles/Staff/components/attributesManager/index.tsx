import * as React from 'react'
import { Route, Switch, Link, } from 'react-router-dom';

import Standards from './standards/index'
import Topics from './topics/index'
import Readability from './readability/index'
import ContentPartners from './contentPartners/index'

const STANDARDS = 'standards'
const TOPICS = 'topics'
const READABILITY = 'readability'
const CONTENT_PARTNERS = 'content_partners'

const AttributesManager = ({ match, location, }) => {

  let activeLink

  [STANDARDS, TOPICS, READABILITY, CONTENT_PARTNERS].forEach(path => {
    if (location.pathname.includes(path)) {
      activeLink = path
    }
  })

  return (
    <div className="attributes-manager">
      <div className="cms-manager-nav">
        <div className="cms-manager-links">
          <Link className={activeLink === STANDARDS ? 'active': ''} to={`${match.path}/${STANDARDS}`}>Standards</Link>
          <Link className={activeLink === READABILITY ? 'active': ''} to={`${match.path}/${READABILITY}`}>Readability</Link>
          <Link className={activeLink === TOPICS ? 'active': ''} to={`${match.path}/${TOPICS}`}>Topics</Link>
          <Link className={activeLink === CONTENT_PARTNERS ? 'active': ''} to={`${match.path}/${CONTENT_PARTNERS}`}>Content Partners</Link>
        </div>
      </div>
      <Switch>
        <Route component={Readability} path={`${match.path}/${READABILITY}`} />
        <Route component={Topics} path={`${match.path}/${TOPICS}`} />
        <Route component={ContentPartners} path={`${match.path}/${CONTENT_PARTNERS}`} />
        <Route component={Standards} path={`${match.path}/${STANDARDS}`} />
      </Switch>
    </div>
  )
}

export default AttributesManager
