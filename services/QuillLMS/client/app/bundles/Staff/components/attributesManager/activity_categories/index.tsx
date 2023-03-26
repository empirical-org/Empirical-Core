import * as React from 'react'

import useSnackbarMonitor from '../../../../Shared/hooks/useSnackbarMonitor'
import { defaultSnackbarTimeout, Snackbar } from '../../../../Shared/index'

import { requestGet, requestPut } from '../../../../../modules/request/index'
import CustomActivityPackPage from '../../../../Teacher/components/assignment_flow/create_unit/custom_activity_pack/index'

const ActivityCategories = () => {
  const [activityCategories, setActivityCategories] = React.useState([])
  const [originalActivityCategories, setOriginalActivityCategories] = React.useState([])
  const [selectedActivityCategoryId, setSelectedActivityCategoryId] = React.useState(null)
  const [selectedActivities, setSelectedActivities] = React.useState([])
  const [activities, setActivities] = React.useState([])
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [saveButtonEnabled, setSaveButtonEnabled] = React.useState(false)
  const [timesSubmitted, setTimesSubmitted] = React.useState(0)

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  React.useEffect(() => {
    getActivityCategories()
    getActivities()
  }, [])

  React.useEffect(() => {
    if (!_.isEqual(activityCategories, originalActivityCategories)) {
      setSaveButtonEnabled(true)
    }
  }, [activityCategories])

  React.useEffect(() => {
    if (selectedActivityCategoryId === null) {
      setSelectedActivities([])
    } else {
      const selectedActivityCategory = activityCategories.find(ac => ac.id === selectedActivityCategoryId)
      const selectedActivityCategoryActivities = selectedActivityCategory.activity_ids.map(id => activities.find(a => a.id === id))
      setSelectedActivities(selectedActivityCategoryActivities)
    }
  }, [selectedActivityCategoryId])

  React.useEffect(() => {
    if (!selectedActivityCategoryId) { return }

    const selectedActivityIds = selectedActivities.map(a => a.id)
    const newActivityCategories = [...activityCategories]
    const indexOfActivityCategory = newActivityCategories.findIndex(act => act.id === selectedActivityCategoryId);
    newActivityCategories[indexOfActivityCategory].activity_ids = selectedActivityIds
    setActivityCategories(newActivityCategories)
  }, [selectedActivities])

  function getActivityCategories() {
    requestGet('/cms/activity_categories',
      (data) => {
        setOriginalActivityCategories(_.cloneDeep(data.activity_categories))
        setActivityCategories(_.cloneDeep(data.activity_categories));
      }
    )
  }

  function getActivities() {
    requestGet('/activities/search',
      (data) => {
        setActivities(data.activities);
      }
    )
  }

  function saveActivityCategories() {
    setActivities([])
    requestPut('/cms/activity_categories/mass_update', { activity_categories: activityCategories, },
      (data) => {
        setOriginalActivityCategories(_.cloneDeep(data.activity_categories))
        setActivityCategories(_.cloneDeep(data.activity_categories));
        setSaveButtonEnabled(false)
        setShowSnackbar(true)
        setTimesSubmitted(timesSubmitted + 1)
        getActivities()
      }
    )
  }

  function handleActivityCategorySelect(activityCategoryId) {
    setSelectedActivityCategoryId(activityCategoryId)
  }

  function toggleActivitySelection(activity) {
    const indexOfActivity = selectedActivities.findIndex(act => act.id === activity.id);
    const newActivityArray = selectedActivities.slice();
    if (indexOfActivity === -1) {
      newActivityArray.push(activity);
    } else {
      newActivityArray.splice(indexOfActivity, 1);
    }
    setSelectedActivities(newActivityArray)
    setSaveButtonEnabled(true)
  }

  function handleSelectedActivityReorder(reorderedActivities) {
    // handles the case where the selected activities are filtered by flag - we don't want to remove hidden activities from the list so we just put them at the end of the new order
    const hiddenSelectedActivities = selectedActivities.filter(sa => !reorderedActivities.find(ra => ra.id === sa.id))
    setSelectedActivities(reorderedActivities.concat(hiddenSelectedActivities))
    setSaveButtonEnabled(true)
  }

  const activityCategoryEditorProps = {
    activityCategories,
    getActivityCategories,
    setActivityCategories,
    selectedActivityCategoryId,
    handleActivityCategorySelect,
    timesSubmitted
  }
  return (
    <React.Fragment>
      <Snackbar text="Changes saved" visible={showSnackbar} />
      <CustomActivityPackPage
        activityCategoryEditor={activityCategoryEditorProps}
        clickContinue={saveActivityCategories}
        isStaff={true}
        passedActivities={activities}
        saveButtonEnabled={saveButtonEnabled}
        selectedActivities={selectedActivities}
        setSelectedActivities={handleSelectedActivityReorder}
        toggleActivitySelection={toggleActivitySelection}
      />
    </React.Fragment>
  )
}

export default ActivityCategories
