import * as React from 'react';
import queryString from 'query-string';

import { Activity, ActivityCategoryEditor } from './interfaces'
import { calculateNumberOfPages, activityClassificationGroupings, filters, filterByFlag, DEFAULT } from './shared'
import ActivityTableContainer from './activity_table_container'
import FilterColumn from './filter_column'
import Header from './header'
import MobileFilterMenu from './mobile_filter_menu'
import MobileSortMenu from './mobile_sort_menu'

import useDebounce from '../../../../hooks/useDebounce'
import { requestGet, requestPost, requestDelete } from '../../../../../../modules/request/index'
import { Spinner, Snackbar, defaultSnackbarTimeout } from '../../../../../Shared/index'
import { handleHasAppSetting } from "../../../../../Shared/utils/appSettingAPIs";

const DEBOUNCE_LENGTH = 500

interface CustomActivityPackProps {
  passedActivities?: Activity[],
  isStaff?: boolean
  clickContinue: (event: any) => void,
  selectedActivities: Activity[],
  setSelectedActivities: (selectedActivities: Activity[]) => void,
  toggleActivitySelection: (activity: Activity) => void,
  activityCategoryEditor?: ActivityCategoryEditor,
  showEvidenceBanner?: boolean,
  showLessonsBanner?: boolean,
  saveButtonEnabled?: boolean
}

