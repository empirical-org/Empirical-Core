import * as React from 'react'
import { Route, Switch, Link, } from 'react-router-dom';

import TopicColumns from './topicColumns'
import TopicSearch from './topicSearch'

import { Snackbar, defaultSnackbarTimeout } from '../../../../Shared/index'
import { requestGet, requestPut, } from '../../../../../modules/request/index'

const ARCHIVED = 'archived'

const Topics = ({ match, location, }) => {
  const [topics, setTopics] = React.useState([])
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
        setTopics(data.topics);
      }
    )
  }

  function saveTopicChanges(topic) {

    requestPut(`/cms/topics/${topic.id}`, { topic, },
      (data) => {
        getTopics()
        setShowSnackbar(true)
      }
    )
  }

  let activeLink

  if (location.pathname.includes(ARCHIVED)) {
    activeLink = ARCHIVED
  }

  const sharedTopicColumnProps = {
    path: `${match.path}`,
    saveTopicChanges,
    searchValue,
    topics,
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
        <Route
          component={() => (
            <TopicColumns
              {...sharedTopicColumnProps}
              visible={false}
            />
          )}
          path={`${match.path}/${ARCHIVED}`}
        />
        <Route
          component={() => (
            <TopicColumns
              {...sharedTopicColumnProps}
              visible={true}
            />
          )}
          path={match.path}
        />
      </Switch>
    </div>
  )
}

export default Topics
