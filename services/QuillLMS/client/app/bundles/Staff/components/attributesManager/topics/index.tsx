import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import Search from '../../shared/search';
import ChangeLogTable from './changeLogTable';
import TopicColumns from './topicColumns';

import { requestGet, requestPost, requestPut } from '../../../../../modules/request/index';
import { defaultSnackbarTimeout, Snackbar } from '../../../../Shared/index';

const ARCHIVED = 'archived'
const NEW = 'new'
const CHANGE_LOGS = 'change_logs'

const Topics = ({ match, location, }) => {
  const [topics, setTopics] = React.useState([])
  const [changeLogs, setChangeLogs] = React.useState([])
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
        setChangeLogs(data.change_logs)
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

  function createNewTopic(topic) {
    requestPost(`/cms/topics`, { topic, },
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

  if (location.pathname.includes(NEW)) {
    activeLink = NEW
  }

  if (location.pathname.includes(CHANGE_LOGS)) {
    activeLink = CHANGE_LOGS
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
      <Search placeholder="Search by topic name" searchValue={searchValue} updateSearchValue={setSearchValue} />
      <div className="cms-tabs">
        <Link className={activeLink ? '': 'active'} to={`${match.path}`}>Live</Link>
        <Link className={activeLink === NEW ? 'active': ''} to={`${match.path}/${NEW}`}>Add Topics</Link>
        <Link className={activeLink === ARCHIVED ? 'active': ''} to={`${match.path}/${ARCHIVED}`}>Archived</Link>
        <Link className={activeLink === CHANGE_LOGS ? 'active': ''} to={`${match.path}/${CHANGE_LOGS}`}>Change Logs</Link>
      </div>
      <Switch>
        <Route
          component={() => (
            <ChangeLogTable
              changeLogs={changeLogs}
            />
          )}
          path={`${match.path}/${CHANGE_LOGS}`}
        />
        <Route
          component={() => (
            <TopicColumns
              {...sharedTopicColumnProps}
              createNewTopic={createNewTopic}
              visible={true}
            />
          )}
          path={`${match.path}/${NEW}`}
        />
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
