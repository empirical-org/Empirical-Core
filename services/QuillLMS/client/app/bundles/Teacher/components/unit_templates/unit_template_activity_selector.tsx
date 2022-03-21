import * as React from 'react'
import request from 'request';

import UnitTemplateActivityDataRow from './unit_template_activity_data_row'

import { FlagDropdown, SortableList } from '../../../Shared/index'
import Pagination from '../../../Teacher/components/assignment_flow/create_unit/custom_activity_pack/pagination'
import { lowerBound, upperBound, } from '../../../Teacher/components/assignment_flow/create_unit/custom_activity_pack/shared'

const ACTIVITIES_URL = `${process.env.DEFAULT_URL}/activities/index_with_unit_templates`
const DEFAULT_FLAG = 'All Flags'
const DEFAULT_TOOL = 'All Tools'
const DEFAULT_READABILITY = 'All readability levels'
const TOOL_OPTIONS = [
  'All Tools',
  'Quill Connect',
  'Quill Grammar',
  'Quill Proofreader',
  'Quill Reading for Evidence',
  'Quill Lessons',
  'Quill Diagnostic'
]
const UNSELECTED_TYPE = 'unselected'
const SELECTED_TYPE = 'selected'

const UnitTemplateActivitySelector = ({ parentActivities, setParentActivities, toggleParentActivity }) => {

  const [activities, setActivities] = React.useState<Array<any>>([])
  const [selectedActivities, setSelectedActivities] = React.useState<Array<any>>(parentActivities)
  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentPage, setCurrentPage] = React.useState<Number>(1);
  const [nameSearch, setNameSearch] = React.useState<string>('')
  const [descriptionSearch, setDescriptionSearch] = React.useState<string>('')
  const [conceptSearch, setConceptSearch] = React.useState<string>('')
  const [activityPacksSearch, setActivityPacksSearch] = React.useState<string>('')
  const [flagSearch, setFlagSearch] = React.useState<string>(DEFAULT_FLAG)
  const [toolSearch, setToolSearch] = React.useState<string>(DEFAULT_TOOL)
  const [readabilitySearch, setReadabilitySearch] = React.useState<string>(DEFAULT_READABILITY)
  const [readabilityOptions, setReadabilityOptions] = React.useState<Array<any>>([])
  const [showNoActivityPacks, setShowNoActivityPacks] = React.useState<boolean>(false)

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
      const nameMatch = nameSearch === '' || (act.name && act.name.toLowerCase().includes(nameSearch.toLowerCase()))
      const descriptionMatch = descriptionSearch === '' || (act.description && act.description.toLowerCase().includes(descriptionSearch.toLowerCase()))
      const conceptMatch = conceptSearch === '' || (act.activity_category && act.activity_category.name.toLowerCase().includes(conceptSearch.toLowerCase()))
      const activityPackMatch = activityPacksSearch === '' || (act.unit_template_names && act.unit_template_names.some(ut => ut.toLowerCase().includes(activityPacksSearch.toLowerCase())))
      const flagMatch = flagSearch === DEFAULT_FLAG || (act.data && act.data['flag'] && act.data['flag'] === flagSearch)
      const toolMatch = toolSearch === DEFAULT_TOOL || (act.classification && act.classification.name === toolSearch)
      const readabilityMatch = readabilitySearch === DEFAULT_READABILITY || (act.readability_grade_level && act.readability_grade_level === readabilitySearch)
      const selectedActivitiesMatch = selectedActivities.length === 0 || !selectedActivities.map(a => a.id).includes(act.id)
      const showNoActivityPacksMatch = showNoActivityPacks === false || (act.unit_template_names && act.unit_template_names.length === 0)
      return (
        nameMatch && descriptionMatch && conceptMatch && activityPackMatch &&
        flagMatch && toolMatch && readabilityMatch && selectedActivitiesMatch && showNoActivityPacksMatch
      );
    })
  }

  function currentPageActivities() {
    return getFilteredActivities().slice(lowerBound(currentPage), upperBound(currentPage))
  }

  function handleAddActivity(activity) {
    toggleParentActivity(activity)
    const newSelectedActivities = selectedActivities.slice()
    newSelectedActivities.push(activity)
    setSelectedActivities(newSelectedActivities)
  }

  function handleRemoveActivity(activity) {
    toggleParentActivity(activity)
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
      <th className="ut-concept-col">Concept</th>
      <th className="ut-tool-col">Tool</th>
    </tr>
  )


  const activityRows = currentPageActivities().map((act) => {
    return (
      <div>
        <UnitTemplateActivityDataRow
          activity={act}
          handleAdd={handleAddActivity}
          handleRemove={handleRemoveActivity}
          key={act.id}
          type={UNSELECTED_TYPE}
        />
      </div>
    )
  })

  function handleNameSearch(e) {
    setNameSearch(e.target.value)
  }

  function handleDescriptionSearch(e) {
    setDescriptionSearch(e.target.value)
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

  function toggleShowNoActivityPacks() {
    setShowNoActivityPacks(!showNoActivityPacks)
  }

  function selectedActivitiesTable() {
    const fullSelectedActivities = activities.length ? selectedActivities.map((act) => activities.find(a => act.id === a.id)) : []
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
        <input aria-label="filter for activities without activity packs" id="no-activity-packs" name="no-activity-packs" onChange={toggleShowNoActivityPacks} type="checkbox" value="no-activity-packs" />
        <label className="no-activity-packs-label" htmlFor="no-activity-packs">Only show activities without activity packs</label>
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
        <table className="unit-template-activities-table-rows">
          {tableHeaders}
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
