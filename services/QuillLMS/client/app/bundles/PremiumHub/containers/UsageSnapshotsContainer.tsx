import React from 'react'

import CustomDateModal from '../components/usage_snapshots/customDateModal'
import SnapshotSection from '../components/usage_snapshots/snapshotSection'
import Filters from '../components/usage_snapshots/filters'
import { snapshotSections, TAB_NAMES, ALL, CUSTOM, } from '../components/usage_snapshots/shared'
import { Spinner, DropdownInput, } from '../../Shared/index'
import useWindowSize from '../../Shared/hooks/useWindowSize';

const MAX_VIEW_WIDTH_FOR_MOBILE = 850

const filterIconSrc = `${process.env.CDN_URL}/images/icons/icons-filter.svg`

const filterData = {
  timeframes: [
    {default: true, name: "Last 30 days",  value: "last-30-days"},
    {default: false, name: "Last 90 days",  value: "last-90-days"},
    {default: false, name: "This month",  value: "this-month"},
    {default: false, name: "This month",  value: "last-month"},
    {default: false, name: "This year",  value: "this-year"},
    {default: false, name: "Last year",  value: "last-year"},
    {default: false, name: "All time",  value: "all-time"},
    {default: false, name: "Custom date range",  value: "custom"}
  ],
  schools: [
    {"id":32628, name: "Wayne High School"},
    {"id":32629, name: "John High School"},
    {"id":32630, name: "Brooks High School"},
    {"id":32631, name: "Water High School"},
  ],
  grades: [
    { value: "Kindergarten", name: "Kindergarten"},
    { value: "1", name: "1st"},
    { value: "2", name: "2nd"},
    { value: "3", name: "3rd"},
    { value: "4", name: "4th"},
    { value: "5", name: "5th"},
    { value: "6", name: "6th"},
    { value: "7", name: "7th"},
    { value: "8", name: "8th"},
    { value: "9", name: "9th"},
    { value: "10", name: "10th"},
    { value: "11", name: "11th"},
    { value: "12", name: "12th"},
    { value: "University", name: "University"},
    { value: "Other", name: "Other"}
  ]
}

const Tab = ({ section, setSelectedTab, selectedTab }) => {
  function handleSetSelectedTab() { setSelectedTab(section) }

  let className = 'tab'
  if (section === selectedTab) {
    className += ' selected-tab'
  }

  return <button className={className} onClick={handleSetSelectedTab} type="button">{section}</button>
}

const UsageSnapshotsContainer = ({}) => {
  const [loadingFilters, setLoadingFilters] = React.useState(true)
  const [allTimeframes, setAllTimeframes] = React.useState(null)
  const [allSchools, setAllSchools] = React.useState(null)
  const [allGrades, setAllGrades] = React.useState(null)
  const [selectedSchools, setSelectedSchools] = React.useState(null)
  const [selectedGrades, setSelectedGrades] = React.useState(null)
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(null)
  const [hasAdjustedFilters, setHasAdjustedFilters] = React.useState(null)
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
    if (selectedSchools !== allSchools || selectedGrades !== allGrades || selectedTimeframe !== defaultTimeframe(allTimeframes)) {
      setHasAdjustedFilters(true)
    }
  }, [selectedSchools, selectedGrades, selectedTimeframe])

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
  }

  function clearFilters() {
    setSelectedGrades(allGrades)
    setSelectedSchools(allSchools)
    setSelectedTimeframe(defaultTimeframe(allTimeframes))
    applyFilters()
    setHasAdjustedFilters(false)
  }

  function applyFilters() {
    setSearchCount(searchCount + 1)
  }

  function closeCustomDateModal() { setShowCustomDateModal(false) }

  function setCustomDates(startDate, endDate) {
    setCustomStartDate(startDate)
    setCustomEndDate(endDate)
    closeCustomDateModal()
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
      className={section.className}
      itemGroupings={section.itemGroupings}
      key={section.name}
      name={section.name}
      searchCount={searchCount}
      selectedGrades={selectedGrades}
      selectedSchools={selectedSchools}
      selectedTimeframe={selectedTimeframe}
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
    hasAdjustedFilters,
    handleSetSelectedTimeframe,
    selectedTimeframe,
    selectedSchools,
    setSelectedSchools,
    closeMobileFilterMenu,
    showMobileFilterMenu,
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
      </main>
    </div>
  )
}

export default UsageSnapshotsContainer
