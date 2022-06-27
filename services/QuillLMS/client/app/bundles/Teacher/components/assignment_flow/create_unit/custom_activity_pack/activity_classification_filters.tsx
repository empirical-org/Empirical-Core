import * as React from 'react';

import { Activity, ActivityClassification } from './interfaces'
import { activityClassificationGroupings, ACTIVITY_CLASSIFICATION_FILTERS, SAVED_ACTIVITY_FILTERS } from './shared'

const dropdownIconSrc = `${process.env.CDN_URL}/images/icons/dropdown.svg`
const indeterminateSrc = `${process.env.CDN_URL}/images/icons/indeterminate.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface Grouping {
  keys: string[],
  group: string
}

interface IndividualActivityClassificationFilterRowProps {
  activityClassificationFilters: string[],
  activityClassificationKey: string,
  handleActivityClassificationFilterChange: (activityClassificationFilters: string[]) => void,
  uniqueActivityClassifications: ActivityClassification[],
  filteredActivities: Activity[],
}

interface ActivityClassificationToggleProps {
  filteredActivities: Activity[],
  grouping: Grouping,
  uniqueActivityClassifications: ActivityClassification[],
  activityClassificationFilters: string[],
  handleActivityClassificationFilterChange: (activityClassificationFilters: string[]) => void,
  savedActivityFilters: number[],
  handleSavedActivityFilterChange: () => void,
}

interface ActivityClassificationFiltersProps {
  activities: Activity[],
  filterActivities: (ignoredKey?: string) => Activity[]
  activityClassificationFilters: string[],
  handleActivityClassificationFilterChange: (activityClassificationFilters: string[]) => void,
  handleSavedActivityFilterChange: () => void,
  savedActivityFilters: number[],
  savedActivityIds: number[],
  showComprehension: boolean
}

const IndividualActivityClassificationFilterRow = ({ activityClassificationFilters, activityClassificationKey, handleActivityClassificationFilterChange, uniqueActivityClassifications, filteredActivities, }: IndividualActivityClassificationFilterRowProps) => {
  function checkIndividualFilter() {
    const newActivityClassificationFilters = Array.from(new Set(activityClassificationFilters.concat([activityClassificationKey])))
    handleActivityClassificationFilterChange(newActivityClassificationFilters)
  }

  function uncheckIndividualFilter() {
    const newActivityClassificationFilters = activityClassificationFilters.filter(k => k !== activityClassificationKey)
    handleActivityClassificationFilterChange(newActivityClassificationFilters)
  }

  const activityClassification = uniqueActivityClassifications.find(ac => ac.key === activityClassificationKey)

  if (!activityClassification) { return <span /> }

  const activityCount = filteredActivities.filter(act => activityClassificationKey === act.activity_classification.key).length
  let checkbox = <button aria-label={`Check ${activityClassification.alias}`} className="focus-on-light quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

  if (activityCount === 0) {
    checkbox = <div aria-label={`Check ${activityClassification.alias}`} className="focus-on-light quill-checkbox disabled" />
  } else if (activityClassificationFilters.includes(activityClassificationKey)) {
    checkbox = (<button aria-label={`Uncheck ${activityClassification.alias}`} className="focus-on-light quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  return (
    <div className="individual-row filter-row" key={activityClassificationKey}>
      <div>
        {checkbox}
        <div className="activity-classification-data">
          <span>{activityClassification.alias}</span>
          <span className="description">{activityClassification.description}</span>
          <span className="grade-text">{activityClassification.gradeText}</span>
          {activityClassification.new && <div className="activity-classification-new-tag">NEW</div>}
        </div>
      </div>
      <span>({activityCount})</span>
    </div>
  )
}

const ActivityClassificationToggle = ({filteredActivities, grouping, uniqueActivityClassifications, activityClassificationFilters, handleActivityClassificationFilterChange, }: ActivityClassificationToggleProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  function toggleIsOpen() { setIsOpen(!isOpen) }

  function uncheckAllFilters() {
    const newActivityClassificationFilters = activityClassificationFilters.filter(key => !grouping.keys.includes(key))
    handleActivityClassificationFilterChange(newActivityClassificationFilters)
  }

  function checkAllFilters() {
    const newActivityClassificationFilters = Array.from(new Set(activityClassificationFilters.concat(grouping.keys)))
    handleActivityClassificationFilterChange(newActivityClassificationFilters)
    setIsOpen(true)
  }

  const toggleArrow = <button aria-label="Toggle menu" className="interactive-wrapper focus-on-light filter-toggle-button" onClick={toggleIsOpen} type="button"><img alt="" className={isOpen ? 'is-open' : 'is-closed'} src={dropdownIconSrc} /></button>
  let topLevelCheckbox = <button aria-label="Check all nested filters" className="focus-on-light quill-checkbox unselected" onClick={checkAllFilters} type="button" />

  const topLevelActivityCount = filteredActivities.filter(act => grouping.keys.includes(act.activity_classification.key)).length

  if (topLevelActivityCount === 0) {
    topLevelCheckbox = <div className="focus-on-light quill-checkbox disabled" />
  } else if (grouping.keys.every(key => activityClassificationFilters.includes(key))) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="focus-on-light quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  } else if (grouping.keys.some(key => activityClassificationFilters.includes(key))) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="focus-on-light quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Indeterminate checkbox" src={indeterminateSrc} />
    </button>)
  }

  let individualFilters = <span />
  if (isOpen) {
    individualFilters = grouping.keys.map((key: string) =>
      (<IndividualActivityClassificationFilterRow
        activityClassificationFilters={activityClassificationFilters}
        activityClassificationKey={key}
        filteredActivities={filteredActivities}
        handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
        key={key}
        uniqueActivityClassifications={uniqueActivityClassifications}
      />)
    )
  }

  return (
    <section className="toggle-section activity-classification-toggle">
      <div className="top-level filter-row">
        <div>
          {toggleArrow}
          {topLevelCheckbox}
          <span>{grouping.group}</span>
        </div>
        <span>({topLevelActivityCount})</span>
      </div>
      {grouping.new && <div className="activity-classification-new-tag">NEW</div>}
      {individualFilters}
    </section>
  )
}

const SavedRow = ({ savedActivityFilters, handleSavedActivityFilterChange, savedActivityIds, filterActivities, }) => {
  const filteredActivities = filterActivities(SAVED_ACTIVITY_FILTERS)
  const activityCount = filteredActivities.filter(act => savedActivityIds.includes(act.id)).length

  let checkbox = <button aria-label="Check Saved" className="focus-on-light quill-checkbox unselected" onClick={handleSavedActivityFilterChange} type="button" />

  if (activityCount === 0) {
    checkbox = <div aria-label="Check Saved" className="focus-on-light quill-checkbox disabled" />
  } else if (savedActivityFilters.length) {
    checkbox = (<button aria-label="Uncheck Saved" className="focus-on-light quill-checkbox selected" onClick={handleSavedActivityFilterChange} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  return (
    <div className="individual-row filter-row saved-row">
      <div>
        {checkbox}
        <span>Saved</span>
      </div>
      <span>({activityCount})</span>
    </div>
  )
}

const ActivityClassificationFilters = ({
  activities,
  filterActivities,
  activityClassificationFilters,
  handleActivityClassificationFilterChange,
  handleSavedActivityFilterChange,
  savedActivityFilters,
  savedActivityIds,
  showComprehension
}: ActivityClassificationFiltersProps) => {

  const allActivityClassifications = activities.map(a => a.activity_classification)
  const uniqueActivityClassificationIds = Array.from(new Set(allActivityClassifications.map(a => a.id)))
  const uniqueActivityClassifications = uniqueActivityClassificationIds.map(id => allActivityClassifications.find(ac => ac.id === id))

  function clearAllActivityClassificationFilters() { handleActivityClassificationFilterChange([]) }

  const filteredActivities = filterActivities(ACTIVITY_CLASSIFICATION_FILTERS)

  const activityClassificationToggles = activityClassificationGroupings(showComprehension).map(grouping =>
    (<ActivityClassificationToggle
      activityClassificationFilters={activityClassificationFilters}
      filteredActivities={filteredActivities}
      grouping={grouping}
      handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
      key={grouping.group}
      uniqueActivityClassifications={uniqueActivityClassifications}
    />)
  )
  const clearButton = activityClassificationFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllActivityClassificationFilters} type="button">Clear</button> : <span />
  return (
    <section className="filter-section">
      <div className="name-and-clear-wrapper">
        <h2>Activities</h2>
        {clearButton}
      </div>
      <SavedRow
        filterActivities={filterActivities}
        handleSavedActivityFilterChange={handleSavedActivityFilterChange}
        savedActivityFilters={savedActivityFilters}
        savedActivityIds={savedActivityIds}
      />
      {activityClassificationToggles}
    </section>
  )
}

export default ActivityClassificationFilters
