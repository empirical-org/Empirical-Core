import * as React from 'react'
import request from 'request'

import UnitTemplateRow from './unitTemplateRow'

import ItemDropdown from '../../components/general_components/dropdown_selectors/item_dropdown';
import LoadingSpinner from '../../../Connect/components/shared/loading_indicator.jsx'
import { SortableList, } from  '../../../Shared/index'
import getAuthToken from '../../components/modules/get_auth_token'


const UNIT_TEMPLATES_URL = `${process.env.DEFAULT_URL}/cms/unit_templates.json`
const DIAGNOSTICS_URL = `${process.env.DEFAULT_URL}/api/v1/activities/diagnostic_activities.json`
const UPDATE_ORDER_URL = `${process.env.DEFAULT_URL}/cms/unit_templates/update_order_numbers`

const ALL_FLAGS = 'All Flags'
const ALL_DIAGNOSTICS = 'All Diagnostics'

const ARCHIVED_FLAG = 'Archived'
const NOT_ARCHIVED_FLAG = 'Not Archived'
const PRODUCTION_FLAG = 'Production'
const ALPHA_FLAG = 'Alpha'
const BETA_FLAG = 'Beta'
const GAMMA_FLAG = 'Gamma'
const PRIVATE_FLAG = 'Private'
const options = [ALL_FLAGS, NOT_ARCHIVED_FLAG, ARCHIVED_FLAG, ALPHA_FLAG, BETA_FLAG, GAMMA_FLAG, PRODUCTION_FLAG, PRIVATE_FLAG]
const headerHash = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-CSRF-Token': getAuthToken()
}
const ERROR_MESSAGE = 'Failed to fetch activities-- please refresh the page.'

