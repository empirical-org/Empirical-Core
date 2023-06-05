import React from 'react'

import CustomDateModal from '../components/usage_snapshots/customDateModal'
import SnapshotSection from '../components/usage_snapshots/snapshotSection'
import Filters from '../components/usage_snapshots/filters'
import { snapshotSections, TAB_NAMES, ALL, CUSTOM, unorderedArraysAreEqual, } from '../components/usage_snapshots/shared'
import { Spinner, DropdownInput, } from '../../Shared/index'
import useWindowSize from '../../Shared/hooks/useWindowSize';
import { requestGet, } from '../../../modules/request'

const MAX_VIEW_WIDTH_FOR_MOBILE = 850

const filterIconSrc = `${process.env.CDN_URL}/images/icons/icons-filter.svg`

const Tab = ({ section, setSelectedTab, selectedTab }) => {
  function handleSetSelectedTab() { setSelectedTab(section) }

  let className = 'tab'
  if (section === selectedTab) {
    className += ' selected-tab'
  }

  return <button className={className} onClick={handleSetSelectedTab} type="button">{section}</button>
}

const UsageSnapshotsContainer = ({ adminInfo, }) => {
  const [loadingFilters, setLoadingFilters] = React.useState(true)
  const [allTimeframes, setAllTimeframes] = React.useState(null)
  const [allSchools, setAllSchools] = React.useState(null)
  const [allGrades, setAllGrades] = React.useState(null)
  const [selectedSchools, setSelectedSchools] = React.useState(null)
  const [selectedGrades, setSelectedGrades] = React.useState(null)
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(null)
  const [lastSubmittedSchools, setLastSubmittedSchools] = React.useState(null)
  const [lastSubmittedGrades, setLastSubmittedGrades] = React.useState(null)
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

  const size = useWindowSize()

  React.useEffect(() => {
    getFilters()
  }, [])

  React.useEffect(() => {
    if (loadingFilters) { return }

    const newValueForHasAdjustedFiltersFromDefault = !unorderedArraysAreEqual(selectedSchools, allSchools) || !unorderedArraysAreEqual(selectedGrades, allGrades) || !unorderedArraysAreEqual(selectedTimeframe, defaultTimeframe(allTimeframes))

    setHasAdjustedFiltersFromDefault(newValueForHasAdjustedFiltersFromDefault)

    const newValueForHasAdjustedFiltersSinceLastSubmission = (!unorderedArraysAreEqual(selectedSchools, lastSubmittedSchools) || !unorderedArraysAreEqual(selectedGrades, lastSubmittedGrades) || !unorderedArraysAreEqual(selectedTimeframe, lastSubmittedTimeframe) || customStartDate !== lastSubmittedCustomStartDate || customEndDate !== lastSubmittedCustomEndDate)

    setHasAdjustedFiltersSinceLastSubmission(newValueForHasAdjustedFiltersSinceLastSubmission)
  }, [selectedSchools, selectedGrades, selectedTimeframe, customStartDate, customEndDate])

  React.useEffect(() => {
    if (selectedSchools?.length === 0) {
      setSelectedSchools(allSchools)
    }
    if (selectedGrades?.length === 0) {
      setSelectedGrades(allGrades)
    }
  }, [selectedSchools, selectedGrades])

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
    }
  }

  function defaultTimeframe(timeframes) {
    return timeframes?.find(timeframe => timeframe.default) || null
  }

  function getFilters() {
    requestGet('/snapshots/options', (filterData) => {
      const timeframeOptions = filterData.timeframes.map(tf => ({ ...tf, label: tf.name }))
      const gradeOptions = filterData.grades.map(grade => ({ ...grade, label: grade.name }))
      const schoolOptions = filterData.schools.map(school => ({ ...school, label: school.name, value: school.id }))

      const timeframe = defaultTimeframe(timeframeOptions)

      setAllGrades(gradeOptions)
      setAllTimeframes(timeframeOptions)
      setAllSchools(schoolOptions)
      setSelectedGrades(gradeOptions)
      setSelectedSchools(schoolOptions)
      setLastUsedTimeframe(timeframe)
      setSelectedTimeframe(timeframe)
      setLoadingFilters(false)
    })
  }

  function clearFilters() {
    setSelectedGrades(allGrades)
    setSelectedSchools(allSchools)
    setSelectedTimeframe(defaultTimeframe(allTimeframes))
    applyFilters()
    setHasAdjustedFiltersFromDefault(false)
  }

  function applyFilters() {
    setSearchCount(searchCount + 1)
    setLastSubmittedGrades(selectedGrades)
    setLastSubmittedSchools(selectedSchools)
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
      adminId={adminInfo.id}
      className={section.className}
      customTimeframeEnd={customEndDate?.toDate()}
      customTimeframeStart={customStartDate?.toDate()}
      itemGroupings={section.itemGroupings}
      key={section.name}
      name={section.name}
      searchCount={searchCount}
      selectedGrades={selectedGrades.map(g => g.value)}
      selectedSchoolIds={selectedSchools.map(s => s.id)}
      selectedTimeframe={selectedTimeframe.value}
    />
  ))

  const filterProps = {
    allTimeframes,
    allSchools,
    allGrades,
    applyFilters,
    clearFilters,
    selectedGrades,
    setSelectedGrades,
    hasAdjustedFiltersFromDefault,
    handleSetSelectedTimeframe,
    selectedTimeframe,
    selectedSchools,
    setSelectedSchools,
    closeMobileFilterMenu,
    showMobileFilterMenu,
    hasAdjustedFiltersSinceLastSubmission,
    customStartDate,
    customEndDate,
  }

  return (
    <div className="usage-snapshots-container white-background-accommodate-footer">
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
          <h1>Usage Snapshot Report</h1>
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