const CustomActivityPack = ({
  passedActivities,
  clickContinue,
  selectedActivities,
  setSelectedActivities,
  toggleActivitySelection,
  isStaff,
  activityCategoryEditor,
  showEvidenceBanner,
  showLessonsBanner,
  saveButtonEnabled
}: CustomActivityPackProps) => {
  const url = queryString.parseUrl(window.location.href, { arrayFormat: 'bracket', parseNumbers: true }).query;

  const [activities, setActivities] = React.useState(passedActivities || [])
  const [filteredActivities, setFilteredActivities] = React.useState(activities)
  const [loading, setLoading] = React.useState(!passedActivities);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState(url.search || '')
  const [filterHistory, setFilterHistory] = React.useState([])
  const [activityClassificationFilters, setActivityClassificationFilters] = React.useState(url.activityClassificationFilters || [])
  const [ccssGradeLevelFilters, setCCSSGradeLevelFilters] = React.useState(url.ccssGradeLevelFilters || [])
  const [gradeLevelFilters, setGradeLevelFilters] = React.useState(url.gradeLevelFilters || [])
  const [ellFilters, setELLFilters] = React.useState(url.ellFilters || [])
  const [standardsFilters, setStandardsFilters] = React.useState({ ccssGradeLevelFilters: ccssGradeLevelFilters, ellFilters: ellFilters })
  const [readabilityGradeLevelFilters, setReadabilityGradeLevelFilters] = React.useState(url.readabilityGradeLevelFilters || [])
  const [activityCategoryFilters, setActivityCategoryFilters] = React.useState(url.activityCategoryFilters || [])
  const [contentPartnerFilters, setContentPartnerFilters] = React.useState(url.contentPartnerFilters || [])
  const [topicFilters, setTopicFilters] = React.useState(url.topicFilters || [])
  const [flagFilters, setFlagFilters] = React.useState(url.flagFilters || isStaff ? ['production'] : [])
  const [savedActivityFilters, setSavedActivityFilters] = React.useState([])
  const [showMobileFilterMenu, setShowMobileFilterMenu] = React.useState(false)
  const [showMobileSortMenu, setShowMobileSortMenu] = React.useState(false)
  const [sort, setSort] = React.useState(DEFAULT)
  const [savedActivityIds, setSavedActivityIds] = React.useState([])
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const [showComprehension, setShowComprehension] = React.useState<boolean>(false);

  const debouncedSearch = useDebounce(search, DEBOUNCE_LENGTH);
  const debouncedActivityClassificationFilters = useDebounce(activityClassificationFilters, DEBOUNCE_LENGTH);
  const debouncedCCSSGradeLevelFilters = useDebounce(ccssGradeLevelFilters, DEBOUNCE_LENGTH);
  const debouncedGradeLevelFilters = useDebounce(gradeLevelFilters, DEBOUNCE_LENGTH);
  const debouncedELLFilters = useDebounce(ellFilters, DEBOUNCE_LENGTH);
  const debouncedReadabilityGradeLevelFilters = useDebounce(readabilityGradeLevelFilters, DEBOUNCE_LENGTH);
  const debouncedActivityCategoryFilters = useDebounce(activityCategoryFilters, DEBOUNCE_LENGTH);
  const debouncedContentPartnerFilters = useDebounce(contentPartnerFilters, DEBOUNCE_LENGTH);
  const debouncedTopicFilters = useDebounce(topicFilters, DEBOUNCE_LENGTH);
  const debouncedSavedActivityFilters = useDebounce(savedActivityFilters, DEBOUNCE_LENGTH);
  const debouncedFlagFilters = useDebounce(flagFilters, DEBOUNCE_LENGTH);

  React.useEffect(() => {
    if (loading) { getActivities() }
    getSavedActivities();
    handleHasAppSetting({appSettingSetter: setShowComprehension, key: 'comprehension', errorSetter: () => {}})
  }, []);

  React.useEffect(() => {
    if (passedActivities) {
      setLoading(!passedActivities.length)
      setActivities(passedActivities)
    }
  }, [passedActivities])

  React.useEffect(() => {
    const newStandardsFilters = {
      ellFilters,
      ccssGradeLevelFilters
    }
    setStandardsFilters(newStandardsFilters)
  }, [ellFilters, ccssGradeLevelFilters])

  React.useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout)
    }
  }, [showSnackbar])

  React.useEffect(() => {
    if (activities.length) {
      updateFilteredActivities();
      setLoading(false)
    }
  }, [activities])

  React.useEffect(handleFilterChange, [debouncedSearch, debouncedActivityClassificationFilters, debouncedCCSSGradeLevelFilters, debouncedGradeLevelFilters, debouncedELLFilters, debouncedActivityCategoryFilters, debouncedContentPartnerFilters, debouncedReadabilityGradeLevelFilters, debouncedTopicFilters, debouncedSavedActivityFilters, debouncedFlagFilters])

  function handleFilterChange() {
    updateQueryString()
    updateFilteredActivities()
  }

  function calculateNumberOfFilters() {
    let number = 0
    number += search.length ? 1 : 0
    number += ccssGradeLevelFilters.length ? 1 : 0
    number += gradeLevelFilters.length ? 1 : 0
    number += ellFilters.length ? 1 : 0
    number += readabilityGradeLevelFilters.length ? 1 : 0
    number += activityCategoryFilters.length
    number += contentPartnerFilters.length
    number += topicFilters.length
    number += savedActivityFilters.length ? 1 : 0
    number += flagFilters.length

    activityClassificationGroupings(true).forEach((g) => {
      if (g.keys.every(key => activityClassificationFilters.includes(key))) {
        number += 1
      } else {
        number += g.keys.filter(key => activityClassificationFilters.includes(key)).length
      }
    })

    return number
  }

  function getActivities() {
    requestGet('/activities/search',
      (data) => {
        setActivities(data.activities);
      }
    )
  }

  function getSavedActivities(callback=null) {
    requestGet('/teacher_saved_activities/saved_activity_ids_for_current_user',
      (data) => {
        setSavedActivityIds(data.activity_ids);
        callback ? callback() : null
      }
    )
  }

  function saveActivity(activityId) {
    requestPost(
      '/teacher_saved_activities/create_by_activity_id_for_current_user',
      { activity_id: activityId },
      () => {
        const callback = () => {
          setSnackbarText('Activity saved')
          setShowSnackbar(true)
        }
        getSavedActivities(callback)
      }
    )
  }

  function unsaveActivity(activityId) {
    requestDelete(
      '/teacher_saved_activities/destroy_by_activity_id_for_current_user',
      { activity_id: activityId },
      () => {
        const callback = () => {
          setSnackbarText('Activity unsaved')
          setShowSnackbar(true)
        }
        getSavedActivities(callback)
      }
    )
  }

  function handleSearch(newSearchTerm: string) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setSearch, argument: search }]))
    setSearch(newSearchTerm)
  }

  function handleActivityClassificationFilterChange(newActivityClassificationFilters: string[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setActivityClassificationFilters, argument: activityClassificationFilters }]))
    setActivityClassificationFilters(newActivityClassificationFilters)
  }

  function handleCCSSGradeLevelFilterChange(newCCSSGradeLevelFilters: number[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setCCSSGradeLevelFilters, argument: ccssGradeLevelFilters }]))
    setCCSSGradeLevelFilters(newCCSSGradeLevelFilters)
  }

  function handleGradeLevelFilterChange(newGradeLevelFilters: number[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setGradeLevelFilters, argument: gradeLevelFilters }]))
    setGradeLevelFilters(newGradeLevelFilters)
  }

  function handleELLFilterChange(newELLFilters: number[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setELLFilters, argument: ellFilters }]))
    setELLFilters(newELLFilters)
  }

  function handleReadabilityGradeLevelFilterChange(newReadabilityGradeLevelFilters: number[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setReadabilityGradeLevelFilters, argument: readabilityGradeLevelFilters }]))
    setReadabilityGradeLevelFilters(newReadabilityGradeLevelFilters)
  }

  function handleActivityCategoryFilterChange(newActivityCategoryFilters: number[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setActivityCategoryFilters, argument: activityCategoryFilters }]))
    setActivityCategoryFilters(newActivityCategoryFilters)
  }

  function handleContentPartnerFilterChange(newContentPartnerFilters: number[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setContentPartnerFilters, argument: contentPartnerFilters }]))
    setContentPartnerFilters(newContentPartnerFilters)
  }

  function handleTopicFilterChange(newTopicFilters: number[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setTopicFilters, argument: topicFilters }]))
    setTopicFilters(newTopicFilters)
  }

  function handleFlagFilterChange(newFlagFilters: string[]) {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setFlagFilters, argument: topicFilters }]))
    setFlagFilters(newFlagFilters)
  }

  function handleSavedActivityFilterChange() {
    setFilterHistory(prevFilterHistory => prevFilterHistory.concat([{ function: setSavedActivityFilters, argument: savedActivityFilters }]))
    setSavedActivityFilters(savedActivityFilters.length ? [] : savedActivityIds)
  }

  function resetAllFilters() {
    setFilterHistory([])
    setSearch('')
    setActivityClassificationFilters([])
    setCCSSGradeLevelFilters([])
    setGradeLevelFilters([])
    setELLFilters([])
    setReadabilityGradeLevelFilters([])
    setActivityCategoryFilters([])
    setContentPartnerFilters([])
    setTopicFilters([])
    setSavedActivityFilters([])
    setFlagFilters([])
  }

  function filterActivities(ignoredKey=null) {
    return activities.filter(activity => Object.keys(filters).every(k => {
      if (k === ignoredKey) { return true }
      return filters[k](eval(k), activity)
    }))
  }

  function updateFilteredActivities() {
    if (!activities.length) { return }

    const newFilteredActivities = filterActivities()
    const newNumberOfPages = calculateNumberOfPages(newFilteredActivities)
    if (currentPage > newNumberOfPages && currentPage !== 1) { setCurrentPage(newNumberOfPages) }
    setFilteredActivities(newFilteredActivities)
    const scrollContainer = document.getElementsByClassName('main-content-container')[0]
    scrollContainer && scrollContainer.scrollTo(0, 0)
  }

  function undoLastFilter() {
    const lastIndex = filterHistory.length - 1
    const lastItem = filterHistory[lastIndex]
    lastItem.function(lastItem.argument)
    const newFilterHistory = filterHistory.splice(0, lastIndex)
    setFilterHistory(newFilterHistory)
  }

  function updateQueryString() {
    const queryHash = {}
    Object.keys(filters).forEach(k => {
      const actualValue = eval(k)
      if (actualValue.length) {
        queryHash[k] = eval(k)
      }
    })
    const newUrl = queryString.stringifyUrl({ url: `${window.location.origin}${window.location.pathname}`, query: queryHash }, { arrayFormat: 'bracket' })
    window.history.pushState({ path: newUrl }, '', newUrl)
  }

  if (loading) {
    return <div className="custom-activity-pack-page loading"><Spinner /></div>
  }

  const filterColumnProps = {
    activities,
    activityCategoryFilters,
    activityClassificationFilters,
    calculateNumberOfFilters,
    contentPartnerFilters,
    filterActivities,
    filteredActivities,
    ccssGradeLevelFilters,
    ellFilters,
    gradeLevelFilters,
    handleActivityCategoryFilterChange,
    handleActivityClassificationFilterChange,
    handleContentPartnerFilterChange,
    handleCCSSGradeLevelFilterChange,
    handleELLFilterChange,
    handleGradeLevelFilterChange,
    resetAllFilters,
    readabilityGradeLevelFilters,
    handleReadabilityGradeLevelFilterChange,
    topicFilters,
    handleTopicFilterChange,
    savedActivityFilters,
    handleSavedActivityFilterChange,
    savedActivityIds,
    handleFlagFilterChange,
    flagFilters,
    isStaff,
    activityCategoryEditor,
    showComprehension
  }

  const selectedActivitiesFilteredByFlag =  isStaff && !flagFilters.length ? [] : selectedActivities.filter(a => filterByFlag(flagFilters, a))

  return (
    <div className="custom-activity-pack-page">
      <Snackbar text={snackbarText} visible={showSnackbar} />
      <MobileFilterMenu {...filterColumnProps} setShowMobileFilterMenu={setShowMobileFilterMenu} showMobileFilterMenu={showMobileFilterMenu} />
      <MobileSortMenu setShowMobileSortMenu={setShowMobileSortMenu} setSort={setSort} showMobileSortMenu={showMobileSortMenu} />
      <FilterColumn {...filterColumnProps} />
      <section className="main-content-container">
        <Header
          gradeLevelFilters={gradeLevelFilters}
          handleClickContinue={clickContinue}
          isStaff={isStaff}
          saveButtonEnabled={saveButtonEnabled}
          selectedActivities={selectedActivitiesFilteredByFlag}
          setSelectedActivities={setSelectedActivities}
          toggleActivitySelection={toggleActivitySelection}
        />
        <ActivityTableContainer
          currentPage={currentPage}
          filteredActivities={filteredActivities}
          gradeLevelFilters={gradeLevelFilters}
          handleSearch={handleSearch}
          resetAllFilters={resetAllFilters}
          saveActivity={saveActivity}
          savedActivityIds={savedActivityIds}
          search={search}
          selectedActivities={selectedActivities}
          setCurrentPage={setCurrentPage}
          setShowMobileFilterMenu={setShowMobileFilterMenu}
          setShowMobileSortMenu={setShowMobileSortMenu}
          setSort={setSort}
          showEvidenceBanner={showEvidenceBanner}
          showLessonsBanner={showLessonsBanner}
          sort={sort}
          toggleActivitySelection={toggleActivitySelection}
          undoLastFilter={undoLastFilter}
          unsaveActivity={unsaveActivity}
        />
      </section>
    </div>
  )
}

export default CustomActivityPack
