import * as React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import Search from '../../shared/search';
import ChangeLogTable from './changeLogTable';
import RecordColumns from './recordColumns';
import { STANDARD, STANDARD_CATEGORY, STANDARD_LEVEL } from './shared';
import StandardsTable from './standardsTable';

import { requestGet, requestPost, requestPut } from '../../../../../modules/request/index';
import { defaultSnackbarTimeout, Snackbar } from '../../../../Shared/index';

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

  [ARCHIVED, NEW, CHANGE_LOGS].forEach(path => {
    if (location.pathname.includes(path)) {
      activeLink = path
    }
  })

  const recordTypes = [
    {
      recordType: STANDARD_LEVEL,
      records: standardLevels,
      saveChanges: saveStandardLevelChanges,
      createNew: createNewStandardLevel,
      attribute: 'standard_level_id'
    },
    {
      recordType: STANDARD_CATEGORY,
      records: standardCategories,
      saveChanges: saveStandardCategoryChanges,
      createNew: createNewStandardCategory,
      attribute: 'standard_category_id'
    },
    {
      recordType: STANDARD,
      records: standards,
      createNew: createNewStandard,
      saveChanges: saveStandardChanges
    }
  ]

  const sharedProps = {
    path: `${match.path}`,
    searchValue,
    standardLevels,
    standardCategories,
    recordTypes,
    standards
  }

  const allChangeLogs = [...standardChangeLogs, ...standardLevelChangeLogs, ...standardCategoryChangeLogs]

  return (
    <div className="standards-manager">
      <Snackbar text="Changes saved" visible={showSnackbar} />
      <Search placeholder="Search by standard name" searchValue={searchValue} updateSearchValue={setSearchValue} />
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
              {...sharedProps}
              isNew={true}
              visible={true}
            />
          )}
          path={`${match.path}/${NEW}`}
        />
        <Route
          component={() => (
            <RecordColumns
              {...sharedProps}
              visible={false}
            />
          )}
          path={`${match.path}/${ARCHIVED}`}
        />
        <Route
          component={() => (
            <StandardsTable
              {...sharedProps}
              visible={true}
            />
          )}
          path={match.path}
        />
      </Switch>
    </div>
  )
}

export default Standards
