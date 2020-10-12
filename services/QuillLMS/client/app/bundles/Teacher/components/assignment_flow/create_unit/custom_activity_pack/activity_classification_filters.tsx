import * as React from 'react';

import { Activity, ActivityClassification } from './interfaces'
import { activityClassificationGroupings } from './shared'

const dropdownIconSrc = `${process.env.CDN_URL}/images/icons/dropdown.svg`
const indeterminateSrc = `${process.env.CDN_URL}/images/icons/indeterminate.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface Grouping {
  keys: string[],
  group: string
}

interface IndividualActivityClassificationFilterRow {
  activityClassificationFilters: string[],
  key: string,
  handleActivityClassificationFilterChange: (activityClassificationFilters: string[]) => void,
  uniqueActivityClassifications: ActivityClassification[],
  filteredActivities: Activity[]
}

interface ActivityClassificationToggle {
  filteredActivities: Activity[],
  grouping: Grouping,
  uniqueActivityClassifications: ActivityClassification[],
  activityClassificationFilters: string[],
  handleActivityClassificationFilterChange: (activityClassificationFilters: string[]) => void,
}

interface ActivityClassificationFilters {
  activities: Activity[],
  filteredActivities: Activity[],
  activityClassificationFilters: string[],
  handleActivityClassificationFilterChange: (activityClassificationFilters: string[]) => void,
}

const IndividualActivityClassificationFilterRow = ({ activityClassificationFilters, key, handleActivityClassificationFilterChange, uniqueActivityClassifications, filteredActivities, }: IndividualActivityClassificationFilterRow) => {
  function checkIndividualFilter() {
    const newActivityClassificationFilters = Array.from(new Set(activityClassificationFilters.concat([key])))
    handleActivityClassificationFilterChange(newActivityClassificationFilters)
  }

  function uncheckIndividualFilter() {
    const newActivityClassificationFilters = activityClassificationFilters.filter(k => k !== key)
    handleActivityClassificationFilterChange(newActivityClassificationFilters)
  }

  const activityClassification = uniqueActivityClassifications.find(ac => ac.key === key)
  const activityCount = filteredActivities.filter(act => key === act.activity_classification.key).length
  let checkbox = <button aria-label={`Check ${activityClassification.alias}`} className="quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

  if (activityClassificationFilters.includes(key)) {
    checkbox = (<button aria-label={`Uncheck ${activityClassification.alias}`} className="quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  return (<div className="individual-row filter-row" key={key}>
    <div>
      {checkbox}
      <div className="alias-and-description">
        <span>{activityClassification.alias}</span>
        <span className="description">{activityClassification.description}</span>
      </div>
    </div>
    <span>({activityCount})</span>
  </div>)
}

const ActivityClassificationToggle = ({filteredActivities, grouping, uniqueActivityClassifications, activityClassificationFilters, handleActivityClassificationFilterChange, }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  function toggleIsOpen() { setIsOpen(!isOpen) }

  function uncheckAllFilters() {
    const newActivityClassificationFilters = activityClassificationFilters.filter(key => !grouping.keys.includes(key))
    handleActivityClassificationFilterChange(newActivityClassificationFilters)
  }

  function checkAllFilters() {
    const newActivityClassificationFilters = Array.from(new Set(activityClassificationFilters.concat(grouping.keys)))
    handleActivityClassificationFilterChange(newActivityClassificationFilters)
  }

  const toggleArrow = <button aria-label="Toggle menu" className="interactive-wrapper focus-on-light toggle-button" onClick={toggleIsOpen} type="button"><img alt="" className={isOpen ? 'is-open' : 'is-closed'} src={dropdownIconSrc} /></button>
  let topLevelCheckbox = <button aria-label="Check all nested filters" className="quill-checkbox unselected" onClick={checkAllFilters} type="button" />

  const topLevelActivityCount = filteredActivities.filter(act => grouping.keys.includes(act.activity_classification.key)).length

  if (grouping.keys.every(key => activityClassificationFilters.includes(key))) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  } else if (grouping.keys.some(key => activityClassificationFilters.includes(key))) {
    topLevelCheckbox = (<button aria-label="Uncheck all nested filters" className="quill-checkbox selected" onClick={uncheckAllFilters} type="button">
      <img alt="Indeterminate checkbox" src={indeterminateSrc} />
    </button>)
  }

  let individualFilters = <span />
  if (isOpen) {
    individualFilters = grouping.keys.map((key: string) =>
      (<IndividualActivityClassificationFilterRow
        activityClassificationFilters={activityClassificationFilters}
        filteredActivities={filteredActivities}
        handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
        key={key}
        uniqueActivityClassifications={uniqueActivityClassifications}
      />)
    )
  }

  return (<section className="toggle-section activity-classification-toggle">
    <div className="top-level filter-row">
      <div>
        {toggleArrow}
        {topLevelCheckbox}
        <span>{grouping.group}</span>
      </div>
      <span>({topLevelActivityCount})</span>
    </div>
    {individualFilters}
  </section>)
}

const ActivityClassificationFilters = ({ activities, filteredActivities, activityClassificationFilters, handleActivityClassificationFilterChange, }: ActivityClassificationFilters) => {
  const allActivityClassifications = activities.map(a => a.activity_classification)
  const uniqueActivityClassificationIds = Array.from(new Set(allActivityClassifications.map(a => a.id)))
  const uniqueActivityClassifications = uniqueActivityClassificationIds.map(id => allActivityClassifications.find(ac => ac.id === id))

  function clearAllActivityClassificationFilters() { handleActivityClassificationFilterChange([]) }

  const activityClassificationToggles = activityClassificationGroupings.map(grouping =>
    (<ActivityClassificationToggle
      activityClassificationFilters={activityClassificationFilters}
      filteredActivities={filteredActivities}
      grouping={grouping}
      handleActivityClassificationFilterChange={handleActivityClassificationFilterChange}
      key={grouping.group}
      uniqueActivityClassifications={uniqueActivityClassifications}
    />)
  )
  const clearButton = activityClassificationFilters.length ? <button className="interactive-wrapper clear-filter" onClick={clearAllActivityClassificationFilters} type="button">Clear</button> : <span />
  return (<section className="filter-section">
    <div className="name-and-clear-wrapper">
      <h2>Activities</h2>
      {clearButton}
    </div>
    {activityClassificationToggles}
  </section>)
}

export default ActivityClassificationFilters
