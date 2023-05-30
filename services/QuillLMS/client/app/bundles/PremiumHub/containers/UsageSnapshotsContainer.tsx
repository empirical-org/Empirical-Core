import React from 'react'
import "react-dates/initialize";
import moment from 'moment'
import { DateRangePicker } from 'react-dates';

import SnapshotSection from '../components/usage_snapshots/snapshotSection'
import { snapshotSections, TAB_NAMES, ALL, CUSTOM, } from '../components/usage_snapshots/shared'
import { Spinner, DropdownInput, KEYDOWN, MOUSEDOWN } from '../../Shared/index'

const removeSearchTokenSrc = `${process.env.CDN_URL}/images/pages/administrator/remove_search_token.svg`

const rightArrowImg = <img alt="" src={`${process.env.CDN_URL}/images/pages/administrator/right_arrow.svg`} />
const leftArrowImg = <img alt="" src={`${process.env.CDN_URL}/images/pages/administrator/left_arrow.svg`} />

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

const CustomDateModal = ({ close, passedStartDate, setCustomDates, passedEndDate, }) => {
  const [focusedInput, setFocusedInput] = React.useState("startDate")
  const [startDate, setStartDate] = React.useState(passedStartDate)
  const [endDate, setEndDate] = React.useState(passedEndDate)
  const [buttonSectionStyle, setButtonSectionStyle] = React.useState({})

  function handleDateChange(newDates) {
    setStartDate(newDates.startDate)
    setEndDate(newDates.endDate)
  }

  function handleClickApply() {
    setCustomDates(startDate, endDate)
  }

  function handleSetFocusedInput(newFocusedInput) {
    if (!newFocusedInput) { return }

    setFocusedInput(newFocusedInput)
  }

  function isOutsideRange() { return false }

  return (
    <div className="modal-container custom-date-modal-container">
      <div className="modal-background" />
      <div className="custom-date-modal quill-modal modal-body">
        <h2>Select custom date range</h2>
        <DateRangePicker
          autoFocus={true}
          endDate={endDate}
          focusedInput={focusedInput}
          isOutsideRange={isOutsideRange}
          navNext={rightArrowImg}
          navPrev={leftArrowImg}
          onDatesChange={handleDateChange}
          onFocusChange={handleSetFocusedInput}
          startDate={startDate}
        />
        <div className="button-section">
          <button className="quill-button medium secondary outlined focus-on-light" onClick={close} type="button">Cancel</button>
          <button className="quill-button medium primary contained focus-on-light" onClick={handleClickApply} type="button">Apply</button>
        </div>
      </div>
    </div>
  )
}

const Tab = ({ section, setSelectedTab, selectedTab }) => {
  function handleSetSelectedTab() { setSelectedTab(section) }

  let className = 'tab'
  if (section === selectedTab) {
    className += ' selected-tab'
  }

  return <button className={className} onClick={handleSetSelectedTab} type="button">{section}</button>
}

