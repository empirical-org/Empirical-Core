import * as React from 'react';
import { SortableHandle, } from 'react-sortable-hoc';

import { Activity, ActivityCategory, ActivityCategoryEditor } from './interfaces'
import { ACTIVITY_CATEGORY_FILTERS, AVERAGE_FONT_WIDTH, } from './shared'

import SortableList from '../../../shared/sortableList'
import { requestPost, } from '../../../../../../modules/request/index'
import { Tooltip, Input, Snackbar, defaultSnackbarTimeout } from '../../../../../Shared/index'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`
const reorderSrc = `${process.env.CDN_URL}/images/icons/reorder.svg`

interface ActivityCategoryFilterRowProps {
  activityCategoryFilters: number[],
  activityCategory: ActivityCategory,
  handleActivityCategoryFilterChange: (activityCategoryFilters: number[]) => void,
  uniqueActivityCategories: ActivityCategory[],
  filteredActivities: Activity[],
  handleRemoveActivityCategory: (id: number) => void,
  handleActivityCategoryNameChange: (id: number, name: string) => void
}

interface ActivityCategoryFiltersProps {
  activities: Activity[],
  filterActivities: (ignoredKey?: string) => Activity[]
  activityCategoryFilters: number[],
  handleActivityCategoryFilterChange: (activityCategoryFilters: number[]) => void,
  activityCategoryEditor: ActivityCategoryEditor
}

const activityCategoryTooltipText = "Each activity is assigned one activity category. Activity categories are the \"concept\" activity attribute used to filter and order activities and shown under the activity's title in the custom activity pack page. Changing the order of activity categories on this page changes the default order in which activities are displayed to teachers. Note that these concepts are not the same concepts that are displayed in a featured activity pack page, and they are not the same concepts used to build the Concepts data report."

const ActivityCategoryFilterRow = ({
  activityCategoryFilters,
  activityCategory,
  handleActivityCategoryFilterChange,
  filteredActivities,
  handleRemoveActivityCategory,
  handleActivityCategoryNameChange
}: ActivityCategoryFilterRowProps) => {
  const [inEditMode, setInEditMode] = React.useState(false)

  function checkIndividualFilter() {
    const newActivityCategoryFilters = Array.from(new Set(activityCategoryFilters.concat([activityCategory.id])))
    handleActivityCategoryFilterChange(newActivityCategoryFilters)
  }

  function uncheckIndividualFilter() {
    const newActivityCategoryFilters = activityCategoryFilters.filter(k => k !== activityCategory.id)
    handleActivityCategoryFilterChange(newActivityCategoryFilters)
  }

  function startEditing() { setInEditMode(true) }

  function removeActivityCategory() {
    handleRemoveActivityCategory(activityCategory.id)
  }

  function onActivityCategoryNameChange(e) {
    handleActivityCategoryNameChange(activityCategory.id, e.target.value)
  }

  const activityCount = filteredActivities.filter(act => activityCategory.id === act.activity_category.id).length
  let checkbox = <button aria-label={`Check ${activityCategory.name}`} className="focus-on-light quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

  if (activityCount === 0) {
    checkbox = <div aria-label={`Check ${activityCategory.name}`} className="focus-on-light quill-checkbox disabled" />
  } else if (activityCategoryFilters.includes(activityCategory.id)) {
    checkbox = (<button aria-label={`Uncheck ${activityCategory.name}`} className="focus-on-light quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  const activityCategoryNameElement = activityCategory.name.length * AVERAGE_FONT_WIDTH >= 200 ? <Tooltip tooltipText={activityCategory.name} tooltipTriggerText={activityCategory.name} tooltipTriggerTextClass="tooltip-trigger-text" /> : <span>{activityCategory.name}</span>
  const DragHandle = SortableHandle(() => <img alt="Reorder icon" className="reorder-icon focus-on-light" src={reorderSrc} tabIndex={0} />);

  if (inEditMode) {
    return (
      <section key={activityCategory.id}>
        <button className="interactive-wrapper" onClick={removeActivityCategory}><i className="fas fa-minus-circle" /></button>
        <div className="individual-row filter-row activity-category-row">
        <div>
          {checkbox}
          <Input
            handleChange={onActivityCategoryNameChange}
            value={activityCategory.name}
          />
        </div>
        <span>({activityCount})</span>
      </div>
    </section>)
  }

  return (
    <section key={activityCategory.id}>
      <DragHandle />
      <div className="individual-row filter-row activity-category-row">
      <div>
        {checkbox}
        {activityCategoryNameElement}
      </div>
      <div>
        <button className="interactive-wrapper" onClick={startEditing}><i className="fas fa-pencil-alt" /></button>
        <span>({activityCount})</span>
      </div>
    </div>
  </section>)
}

const ActivityCategoryFilters = ({ activityCategoryEditor, filterActivities, activityCategoryFilters, handleActivityCategoryFilterChange, }: ActivityCategoryFiltersProps) => {
  const [newActivityCategoryName, setNewActivityCategoryName] = React.useState('')
  const [showSnackbar, setShowSnackbar] = React.useState(false)

  const { activityCategories, getActivityCategories, setActivityCategories, } = activityCategoryEditor

  React.useEffect(getActivityCategories, [])

  React.useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout)
    }
  }, [showSnackbar])

  function clearAllActivityCategoryFilters() { handleActivityCategoryFilterChange([]) }

  function sortCallback(sortInfo) {
    const newOrder = sortInfo.map(item => item.key);
    const newOrderedActivityCategories = newOrder.map((key, i) => {
      const ac = activityCategories.find(a => a.id === Number(key))
      ac.order_number = i
      return ac
    })
    setActivityCategories(newOrderedActivityCategories)
  }

  function createNewActivityCategory() {
    if (!newActivityCategoryName.length) { return }

    const params = { activity_category: { name: newActivityCategoryName, }}
    requestPost('/cms/activity_categories', params,
      (data) => {
        getActivityCategories()
        setShowSnackbar(true)
        setNewActivityCategoryName('')
      }
    )
  }

  function handleNewActivityCategoryNameChange(e) {
    setNewActivityCategoryName(e.target.value)
  }

  function handleActivityCategoryNameChange(id, name) {
    const newActivityCategories = activityCategories.map(ac => {
      if (ac.id === id) {
        ac.name = name
      }
      return ac
    })
    setActivityCategories(newActivityCategories)
  }

  function handleRemoveActivityCategory(id) {
    const newActivityCategories = activityCategories.filter(ac => ac.id !== id)
    setActivityCategories(newActivityCategories)
  }

  const filteredActivities = filterActivities(ACTIVITY_CATEGORY_FILTERS)

  const activityCategoryRows = activityCategories.map(ac => (<ActivityCategoryFilterRow
    activityCategory={ac}
    activityCategoryFilters={activityCategoryFilters}
    filteredActivities={filteredActivities}
    handleActivityCategoryNameChange={handleActivityCategoryNameChange}
    handleActivityCategoryFilterChange={handleActivityCategoryFilterChange}
    handleRemoveActivityCategory={handleRemoveActivityCategory}
    key={ac.id}
    uniqueActivityCategories={activityCategories}
  />))

  const activityCategoryList = <SortableList data={activityCategoryRows} helperClass="sortable-filter-row" sortCallback={sortCallback} useDragHandle={true} />

  const clearButton = activityCategoryFilters.length ? <button className="interactive-wrapper clear-filter focus-on-light" onClick={clearAllActivityCategoryFilters} type="button">Clear</button> : <span />

  let createNewActivityCategoryButtonClassName = "quill-button primary contained fun"
  if (!newActivityCategoryName.length) { createNewActivityCategoryButtonClassName += ' disabled' }

  return (<section className="filter-section staff-activity-category-filter-section">
    <Snackbar text="Changes saved" visible={showSnackbar} />
    <div className="name-and-clear-wrapper">
      <h2>Concepts (Activity Category)
      <Tooltip
        tooltipText={activityCategoryTooltipText}
        tooltipTriggerText={<i className="fal fa-info-circle" />}
      />
      </h2>
      {clearButton}
    </div>
    {activityCategoryList}
    <section className="create-activity-category-form">
      <Input
        label="Activity category"
        handleChange={handleNewActivityCategoryNameChange}
        value={newActivityCategoryName}
      />
      <button className={createNewActivityCategoryButtonClassName} onClick={createNewActivityCategory}>Add</button>
    </section>
  </section>)
}

export default ActivityCategoryFilters
