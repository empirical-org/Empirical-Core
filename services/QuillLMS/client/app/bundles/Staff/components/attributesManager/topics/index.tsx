import * as React from 'react'
import { Route, Switch, Link, } from 'react-router-dom';

import LiveTopics from './liveTopics'

import { requestGet } from '../../../../../modules/request/index'

const ARCHIVED = 'archived'

const Topics = ({ match, location, }) => {
  const [ liveTopics, setLiveTopics ] = React.useState([])
  const [ archivedTopics, setArchivedTopics ] = React.useState([])

  React.useEffect(() => {
    getTopics();
  }, []);

  function getTopics() {
    requestGet('/cms/topics',
      (data) => {
        setLiveTopics(data.live_topics);
        setArchivedTopics(data.archived_topics);
      }
    )
  }

  let activeLink

  if (location.pathname.includes(ARCHIVED)) {
    activeLink = ARCHIVED
  }

  return (
    <div className="topics-manager">
      <div className="cms-tabs">
        <Link className={activeLink ? '': 'active'} to={`${match.path}`}>Live</Link>
        <Link className={activeLink === ARCHIVED ? 'active': ''} to={`${match.path}/archived`}>Archived</Link>
      </div>
      <Switch>
        <Route component={() => <LiveTopics liveTopics={liveTopics}/>} path={`${match.path}`} />
      </Switch>
    </div>
  )
}

export default Topics
