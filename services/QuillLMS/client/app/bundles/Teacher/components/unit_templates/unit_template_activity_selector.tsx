import * as React from 'react'
import request from 'request';

import UnitTemplateActivityDataRow from './unit_template_activity_data_row'

import { FlagDropdown, SortableList } from '../../../Shared/index'
import Pagination from '../../../Teacher/components/assignment_flow/create_unit/custom_activity_pack/pagination'
import { lowerBound, upperBound, } from '../../../Teacher/components/assignment_flow/create_unit/custom_activity_pack/shared'

const ACTIVITIES_URL = `${process.env.DEFAULT_URL}/activities/index_with_unit_templates`
const DEFAULT_FLAG = 'All Flags'
const DEFAULT_TOOL = 'All Tools'
const DEFAULT_READABILITY = 'All Readability levels'
const TOOL_OPTIONS = [
  'All Tools',
  'Quill Connect',
  'Quill Grammar',
  'Quill Proofreader',
  'Quill Evidence',
  'Quill Lessons',
  'Quill Diagnostic'
]
const UNSELECTED_TYPE = 'unselected'
const SELECTED_TYPE = 'selected'

const UnitTemplateActivitySelector = ({ parentActivities, setParentActivities, toggleParentActivity }) => {

  const [activities, setActivities] = React.useState([])
  const [selectedActivities, setSelectedActivities] = React.useState(parentActivities)
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [nameSearch, setNameSearch] = React.useState('')
  const [descriptionSearch, setDescriptionSearch] = React.useState('')
  const [ccssSearch, setCCSSSearch] = React.useState('')
  const [conceptSearch, setConceptSearch] = React.useState('')
  const [activityPacksSearch, setActivityPacksSearch] = React.useState('')
  const [flagSearch, setFlagSearch] = React.useState(DEFAULT_FLAG)
  const [toolSearch, setToolSearch] = React.useState(DEFAULT_TOOL)
  const [readabilitySearch, setReadabilitySearch] = React.useState(DEFAULT_READABILITY)
  const [readabilityOptions, setReadabilityOptions] = React.useState([])

  React.useEffect(() => {
    if (loading) { getActivities() }
  }, []);

  function getActivities() {
    request.get({
      url: ACTIVITIES_URL,
    }, (e, r, body) => {
      if (e || r.statusCode !== 200) {
        setLoading(false)
      } else {
        const data = JSON.parse(body);
        setLoading(false)
        setActivities(data.activities);

        const readArr = data.activities.map(act => act.readability_grade_level)
        const readUnique = Array.from(new Set(readArr))
        const readFiltered = readUnique.filter(c => c !== '' && c !== null).sort()
        readFiltered.push(DEFAULT_READABILITY)
        setReadabilityOptions(readFiltered)
      }
    })
  }

  function getFilteredActivities() {
    return activities.filter(act => {
      return (
        (nameSearch === '' || (act.name && act.name.toLowerCase().includes(nameSearch.toLowerCase()))) &&
        (descriptionSearch === '' || (act.description && act.description.toLowerCase().includes(descriptionSearch.toLowerCase()))) &&
        (ccssSearch === '' || (act.standard && act.standard.name.toLowerCase().includes(ccssSearch.toLowerCase()))) &&
        (conceptSearch === '' || (act.activity_category && act.activity_category.name.toLowerCase().includes(conceptSearch.toLowerCase()))) &&
        (activityPacksSearch === '' || (act.unit_template_names && act.unit_template_names.some(ut => ut.toLowerCase().includes(activityPacksSearch.toLowerCase())))) &&
        (flagSearch === DEFAULT_FLAG || (act.data && act.data['flag'] && act.data['flag'] === flagSearch)) &&
        (toolSearch === DEFAULT_TOOL || (act.classification && act.classification.key === toolSearch)) &&
        (readabilitySearch === DEFAULT_READABILITY || (act.readability_grade_level && act.readability_grade_level === readabilitySearch)) &&
        (selectedActivities.length === 0 || !selectedActivities.map(a => a.id).includes(act.id))
      );
    })
  }

  function currentPageActivities() {
    return getFilteredActivities().slice(lowerBound(currentPage), upperBound(currentPage))
  }

  function findAndToggleParentActivity(activity) {
    toggleParentActivity(activity)
  }

  function handleAddActivity(activity) {
    findAndToggleParentActivity(activity)
    const newSelectedActivities = selectedActivities.slice()
    newSelectedActivities.push(activity)
    setSelectedActivities(newSelectedActivities)
  }

  function handleRemoveActivity(activity) {
    findAndToggleParentActivity(activity)
    const newSelectedActivities = selectedActivities.filter(a => a.id !== activity.id)
    setSelectedActivities(newSelectedActivities)
  }

  const tableHeaders = (
    <tr className="ut-activities-headers">
      <th className="ut-break">&nbsp;</th>
      <th className="ut-break">&nbsp;</th>
      <th className="ut-name-col">Name</th>
      <th className="ut-flag-col">Flag</th>
      <th className="ut-readability-col">Readability</th>
      <th className="ut-ccss-col">CCSS</th>
      <th className="ut-concept-col">Concept</th>
      <th className="ut-tool-col">Tool</th>
    </tr>
  )


  const activityRows = currentPageActivities().map((act) => {
    return (
      <UnitTemplateActivityDataRow
        activity={act}
        handleAdd={handleAddActivity}
        handleRemove={handleRemoveActivity}
        key={act.id}
        type={UNSELECTED_TYPE}
      />
    )
  })

  function handleNameSearch(e) {
    setNameSearch(e.target.value)
  }

  function handleDescriptionSearch(e) {
    setDescriptionSearch(e.target.value)
  }

  function handleCCSSSearch(e) {
    setCCSSSearch(e.target.value)
  }

  function handleConceptSearch(e) {
    setConceptSearch(e.target.value)
  }

  function handleActivityPacksSearch(e) {
    setActivityPacksSearch(e.target.value)
  }

  function handleFlagSearch(e) {
    setFlagSearch(e.target.value)
  }

  function handleToolSearch(e) {
    setToolSearch(e.target.value)
  }

  function handleReadabilitySearch(e) {
    setReadabilitySearch(e.target.value)
  }

  function updateOrder(sortInfo) {
    const sortedIds = sortInfo.map(s => s.key)
    const newOrderedActivities = sortedIds.map((s) => activities.find((a) => a.id === parseInt(s)))
    setSelectedActivities(newOrderedActivities)

    const selectedParentActivities = newOrderedActivities.map(act => parentActivities.find(a => a.id === act.id))
    setParentActivities(selectedParentActivities)
  }

  function selectedActivitiesTable() {
    const fullSelectedActivities = activities.length > 0 ? selectedActivities.map((act) => activities.find(a => act.id === a.id)) : []
    const rows = fullSelectedActivities.map((act) => {
      return (
        <UnitTemplateActivityDataRow
          activity={act}
          handleAdd={handleAddActivity}
          handleRemove={handleRemoveActivity}
          key={act.id}
          type={SELECTED_TYPE}
        />
      )
    })
    return (
      <div className="unit-template-activities-table unit-template-selected-activities-table">
        <h4 className="selected-activities-header">Selected Activities:</h4>
        <table className="unit-template-activities-table-rows">
          {tableHeaders}
          <tbody className="unit-template-activities-tbody">
            <SortableList data={rows} sortCallback={updateOrder} />
            {}
          </tbody>
        </table>
      </div>
    )
  }

  const filterInputs = (
    <div className="unit-template-filters">
      <input
        aria-label="Search by name"
        className="name-search-box"
        name="nameInput"
        onChange={handleNameSearch}
        placeholder="Search by name"
        value={nameSearch || ""}
      />
      <input
        aria-label="Search by description"
        className="description-search-box"
        name="descriptionInput"
        onChange={handleDescriptionSearch}
        placeholder="Search by description"
        value={descriptionSearch || ""}
      />
      <input
        aria-label="Search by CCSS"
        className="ccss-search-box"
        name="ccssInput"
        onChange={handleCCSSSearch}
        placeholder="Search by CCSS"
        value={ccssSearch || ""}
      />
      <input
        aria-label="Search by concept"
        className="concept-search-box"
        name="conceptInput"
        onChange={handleConceptSearch}
        placeholder="Search by concept"
        value={conceptSearch || ""}
      />
      <input
        aria-label="Search by activity pack"
        className="activity-packs-search-box"
        name="activityPacksInput"
        onChange={handleActivityPacksSearch}
        placeholder="Search by activity pack"
        value={activityPacksSearch || ""}
      />
      <div className="unit-template-dropdown-filters">
        <FlagDropdown
          flag={flagSearch}
          handleFlagChange={handleFlagSearch}
          isLessons={true}
        />
        <span className="tool-dropdown select is-large">
          <select onChange={handleToolSearch} value={toolSearch}>
            {TOOL_OPTIONS.map(key => <option key={key} value={key}>{key}</option>)}
          </select>
        </span>
        <span className="readability-dropdown select is-large">
          <select onChange={handleReadabilitySearch} value={readabilitySearch}>
            {readabilityOptions.map(key => <option key={key} value={key}>{key}</option>)}
          </select>
        </span>
      </div>


    </div>
  )

  return (
    <div className="unit-template-activities">
      <h3>Activities in Pack:</h3>
      {selectedActivitiesTable()}
      <h4>All Activities:</h4>
      {filterInputs}
      <div className="unit-template-activities-table">
        {tableHeaders}
        <table className="unit-template-activities-table-rows">
          <tbody className="unit-template-activities-tbody">
            {activityRows}
          </tbody>
        </table>
      </div>
      <Pagination activities={getFilteredActivities()} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default UnitTemplateActivitySelector
