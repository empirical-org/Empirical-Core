import * as React from 'react'
import queryString from 'query-string';
import * as _ from 'lodash'
import * as Pusher from 'pusher-js';
import { Routes, Route } from "react-router-dom-v5-compat";
import { useLocation } from 'react-router-dom';

import DataExportContainer from './DataExportContainer';
import UsageSnapshotsContainer from './UsageSnapshotsContainer';
import DiagnosticGrowthReportsContainer from './diagnosticGrowthReports';

import { FULL, restrictedPage, } from '../shared';
import CustomDateModal from '../components/usage_snapshots/customDateModal'
import Filters from '../components/usage_snapshots/filters'
import { CUSTOM } from '../components/usage_snapshots/shared'
import { Spinner } from '../../Shared/index'
import { requestPost, } from '../../../modules/request'
import { unorderedArraysAreEqual, } from '../../../modules/unorderedArraysAreEqual'

const MAXIMUM_CLASSROOM_LENGTH_FOR_FILTERS = 1500

const sidebarImgSrcStem = `${process.env.CDN_URL}/images/pages/administrator/sidebar`
const openGreenSidebarIcon = `${sidebarImgSrcStem}/open_sidebar_green.svg`
const openGraySidebarIcon = `${sidebarImgSrcStem}/open_sidebar_gray.svg`
const closedGreenSidebarIcon = `${sidebarImgSrcStem}/closed_sidebar_green.svg`
const closedGraySidebarIcon = `${sidebarImgSrcStem}/closed_sidebar_gray.svg`