const SearchToken = ({ searchItem, onRemoveSearchItem, }) => {
  function handleRemoveSearchItem() { onRemoveSearchItem(searchItem)}

  return (
    <div className="search-token">
      <span>{searchItem.label}</span>
      <button aria-label={`Remove ${searchItem.label} from filtered list`} className="interactive-wrapper focus-on-light" onClick={handleRemoveSearchItem} type="button"><img alt="" src={removeSearchTokenSrc} /></button>
    </div>
  )
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
  const [filterButtonsAreFixed, setFilterButtonsAreFixed] = React.useState(true)
  const [showCustomDateModal, setShowCustomDateModal] = React.useState(false)
  const [lastUsedTimeframe, setLastUsedTimeframe] = React.useState(null)

  React.useEffect(() => {
    getFilters()
  }, [])

  React.useEffect(() => {
    const el = document.getElementsByClassName('home-footer')[0]
    const observer = new IntersectionObserver(([entry]) => { entry.isIntersecting ? setFilterButtonsAreFixed(false) : setFilterButtonsAreFixed(true); });

    el && observer.observe(el);
  }, []);

  React.useEffect(() => {
    if (selectedSchools !== allSchools || selectedGrades !== allGrades || selectedTimeframe !== defaultTimeframe(allTimeframes)) {
      setHasAdjustedFilters(true)
    }
  }, [selectedSchools, selectedGrades, selectedTimeframe])

  React.useEffect(() => {
    if (showCustomDateModal || (customStartDate && customEndDate) || !lastUsedTimeframe) { return }

    setSelectedTimeframe(lastUsedTimeframe)
  }, [showCustomDateModal])

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

  if (loadingFilters) {
    return <Spinner />
  }

  function handleClickDownloadReport() { window.print() }

  function handleRemoveSchool(school) {
    const newSchools = selectedSchools.filter(s => s.id !== school.id)
    setSelectedSchools(newSchools)
  }

  function handleRemoveGrade(grade) {
    const newGrades = selectedGrades.filter(g => g.value !== grade.value)
    setSelectedGrades(newGrades)
  }

  const schoolSearchTokens = selectedSchools !== allSchools && selectedSchools.map(s => (
    <SearchToken
      key={s.id}
      onRemoveSearchItem={handleRemoveSchool}
      searchItem={s}
    />
  ))

  const gradeSearchTokens = selectedGrades !== allGrades && selectedGrades.map(grade => (
    <SearchToken
      key={grade.value}
      onRemoveSearchItem={handleRemoveGrade}
      searchItem={grade}
    />
  ))

  const tabs = TAB_NAMES.map(s => (
    <Tab
      key={s}
      section={s}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
  ))

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

  function renderFilterButtons(alwaysShow) {
    if (!hasAdjustedFilters) { return null }

    if (!alwaysShow && !filterButtonsAreFixed) { return null }

    return (
      <div className={`filter-buttons ${filterButtonsAreFixed && !alwaysShow ? 'fixed' : ''}`}>
        <button className="quill-button small outlined secondary focus-on-light" onClick={clearFilters} type="button">Clear filters</button>
        <button className="quill-button small contained primary focus-on-light" onClick={applyFilters} type="button">Apply filters</button>
      </div>
    )
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
      <section className="filter-container">
        <div className="filters">
          <label className="filter-label" htmlFor="timeframe-filter">Timeframe</label>
          <DropdownInput
            handleChange={handleSetSelectedTimeframe}
            id="timeframe-filter"
            isSearchable={false}
            label=""
            options={allTimeframes}
            value={selectedTimeframe}
          />
          <label className="filter-label" htmlFor="school-filter">School</label>
          <DropdownInput
            handleChange={setSelectedSchools}
            id="school-filter"
            isMulti={true}
            isSearchable={true}
            label=""
            options={allSchools}
            optionType='school'
            value={selectedSchools}
          />
          <div className="search-tokens">{schoolSearchTokens}</div>
          <label className="filter-label" htmlFor="grade-filter">Grade</label>
          <DropdownInput
            handleChange={setSelectedGrades}
            id="grade-filter"
            isMulti={true}
            isSearchable={true}
            label=""
            options={allGrades}
            optionType='grade'
            value={selectedGrades}
          />
          <div className="search-tokens">{gradeSearchTokens}</div>
        </div>
        {renderFilterButtons(true)}
        {renderFilterButtons(false)}
      </section>
      <main>
        <div className="header">
          <h1>Usage Snapshot Report</h1>
          <button className="quill-button contained primary medium focus-on-light" onClick={handleClickDownloadReport} type="button">Download Report</button>
        </div>
        <div aria-hidden={true} className="tabs">
          {tabs}
        </div>
        <div className="sections">
          {snapshotSectionComponents}
        </div>
      </main>
    </div>
  )
}

export default UsageSnapshotsContainer