const UnitTemplates = () => {

  const [loadingTableData, setLoadingTableData] = React.useState<boolean>(true);
  const [flag, setFlag] = React.useState<string>(ALL_FLAGS)
  const [fetchedData, setFetchedData] = React.useState<any>([])
  const [activitySearchInput, setActivitySearchInput] = React.useState<string>("")
  const [diagnostics, setDiagnostics] = React.useState<any[]>([])
  const [diagnostic, setDiagnostic] = React.useState<string>(ALL_DIAGNOSTICS)
  const [error, setError] = React.useState<string>(null);

  React.useEffect(() => {
    if (loadingTableData && !diagnostics.length) {
      fetchDiagnosticsData()
    }
  }, [diagnostics])

  React.useEffect(() => {
    if (loadingTableData && !fetchedData.length) {
      fetchUnitTemplatesData()
    }
  }, [fetchedData])

  React.useEffect(() => {
    if (loadingTableData && fetchedData.length && diagnostic.length) {
      setLoadingTableData(false)
    }
  }, [fetchedData, diagnostics])

  function fetchUnitTemplatesData() {
    setLoadingTableData(true)
    request.get({
      url: UNIT_TEMPLATES_URL,
    }, (e, r, body) => {
      if (e || r.statusCode !== 200) {
        setLoadingTableData(false);
        setError(ERROR_MESSAGE)
      } else {
        setError(null);
        const data = JSON.parse(body);
        setFetchedData(data.unit_templates)
      }
    });
  }

  function fetchDiagnosticsData() {
    request.get({
      url: DIAGNOSTICS_URL,
    }, (e, r, body) => {
      if (e || r.statusCode !== 200) {
        setLoadingTableData(false);
        setError(ERROR_MESSAGE)
      } else {
        setError(null);
        const data = JSON.parse(body);
        setDiagnostics(data.diagnostics)
      }
    });
  }

  function updateOrder(sortInfo) {
    if (isSortable()) {
      let orderedData = sort(fetchedData)
      const newOrder = sortInfo.map(item => item.key);
      let count = newOrder.length
      const newOrderedUnitTemplates = orderedData.map((ut) => {
        const newUnitTemplate = ut
        const newIndex = newOrder.findIndex(key => Number(key) === Number(ut.id))
        if (newIndex !== -1) {
          newUnitTemplate['order_number'] = newIndex
        } else {
          newUnitTemplate['order_number'] = count
        }
        count += 1
        return newUnitTemplate
      })

      fetch(UPDATE_ORDER_URL, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({unit_templates: newOrderedUnitTemplates}),
        headers: headerHash,
      }).then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      }).then((response) => {
        alert(`Order for activity packs has been saved.`)
      }).catch((error) => {
        // to do, use Sentry to capture error
      })
      setFetchedData(newOrderedUnitTemplates)
    }

  };

  function orderedUnitTemplates() {
    let filteredData = fetchedData
    if (flag === NOT_ARCHIVED_FLAG) {
      filteredData = fetchedData.filter(data => data.flag !== ARCHIVED_FLAG.toLowerCase())
    } else if (flag !== ALL_FLAGS) {
      filteredData = fetchedData.filter(data => data.flag === flag.toLowerCase())
    }

    if (activitySearchInput !== '') {
      filteredData = filteredData.filter(value => {
        return (
          value.activities && value.activities.map(x => x.name || '').some(y => y.toLowerCase().includes(activitySearchInput.toLowerCase()))
        );
      })
    }

    if (diagnostic !== ALL_DIAGNOSTICS) {
      filteredData = filteredData.filter(value => {
        return (
          value.diagnostic_names && value.diagnostic_names.some(y => y.toLowerCase().includes(diagnostic.toLowerCase()))
        );
      })
    }

    return sort(filteredData)
  }

  function sort (list) {
    return list.sort((bp1, bp2) => {
      // Group archived activities at the bottom of the list (they automatically get a higher order number
      // than any unarchived activity)
      if (bp1.flag.toLowerCase() === ARCHIVED_FLAG && bp2.flag.toLowerCase() !== ARCHIVED_FLAG) {
        return 1
      } else if (bp2.flag.toLowerCase() === ARCHIVED_FLAG && bp1.flag.toLowerCase() !== ARCHIVED_FLAG) {
        return -1
      }
      return bp1.order_number - bp2.order_number
    })
  }

  function onDelete(id) {
    const link = `${process.env.DEFAULT_URL}/cms/unit_templates/${id}`
    fetch(link, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': getAuthToken()
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      alert(`Activity pack was deleted.`)
      const updatedActivities = [...fetchedData].filter(activity => activity.id !== id);
      setFetchedData(updatedActivities);
    }).catch((error) => {
      // to do, use Sentry to capture error
    })
  }

  function updateUnitTemplate(unitTemplate) {
    const newUnitTemplate = unitTemplate
    newUnitTemplate.unit_template_category_id = unitTemplate.unit_template_category.id
    newUnitTemplate.activity_ids = unitTemplate.activity_ids || unitTemplate.activities.map((a) => a.id)
    const link = `${process.env.DEFAULT_URL}/cms/unit_templates/${unitTemplate.id}.json`
    const index = fetchedData.findIndex((e) => e.id === unitTemplate.id)
    fetch(link, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({unit_template: newUnitTemplate}),
      headers: headerHash,
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }).then((response) => {
      const newData = [...fetchedData]
      newData[index] = response.unit_template
      setFetchedData(newData)
      alert('Activity Pack has been saved.')
    }).catch((error) => {
      // to do, use Sentry to capture error
    })
  }

  function renderTableRow(unitTemplate) {
    return (
      <UnitTemplateRow
        handleDelete={onDelete}
        unitTemplate={unitTemplate}
        updateUnitTemplate={updateUnitTemplate}
      />
    )
  }

  function renderActivitiesTable() {
    const dataToUse = orderedUnitTemplates()
    const unitTemplateRows = dataToUse.map((ut) => renderTableRow(ut))
    return(
      <div className="blog-post-table">
        <table>
          {renderTableHeader()}
          <SortableList data={unitTemplateRows} sortCallback={updateOrder} />
        </table>
      </div>
    )
  }

  function renderTableHeader() {
    return (
      <tr className="unit-template-headers">
        <th className="name-col">Name</th>
        <th className="flag-col">Flag</th>
        <th className="diagnostics-col">Diagnostics</th>
        <th className="category-col">Category</th>
      </tr>
    )
  }

  function switchDiagnostic(diagnostic) {
    setDiagnostic(diagnostic)
  }

  function diagnosticsDropdown() {
    let diagnostic_names = diagnostics.filter(d => d.data && d.data["flag"] !== ARCHIVED_FLAG.toLowerCase()).map((d) => d.name)
    diagnostic_names.push(ALL_DIAGNOSTICS)
    return (
      <ItemDropdown
        callback={switchDiagnostic}
        items={diagnostic_names}
        selectedItem={diagnostic}
      />
    )
  }

  function handleSearchByActivity(e) {
    setActivitySearchInput(e.target.value)
  }

  function switchFlag(flag) {
    setFlag(flag)
  }

  function isSortable() {
    if(flag && ![ALL_FLAGS, NOT_ARCHIVED_FLAG, PRODUCTION_FLAG].includes(flag)) { return false }
    if (activitySearchInput !== '') { return false}
    if (diagnostic !== ALL_DIAGNOSTICS) { return false}
    return true
  };

  function newUnitTemplate() {
    window.open(`unit_templates/new`, '_blank')
  }

  const renderTable = !loadingTableData && fetchedData.length !== 0;

  return (
    <div className="cms-unit-templates">
      <div className="standard-columns">
        <button className='button-green button-top' onClick={newUnitTemplate} type="button">New</button>
        <div className="unit-template-inputs">
          <input
            aria-label="Search by activity"
            className="search-box"
            name="searchInput"
            onChange={handleSearchByActivity}
            placeholder="Search by activity"
            value={activitySearchInput || ""}
          />
          <div className="unit-template-dropdowns">
            <ItemDropdown
              callback={switchFlag}
              items={options}
              selectedItem={flag}
            />
            {diagnosticsDropdown()}
          </div>
        </div>
        {renderTable && renderActivitiesTable()}
        {loadingTableData && <LoadingSpinner />}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  )
}

export default UnitTemplates