export const PremiumFilterableReportsContainer = ({ accessType, adminInfo, }) => {
  const [loadingSavedFilterSelections, setLoadingSavedFilterSelections] = React.useState(true)
  const [loadingFilters, setLoadingFilters] = React.useState(true)

  const [allTimeframes, setAllTimeframes] = React.useState(null)
  const [allSchools, setAllSchools] = React.useState(null)
  const [allGrades, setAllGrades] = React.useState(null)
  const [allTeachers, setAllTeachers] = React.useState(null)
  const [allClassrooms, setAllClassrooms] = React.useState(null)

  const [originalAllSchools, setOriginalAllSchools] = React.useState(null)
  const [originalAllTeachers, setOriginalAllTeachers] = React.useState(null)
  const [originalAllClassrooms, setOriginalAllClassrooms] = React.useState(null)

  const [selectedSchools, setSelectedSchools] = React.useState(null)
  const [selectedGrades, setSelectedGrades] = React.useState(null)
  const [selectedTeachers, setSelectedTeachers] = React.useState(null)
  const [selectedClassrooms, setSelectedClassrooms] = React.useState(null)
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(null)

  const [lastSubmittedSchools, setLastSubmittedSchools] = React.useState(null)
  const [lastSubmittedGrades, setLastSubmittedGrades] = React.useState(null)
  const [lastSubmittedTeachers, setLastSubmittedTeachers] = React.useState(null)
  const [lastSubmittedClassrooms, setLastSubmittedClassrooms] = React.useState(null)
  const [lastSubmittedTimeframe, setLastSubmittedTimeframe] = React.useState(null)
  const [lastSubmittedCustomStartDate, setLastSubmittedCustomStartDate] = React.useState(null)
  const [lastSubmittedCustomEndDate, setLastSubmittedCustomEndDate] = React.useState(null)

  const [hasAdjustedFiltersFromDefault, setHasAdjustedFiltersFromDefault] = React.useState(null)
  const [hasAdjustedFiltersSinceLastSubmission, setHasAdjustedFiltersSinceLastSubmission] = React.useState(null)

  const [customStartDate, setCustomStartDate] = React.useState(null)
  const [customEndDate, setCustomEndDate] = React.useState(null)
  const [searchCount, setSearchCount] = React.useState(0)
  const [showCustomDateModal, setShowCustomDateModal] = React.useState(false)
  const [lastUsedTimeframe, setLastUsedTimeframe] = React.useState(null)
  const [showMobileFilterMenu, setShowMobileFilterMenu] = React.useState(false)

  const [pusherChannel, setPusherChannel] = React.useState(null)

  const [showFilters, setShowFilters] = React.useState(true)

  const location = useLocation();

  React.useEffect(() => {
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(String(adminInfo.id));
    setPusherChannel(channel)

    getFilterSelections()
  }, [])

  React.useEffect(() => {
    if (!loadingSavedFilterSelections) {
      getFilters()
    }
  }, [loadingSavedFilterSelections])

  React.useEffect(() => {
    if (loadingSavedFilterSelections) { return }

    saveFilterSelections()
  }, [searchCount])

  React.useEffect(() => {
    if (loadingFilters) { return }

    getFilters()
  }, [selectedSchools, selectedTeachers, selectedClassrooms, selectedGrades])

  React.useEffect(() => {
    if (loadingFilters) { return }

    const newValueForHasAdjustedFiltersFromDefault = (
      !unorderedArraysAreEqual(selectedSchools, originalAllSchools)
      || !unorderedArraysAreEqual(selectedGrades, allGrades)
      || !unorderedArraysAreEqual(selectedTeachers, originalAllTeachers)
      || !unorderedArraysAreEqual(selectedClassrooms, originalAllClassrooms)
      || !_.isEqual(selectedTimeframe, defaultTimeframe(allTimeframes))
    )

    setHasAdjustedFiltersFromDefault(newValueForHasAdjustedFiltersFromDefault)

    const arraysUnequal = (
      !unorderedArraysAreEqual(selectedSchools, lastSubmittedSchools)
      || !unorderedArraysAreEqual(selectedGrades, lastSubmittedGrades)
      || !unorderedArraysAreEqual(selectedTeachers, lastSubmittedTeachers)
      || !unorderedArraysAreEqual(selectedClassrooms, lastSubmittedClassrooms)
    )

    const datesDoNotMatch = !_.isEqual(selectedTimeframe, lastSubmittedTimeframe) || customStartDate !== lastSubmittedCustomStartDate || customEndDate !== lastSubmittedCustomEndDate

    const newValueForHasAdjustedFiltersSinceLastSubmission = arraysUnequal || datesDoNotMatch

    setHasAdjustedFiltersSinceLastSubmission(newValueForHasAdjustedFiltersSinceLastSubmission)

  }, [selectedSchools, selectedGrades, selectedTeachers, selectedClassrooms, selectedTimeframe])

  React.useEffect(() => {
    if (showCustomDateModal || (customStartDate && customEndDate) || !lastUsedTimeframe) { return }

    setSelectedTimeframe(lastUsedTimeframe)
  }, [showCustomDateModal])

  function openMobileFilterMenu() { setShowMobileFilterMenu(true) }

  function closeMobileFilterMenu() { setShowMobileFilterMenu(false) }

  function toggleFilterMenu() { setShowFilters(!showFilters) }

  function handleSetSelectedTimeframe(timeframe) {
    setLastUsedTimeframe(selectedTimeframe)
    setSelectedTimeframe(timeframe)

    if (timeframe.value === CUSTOM) {
      setShowCustomDateModal(true)
    } else {
      setCustomStartDate(null)
      setCustomEndDate(null)
    }
  }

  function defaultTimeframe(timeframes) {
    return timeframes?.find(timeframe => timeframe.default) || null
  }

  function reportPath() {
    return location.pathname.slice(location.pathname.lastIndexOf("/") + 1, location.pathname.length)
  }

  function setSelectedAndLastSubmitted(grades, schools, teachers, classrooms, timeframe) {
    setSelectedGrades(grades)
    setSelectedSchools(schools)
    setSelectedTeachers(teachers)
    setSelectedClassrooms(classrooms)
    setSelectedTimeframe(timeframe)

    setLastSubmittedGrades(grades)
    setLastSubmittedSchools(schools)
    setLastSubmittedTeachers(teachers)
    setLastSubmittedClassrooms(classrooms)
    setLastSubmittedTimeframe(timeframe)

    setLastUsedTimeframe(timeframe)
  }

  function getFilterSelections() {
    requestPost('/admin_report_filter_selections/show', { report: reportPath() }, (selections) => {
      if (selections) {
        const { grades, schools, teachers, classrooms, timeframe, } =  JSON.parse(selections.filter_selections)
        setSelectedAndLastSubmitted(grades, schools, teachers, classrooms, timeframe)
      }
      setLoadingSavedFilterSelections(false)
    })
  }

  function saveFilterSelections() {
    const filterSelections = {
      timeframe: selectedTimeframe,
      schools: selectedSchools,
      teachers: selectedTeachers,
      classrooms: selectedClassrooms,
      grades: selectedGrades,

    }
    const params = {
      filter_selections: JSON.stringify(filterSelections),
      report: reportPath(),
    }

    requestPost('/admin_report_filter_selections/create_or_update', params, () => {})
  }

  function getFilters() {
    const params = {
      timeframe: selectedTimeframe,
      school_ids: selectedSchools?.map(s => s.id) || null,
      teacher_ids: selectedTeachers?.map(t => t.id) || null,
      classroom_ids: selectedClassrooms?.map(c => c.id) || null,
      grades: selectedGrades?.map(g => g.value),
      report: location.pathname.slice(location.pathname.lastIndexOf("/") , location.pathname.length),
      is_initial_load: loadingFilters
    }

    requestPost('/snapshots/options', params, (filterData) => {
      const timeframeOptions = filterData.timeframes.map(tf => ({ ...tf, label: tf.name }))
      const gradeOptions = filterData.grades.map(grade => ({ ...grade, label: grade.name }))
      const schoolOptions = filterData.schools.map(school => ({ ...school, label: school.name, value: school.id }))
      const teacherOptions = filterData.teachers.map(teacher => ({ ...teacher, label: teacher.name, value: teacher.id }))
      const classroomOptions = filterData.classrooms.map(classroom => ({ ...classroom, label: classroom.name, value: classroom.id }))
      const allTeacherOptions = filterData.all_teachers?.map(teacher => ({ ...teacher, label: teacher.name, value: teacher.id }))
      const allClassroomOptions = filterData.all_classrooms?.map(classroom => ({ ...classroom, label: classroom.name, value: classroom.id }))

      const timeframe = defaultTimeframe(timeframeOptions)

      if (allGrades?.length !== gradeOptions.length) { setAllGrades(gradeOptions) }
      if (allTimeframes?.length !== timeframeOptions.length) { setAllTimeframes(timeframeOptions) }
      if (allSchools?.length !== schoolOptions.length) { setAllSchools(schoolOptions) }
      if (allTeachers?.length !== teacherOptions.length) { setAllTeachers(teacherOptions) }
      if (allClassrooms?.length !== classroomOptions.length) { setAllClassrooms(classroomOptions) }

      if (loadingFilters && (!selectedGrades || !selectedSchools || !selectedTeachers || !selectedClassrooms || !selectedTimeframe)) {
        setSelectedAndLastSubmitted(gradeOptions, schoolOptions, teacherOptions, classroomOptions, timeframe)
      }

      if (loadingFilters) {
        setOriginalAllSchools(schoolOptions)
        setOriginalAllClassrooms(allClassroomOptions)
        setOriginalAllTeachers(allTeacherOptions)

        setLoadingFilters(false)
      }
    })
  }

  function clearFilters() {
    setSelectedGrades(allGrades)
    setSelectedSchools(originalAllSchools)
    setSelectedTeachers(originalAllTeachers)
    setSelectedClassrooms(originalAllClassrooms)
    setSelectedTimeframe(defaultTimeframe(allTimeframes))
    setCustomStartDate(null)
    setCustomEndDate(null)

    // what follows is basically duplicating the logic in applyFilters, but avoids a race condition where the "lastSubmitted" values get set before the new selected values are set
    setSearchCount(searchCount + 1)
    setLastSubmittedGrades(allGrades)
    setLastSubmittedSchools(originalAllSchools)
    setLastSubmittedTeachers(originalAllTeachers)
    setLastSubmittedClassrooms(originalAllClassrooms)
    setLastSubmittedTimeframe(defaultTimeframe(allTimeframes))
    setLastSubmittedCustomStartDate(null)
    setLastSubmittedCustomEndDate(null)
    setHasAdjustedFiltersSinceLastSubmission(false)
  }

  function applyFilters() {
    setSearchCount(searchCount + 1)
    setLastSubmittedGrades(selectedGrades)
    setLastSubmittedSchools(selectedSchools)
    setLastSubmittedTeachers(selectedTeachers)
    setLastSubmittedClassrooms(selectedClassrooms)
    setLastSubmittedTimeframe(selectedTimeframe)
    setLastSubmittedCustomStartDate(customStartDate)
    setLastSubmittedCustomEndDate(customEndDate)
    setHasAdjustedFiltersSinceLastSubmission(false)
  }

  function closeCustomDateModal() { setShowCustomDateModal(false) }

  function setCustomDates(startDate, endDate) {
    setCustomStartDate(startDate)
    setCustomEndDate(endDate)
    closeCustomDateModal()
    applyFilters()
  }

  function handleClickDownloadReport() { window.print() }

  function renderShowFilterMenuButton() {
    const ariaLabel = showFilters ? 'Close filter menu' : 'Open filter menu'

    let imgSrc

    if (showFilters) {
      imgSrc = hasAdjustedFiltersFromDefault ? openGreenSidebarIcon : openGraySidebarIcon
    } else {
      imgSrc = hasAdjustedFiltersFromDefault ? closedGreenSidebarIcon : closedGraySidebarIcon
    }

    return (
      <button
        aria-label={ariaLabel}
        className={`interactive-wrapper focus-on-light show-filter-menu-button ${hasAdjustedFiltersFromDefault ? 'filters-adjusted' : ''}`}
        onClick={toggleFilterMenu}
        type="button"
      >
        <img alt="" src={imgSrc} />
      </button>
    )
  }

  if (loadingFilters) {
    return <Spinner />
  }

  const allClassroomsToPass = allClassrooms.length > MAXIMUM_CLASSROOM_LENGTH_FOR_FILTERS ? [] : allClassrooms

  const filterProps = {
    allTimeframes,
    allSchools,
    allGrades,
    allTeachers,
    allClassrooms: allClassroomsToPass,
    applyFilters,
    clearFilters,
    selectedGrades,
    setSelectedGrades,
    hasAdjustedFiltersFromDefault,
    handleSetSelectedTimeframe,
    selectedTimeframe,
    selectedSchools,
    setSelectedSchools,
    selectedClassrooms,
    setSelectedClassrooms,
    selectedTeachers,
    setSelectedTeachers,
    closeMobileFilterMenu,
    showMobileFilterMenu,
    hasAdjustedFiltersSinceLastSubmission,
    customStartDate,
    customEndDate,
    showFilterMenuButton: renderShowFilterMenuButton()
  }

  const sharedProps = {
    accessType,
    loadingFilters,
    customStartDate,
    customEndDate,
    pusherChannel,
    searchCount,
    selectedClassrooms,
    allClassrooms: allClassroomsToPass,
    selectedGrades,
    allGrades,
    selectedSchools,
    selectedTeachers,
    allTeachers,
    selectedTimeframe,
    handleClickDownloadReport,
    openMobileFilterMenu,
  }

  if (accessType !== FULL) {
    return restrictedPage
  }

  let filterMenu

  if (showFilters) {
    filterMenu = (
      <React.Fragment>
        {showCustomDateModal && (
          <CustomDateModal
            close={closeCustomDateModal}
            passedEndDate={customEndDate}
            passedStartDate={customStartDate}
            setCustomDates={setCustomDates}
          />
        )}
        <Filters
          {...filterProps}
        />
      </React.Fragment>
    )
  }

  return (
    <div className="filterable-reports-container white-background">
      {filterMenu}
      <div className={showFilters ? '' : 'filter-menu-closed'}>
        {showFilters ? null : renderShowFilterMenuButton()}
        <Routes>
          <Route element={<DiagnosticGrowthReportsContainer {...sharedProps} />} path='/teachers/premium_hub/diagnostic_growth_report' />
          <Route element={<DataExportContainer {...sharedProps} />} path='/teachers/premium_hub/data_export' />
          <Route element={<UsageSnapshotsContainer {...sharedProps} />} path='/teachers/premium_hub/usage_snapshot_report' />
        </Routes>
      </div>
    </div>
  )
}

export default PremiumFilterableReportsContainer
