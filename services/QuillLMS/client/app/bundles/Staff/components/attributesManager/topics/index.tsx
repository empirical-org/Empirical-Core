import * as React from 'react'
import { Route, Switch, Link, } from 'react-router-dom';

import LiveTopics from './liveTopics'
import TopicSearch from './topicSearch'

import { Snackbar, defaultSnackbarTimeout } from '../../../../Shared/index'
import { requestGet, requestPut, } from '../../../../../modules/request/index'

const ARCHIVED = 'archived'

const Topics = ({ match, location, }) => {
  const [liveTopics, setLiveTopics] = React.useState([])
  const [archivedTopics, setArchivedTopics] = React.useState([])
  const [searchValue, setSearchValue] = React.useState('')
  const [showSnackbar, setShowSnackbar] = React.useState(false)

  React.useEffect(() => {
    getTopics();
  }, []);

  React.useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout)
    }
  }, [showSnackbar])

  function getTopics() {
    requestGet('/cms/topics',
      (data) => {
        setLiveTopics(data.live_topics);
        setArchivedTopics(data.archived_topics);
      }
    )
  }

  function saveTopicChanges(topic) {

    requestPut(`/cms/topics/${topic.id}`, { topic, },
      (data) => {
        getTopics()
      }
    )
  }

  let activeLink

  if (location.pathname.includes(ARCHIVED)) {
    activeLink = ARCHIVED
  }

  return (
    <div className="topics-manager">
      <Snackbar text="Changes saved" visible={showSnackbar} />
      <TopicSearch updateSearchValue={setSearchValue} />
      <div className="cms-tabs">
        <Link className={activeLink ? '': 'active'} to={`${match.path}`}>Live</Link>
        <Link className={activeLink === ARCHIVED ? 'active': ''} to={`${match.path}/archived`}>Archived</Link>
      </div>
      <Switch>
        <Route component={() => (
          <LiveTopics
            liveTopics={liveTopics}
            path={`${match.path}`}
            saveTopicChanges={saveTopicChanges}
            searchValue={searchValue}
          />)}
        />
      </Switch>
    </div>
  )
}

export default Topics
