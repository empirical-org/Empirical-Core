import React from 'react'
import queryString from 'query-string';
import * as _ from 'lodash'
import * as Pusher from 'pusher-js';

import { FULL, restrictedPage, } from '../shared';
import { selectionsEqual, } from '../components/usage_snapshots/shared'
import CustomDateModal from '../components/usage_snapshots/customDateModal'
import SnapshotSection from '../components/usage_snapshots/snapshotSection'
import Filters from '../components/usage_snapshots/filters'
import { snapshotSections, TAB_NAMES, ALL, CUSTOM, SECTION_NAME_TO_ICON_URL, } from '../components/usage_snapshots/shared'
import { Spinner, DropdownInput, } from '../../Shared/index'
import useWindowSize from '../../Shared/hooks/useWindowSize';
import { requestGet, } from '../../../modules/request'
import { unorderedArraysAreEqual, } from '../../../modules/unorderedArraysAreEqual'

const MAX_VIEW_WIDTH_FOR_MOBILE = 950

const filterIconSrc = `${process.env.CDN_URL}/images/icons/icons-filter.svg`

const Tab = ({ section, setSelectedTab, selectedTab }) => {
  function handleSetSelectedTab() { setSelectedTab(section) }

  let className = 'tab'
  if (section === selectedTab) {
    className += ' selected-tab'
  }

  return <button className={className} onClick={handleSetSelectedTab} type="button"><img alt="" src={SECTION_NAME_TO_ICON_URL[section]} /><span>{section}</span></button>
}

