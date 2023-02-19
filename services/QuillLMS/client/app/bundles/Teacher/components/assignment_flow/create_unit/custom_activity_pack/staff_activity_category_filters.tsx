import * as React from 'react';
import { SortableHandle, } from 'react-sortable-hoc';

import { Activity, ActivityCategory, ActivityCategoryEditor } from './interfaces'
import { ACTIVITY_CATEGORY_FILTERS, AVERAGE_FONT_WIDTH, } from './shared'

import { requestPost, } from '../../../../../../modules/request/index'
import { Tooltip, Input, Snackbar, defaultSnackbarTimeout, SortableList, } from '../../../../../Shared/index'

const smallWhiteCheckSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/check-small-white.svg`
const reorderSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/reorder.svg`

interface StaffActivityCategoryFilterRowProps {
  selectedActivityCategoryId: number,
  activityCategory: ActivityCategory,
  handleActivityCategorySelect: (activityCategoryId: number) => void,
  uniqueActivityCategories: ActivityCategory[],
  filteredActivities: Activity[],
  handleRemoveActivityCategory: (id: number) => void,
  handleActivityCategoryNameChange: (id: number, name: string) => void,
  timesSubmitted: number
}

interface StaffActivityCategoryFiltersProps {
  filterActivities: (ignoredKey?: string) => Activity[]
  activityCategoryEditor: ActivityCategoryEditor
}

const activityCategoryTooltipText = "Each activity is assigned one activity category. Activity categories are the \"concept\" activity attribute used to filter and order activities and shown under the activity's title in the custom activity pack page. Changing the order of activity categories on this page changes the default order in which activities are displayed to teachers. Note that these concepts are not the same concepts that are displayed in a featured activity pack page, and they are not the same concepts used to build the Concepts data report."

const StaffActivityCategoryFilterRow = ({
  selectedActivityCategoryId,
  activityCategory,
  handleActivityCategorySelect,
  filteredActivities,
  handleRemoveActivityCategory,
  handleActivityCategoryNameChange,
  timesSubmitted
}: StaffActivityCategoryFilterRowProps) => {
  const [originalActivityCategory, setOriginalActivityCategory] = React.useState(activityCategory)
  const [inEditMode, setInEditMode] = React.useState(false)

  React.useEffect(() => {
    setInEditMode(false)
  }, [timesSubmitted])

  function checkIndividualFilter() {
    handleActivityCategorySelect(activityCategory.id)
  }

  function uncheckIndividualFilter() {
    handleActivityCategorySelect(null)
  }

  function startEditing() { setInEditMode(true) }

  function stopEditing() {
    handleActivityCategoryNameChange(activityCategory.id, originalActivityCategory.name)
    setInEditMode(false)
  }

  function removeActivityCategory() {
    handleRemoveActivityCategory(activityCategory.id)
  }

  function onActivityCategoryNameChange(e) {
    handleActivityCategoryNameChange(activityCategory.id, e.target.value)
  }

  const activityCount = filteredActivities.filter(act => activityCategory.id === act.activity_category.id).length
  let checkbox = <button aria-label={`Check ${activityCategory.name}`} className="focus-on-light quill-checkbox unselected" onClick={checkIndividualFilter} type="button" />

  if (selectedActivityCategoryId === activityCategory.id) {
    checkbox = (<button aria-label={`Uncheck ${activityCategory.name}`} className="focus-on-light quill-checkbox selected" onClick={uncheckIndividualFilter} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  const activityCategoryNameElement = activityCategory.name.length * AVERAGE_FONT_WIDTH >= 160 ? <Tooltip tooltipText={activityCategory.name} tooltipTriggerText={activityCategory.name} tooltipTriggerTextClass="tooltip-trigger-text" /> : <span>{activityCategory.name}</span>
  // using a div as the outer element instead of a button here because something about default button behavior overrides the keypress handling by sortablehandle
  const DragHandle = SortableHandle(() => <div className="focus-on-light" role="button" tabIndex={0}><img alt="Reorder icon" className="reorder-icon" src={reorderSrc} /></div>);

  if (inEditMode) {
    return (
      <section key={activityCategory.id}>
        <button className="interactive-wrapper" onClick={removeActivityCategory} type="button"><i className="fas fa-minus-circle" /></button>
        <div className="individual-row filter-row activity-category-row">
          <div>
            {checkbox}
            <Input
              handleChange={onActivityCategoryNameChange}
              value={activityCategory.name}
            />
          </div>
          <button className="interactive-wrapper" onClick={stopEditing}><i className="fas fa-times" /></button>
        </div>
      </section>
    )
  }

  return (
    <section key={activityCategory.id}>
      <DragHandle />
      <div className="individual-row filter-row activity-category-row">
        <div>
          {checkbox}
          {activityCategoryNameElement}
        </div>
        <div className="pencil-and-count-wrapper">
          <button className="interactive-wrapper" onClick={startEditing}><i className="fas fa-pencil-alt" /></button>
          <span>({activityCount})</span>
        </div>
      </div>
    </section>
  )
}

const StaffActivityCategoryFilters = ({ activityCategoryEditor, filterActivities, }: StaffActivityCategoryFiltersProps) => {
  const [newActivityCategoryName, setNewActivityCategoryName] = React.useState('')
  const [showSnackbar, setShowSnackbar] = React.useState(false)

  const { activityCategories, getActivityCategories, setActivityCategories, selectedActivityCategoryId, handleActivityCategorySelect, timesSubmitted, } = activityCategoryEditor

  React.useEffect(getActivityCategories, [])

  React.useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout)
    }
  }, [showSnackbar])

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
        const newActivityCategories = activityCategories.concat([data.activity_category])
        setActivityCategories(newActivityCategories)
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

  const activityCategoryRows = activityCategories.map(ac => (<StaffActivityCategoryFilterRow
    activityCategory={ac}
    filteredActivities={filteredActivities}
    handleActivityCategoryNameChange={handleActivityCategoryNameChange}
    handleActivityCategorySelect={handleActivityCategorySelect}
    handleRemoveActivityCategory={handleRemoveActivityCategory}
    key={ac.id}
    selectedActivityCategoryId={selectedActivityCategoryId}
    timesSubmitted={timesSubmitted}
    uniqueActivityCategories={activityCategories}
  />))

  const activityCategoryList = <SortableList data={activityCategoryRows} helperClass="sortable-filter-row" sortCallback={sortCallback} useDragHandle={true} />

  let createNewActivityCategoryButtonClassName = "quill-button primary contained fun"
  if (!newActivityCategoryName.length) { createNewActivityCategoryButtonClassName += ' disabled' }

  return (
    <section className="filter-section staff-activity-category-filter-section">
      <Snackbar text="Changes saved" visible={showSnackbar} />
      <div className="name-and-clear-wrapper">
        <h2>Concepts (Activity Category)
          <Tooltip
            tooltipText={activityCategoryTooltipText}
            tooltipTriggerText={<i className="fal fa-info-circle" />}
          />
        </h2>
      </div>
      {activityCategoryList}
      <section className="create-activity-category-form">
        <Input
          handleChange={handleNewActivityCategoryNameChange}
          label="Activity category"
          value={newActivityCategoryName}
        />
        <button className={createNewActivityCategoryButtonClassName} onClick={createNewActivityCategory}>Add</button>
      </section>
    </section>
  )
}

export default StaffActivityCategoryFilters
