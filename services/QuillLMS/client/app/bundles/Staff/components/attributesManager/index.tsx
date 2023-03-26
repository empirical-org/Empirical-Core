import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import ActivityCategories from './activity_categories/index';
import ContentPartners from './contentPartners/index';
import Readability from './readability/index';
import Standards from './standards/index';
import Topics from './topics/index';

const STANDARDS = 'standards'
const ACTIVITY_CATEGORIES = 'activity_categories'
const TOPICS = 'topics'
const READABILITY = 'readability'
const CONTENT_PARTNERS = 'content_partners'

const AttributesManager = ({ match, location, }) => {

  let activeLink

  [STANDARDS, TOPICS, READABILITY, CONTENT_PARTNERS, ACTIVITY_CATEGORIES].forEach(path => {
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
          <Link className={activeLink === ACTIVITY_CATEGORIES ? 'active': ''} to={`${match.path}/${ACTIVITY_CATEGORIES}`}>Activity Categories</Link>
        </div>
      </div>
      <Switch>
        <Route component={Readability} path={`${match.path}/${READABILITY}`} />
        <Route component={Topics} path={`${match.path}/${TOPICS}`} />
        <Route component={ActivityCategories} path={`${match.path}/${ACTIVITY_CATEGORIES}`} />
        <Route component={ContentPartners} path={`${match.path}/${CONTENT_PARTNERS}`} />
        <Route component={Standards} path={`${match.path}/${STANDARDS}`} />
      </Switch>
    </div>
  )
}

export default AttributesManager