const UsageSnapshotsContainer = ({ adminInfo, accessType, }) => {
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
  const [selectedTab, setSelectedTab] = React.useState(ALL)
  const [showCustomDateModal, setShowCustomDateModal] = React.useState(false)
  const [lastUsedTimeframe, setLastUsedTimeframe] = React.useState(null)
  const [showMobileFilterMenu, setShowMobileFilterMenu] = React.useState(false)

  const [pusherChannel, setPusherChannel] = React.useState(null)

  const size = useWindowSize()

  React.useEffect(() => {
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(String(adminInfo.id));
    setPusherChannel(channel)

    getFilters()
  }, [])

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

  function getFilters() {
    const searchParams = {
      timeframe: selectedTimeframe,
      school_ids: selectedSchools?.map(s => s.id) || null,
      teacher_ids: selectedTeachers?.map(t => t.id) || null,
      classroom_ids: selectedClassrooms?.map(c => c.id) || null,
      grades: selectedGrades?.map(g => g.value)
    }

    const requestUrl = queryString.stringifyUrl({ url: '/snapshots/options', query: searchParams }, { arrayFormat: 'bracket' })

    requestGet(requestUrl, (filterData) => {
      const timeframeOptions = filterData.timeframes.map(tf => ({ ...tf, label: tf.name }))
      const gradeOptions = filterData.grades.map(grade => ({ ...grade, label: grade.name }))
      const schoolOptions = filterData.schools.map(school => ({ ...school, label: school.name, value: school.id }))

      const teacherOptions = filterData.teachers.map(teacher => ({ ...teacher, label: teacher.name, value: teacher.id }))

      const classroomOptions = filterData.classrooms.map(classroom => ({ ...classroom, label: classroom.name, value: classroom.id }))

      const timeframe = defaultTimeframe(timeframeOptions)

      if (allGrades?.length !== gradeOptions.length) { setAllGrades(gradeOptions) }
      if (allTimeframes?.length !== timeframeOptions.length) { setAllTimeframes(timeframeOptions)}
      if (allSchools?.length !== schoolOptions.length) { setAllSchools(schoolOptions) }
      if (allTeachers?.length !== teacherOptions.length) { setAllTeachers(teacherOptions) }
      if (allClassrooms?.length !== classroomOptions.length) { setAllClassrooms(classroomOptions) }

      if (loadingFilters) {
        setSelectedGrades(gradeOptions)
        setSelectedSchools(schoolOptions)
        setSelectedTeachers(teacherOptions)
        setSelectedClassrooms(classroomOptions)
        setSelectedTimeframe(timeframe)

        setLastSubmittedGrades(gradeOptions)
        setLastSubmittedSchools(schoolOptions)
        setLastSubmittedTeachers(teacherOptions)
        setLastSubmittedClassrooms(classroomOptions)
        setLastSubmittedTimeframe(timeframe)

        setLastUsedTimeframe(timeframe)

        setOriginalAllClassrooms(classroomOptions)
        setOriginalAllSchools(schoolOptions)
        setOriginalAllTeachers(teacherOptions)

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

  function handleSetSelectedTabFromDropdown(option) { setSelectedTab(option.value) }

  if (loadingFilters) {
    return <Spinner />
  }

  function handleClickDownloadReport() { window.print() }

  function mapItemsIfNotAll(selectedItems, allItems, mapKey = 'id') {
    // selectedItems may, by design, be a superset of allItems, but if everything in allItems is in selectedItems, we want to treat it as "everything" being selected
    const allItemsSelected = allItems.every((item) => {
      return _.some(selectedItems, item)
    })

    if (allItemsSelected || selectionsEqual(selectedItems, allItems)) return null

    return selectedItems.map(i => i[mapKey])
  }

  const tabs = TAB_NAMES.map(s => (
    <Tab
      key={s}
      section={s}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
  ))

  const tabDropdownOptions = TAB_NAMES.map(tab => ({ value: tab, label: tab, }))

  const tabDropdown = (
    <DropdownInput
      handleChange={handleSetSelectedTabFromDropdown}
      id="tab-dropdown"
      isSearchable={false}
      label=""
      options={tabDropdownOptions}
      value={tabDropdownOptions.find(opt => opt.value === selectedTab)}
    />
  )

  const sectionsToShow = selectedTab === ALL ? snapshotSections : snapshotSections.filter(s => s.name === selectedTab)
  const snapshotSectionComponents = sectionsToShow.map(section => (
    <SnapshotSection
      active={section.name === selectedTab}
      className={section.className}
      customTimeframeEnd={customEndDate?.toDate()}
      customTimeframeStart={customStartDate?.toDate()}
      itemGroupings={section.itemGroupings}
      key={section.name}
      name={section.name}
      pusherChannel={pusherChannel}
      searchCount={searchCount}
      selectedClassroomIds={mapItemsIfNotAll(selectedClassrooms, allClassrooms)}
      selectedGrades={mapItemsIfNotAll(selectedGrades, allGrades, 'value')}
      selectedSchoolIds={selectedSchools.map(s => s.id)}
      selectedTeacherIds={mapItemsIfNotAll(selectedTeachers, allTeachers)}
      selectedTimeframe={selectedTimeframe.value}
    />
  ))

  const filterProps = {
    allTimeframes,
    allSchools,
    allGrades,
    allTeachers,
    allClassrooms,
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
  }

  if (accessType !== FULL) {
    return restrictedPage
  }

  return (
    <div className="usage-snapshots-container white-background">
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
      <main>
        <div className="header">
          <h1>
            <span>Usage Snapshot Report</span>
            <a href="https://support.quill.org/en/articles/8358350-how-do-i-use-the-usage-snapshot-report" rel="noopener noreferrer" target="_blank">
              <img alt="" src={`${process.env.CDN_URL}/images/icons/file-document.svg`} />
              <span>Guide</span>
            </a>
          </h1>
          <button className="quill-button contained primary medium focus-on-light" onClick={handleClickDownloadReport} type="button">Download Report</button>
        </div>
        <div aria-hidden={true} className="tabs">
          {size.width >= MAX_VIEW_WIDTH_FOR_MOBILE ? tabs : tabDropdown}
        </div>
        <div className="filter-button-container">
          <button className="interactive-wrapper focus-on-light" onClick={openMobileFilterMenu} type="button">
            <img alt="Filter icon" src={filterIconSrc} />
            Filters
          </button>
        </div>
        <div className="sections">
          {snapshotSectionComponents}
        </div>
        <div id="bottom-element" />
      </main>
    </div>
  )
}

export default UsageSnapshotsContainer
