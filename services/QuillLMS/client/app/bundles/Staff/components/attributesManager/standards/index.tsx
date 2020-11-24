import * as React from 'react'
import { Route, Switch, Link, } from 'react-router-dom';

import RecordColumns from './recordColumns'
import ChangeLogTable from './changeLogTable'
import StandardSearch from './standardSearch'
import { STANDARD, } from './constants'

import { Snackbar, defaultSnackbarTimeout } from '../../../../Shared/index'
import { requestGet, requestPut, requestPost, } from '../../../../../modules/request/index'

const ARCHIVED = 'archived'
const NEW = 'new'
const CHANGE_LOGS = 'change_logs'

const Standards = ({ match, location, }) => {
  const [standards, setStandards] = React.useState([])
  const [standardChangeLogs, setStandardChangeLogs] = React.useState([])
  const [standardLevels, setStandardLevels] = React.useState([])
  const [standardLevelChangeLogs, setStandardLevelChangeLogs] = React.useState([])
  const [standardCategories, setStandardCategories] = React.useState([])
  const [standardCategoryChangeLogs, setStandardCategoryChangeLogs] = React.useState([])
  const [searchValue, setSearchValue] = React.useState('')
  const [showSnackbar, setShowSnackbar] = React.useState(false)

  React.useEffect(() => {
    getInitialData();
  }, []);

  React.useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout)
    }
  }, [showSnackbar])

  function getInitialData() {
    getStandards()
    getStandardLevels()
    getStandardCategories()
  }

  function getStandards() {
    requestGet('/cms/standards',
      (data) => {
        setStandards(data.standards);
        setStandardChangeLogs(data.change_logs)
      }
    )
  }

  function getStandardLevels() {
    requestGet('/cms/standard_levels',
      (data) => {
        setStandardLevels(data.standard_levels);
        setStandardLevelChangeLogs(data.change_logs)
      }
    )
  }

  function getStandardCategories() {
    requestGet('/cms/standard_categories',
      (data) => {
        setStandardCategories(data.standard_categories);
        setStandardCategoryChangeLogs(data.change_logs)
      }
    )
  }

  function saveStandardChanges(standard) {
    requestPut(`/cms/standards/${standard.id}`, { standard, },
      (data) => {
        getInitialData()
        setShowSnackbar(true)
      }
    )
  }

  function saveStandardLevelChanges(standardLevel) {
    requestPut(`/cms/standard_levels/${standardLevel.id}`, { standard_level: standardLevel, },
      (data) => {
        getInitialData()
        setShowSnackbar(true)
      }
    )
  }

  function saveStandardCategoryChanges(standardCategory) {
    requestPut(`/cms/standard_categories/${standardCategory.id}`, { standard_category: standardCategory, },
      (data) => {
        getInitialData()
        setShowSnackbar(true)
      }
    )
  }

  function createNewStandard(standard) {
    requestPost(`/cms/standards`, { standard, },
      (data) => {
        getInitialData()
        setShowSnackbar(true)
      }
    )
  }

  function createNewStandardCategory(standardCategory) {
    requestPost(`/cms/standard_categories`, { standard_category: standardCategory, },
      (data) => {
        getInitialData()
        setShowSnackbar(true)
      }
    )
  }

  function createNewStandardLevel(standardLevel) {
    requestPost(`/cms/standard_levels`, { standard_level: standardLevel, },
      (data) => {
        getInitialData()
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

  const recordTypes = [
    {
      recordType: 'Standard Level',
      records: standardLevels,
      saveChanges: saveStandardLevelChanges,
    },
    {
      recordType: 'Standard Category',
      records: standardCategories,
      saveChanges: saveStandardCategoryChanges,
    },
    {
      recordType: STANDARD,
      records: standards,
      saveChanges: saveStandardChanges
    }
  ]

  const sharedRecordColumnProps = {
    path: `${match.path}`,
    searchValue,
    standardLevels,
    standardCategories,
    recordTypes
  }

  const allChangeLogs = [...standardChangeLogs, ...standardLevelChangeLogs, ...standardCategoryChangeLogs]

  return (
    <div className="standards-manager">
      <Snackbar text="Changes saved" visible={showSnackbar} />
      <StandardSearch updateSearchValue={setSearchValue} />
      <div className="cms-tabs">
        <Link className={activeLink ? '': 'active'} to={`${match.path}`}>Live</Link>
        <Link className={activeLink === NEW ? 'active': ''} to={`${match.path}/${NEW}`}>Add Standards</Link>
        <Link className={activeLink === ARCHIVED ? 'active': ''} to={`${match.path}/${ARCHIVED}`}>Archived</Link>
        <Link className={activeLink === CHANGE_LOGS ? 'active': ''} to={`${match.path}/${CHANGE_LOGS}`}>Change Logs</Link>
      </div>
      <Switch>
        <Route
          component={() => (
            <ChangeLogTable
              changeLogs={allChangeLogs}
            />
          )}
          path={`${match.path}/${CHANGE_LOGS}`}
        />
        <Route
          component={() => (
            <RecordColumns
              {...sharedRecordColumnProps}
              isNew={true}
              visible={true}
            />
          )}
          path={`${match.path}/${NEW}`}
        />
        <Route
          component={() => (
            <RecordColumns
              {...sharedRecordColumnProps}
              visible={false}
            />
          )}
          path={`${match.path}/${ARCHIVED}`}
        />
      </Switch>
    </div>
  )
}

export default Standards
