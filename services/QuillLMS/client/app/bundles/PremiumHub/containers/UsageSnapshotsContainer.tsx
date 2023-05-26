import React from 'react'

import SnapshotSection from '../components/usage_snapshots/snapshotSection'
import { snapshotSections, TAB_NAMES, ALL, } from '../components/usage_snapshots/shared'
import { Spinner, DropdownInput, } from '../../Shared/index'

const removeSearchTokenSrc = `${process.env.CDN_URL}/images/pages/administrator/remove_search_token.svg`

const filterData = {
  timeframes: [
    {default: true, name: "Last 30 days",  value: "last-30-days"},
    {default: false, name: "Last 90 days",  value: "last-90-days"},
    {default: false, name: "This month",  value: "this-month"},
    {default: false, name: "This month",  value: "last-month"},
    {default: false, name: "This year",  value: "this-year"},
    {default: false, name: "Last year",  value: "last-year"},
    {default: false, name: "All time",  value: "all-time"},
    {default: false, name: "Custom",  value: "custom"}
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
  const [customStartDate, setCustomStartDate] = React.useState(null)
  const [customEndDate, setCustomEndDate] = React.useState(null)

  const [selectedTab, setSelectedTab] = React.useState(ALL)

  React.useEffect(() => {
    getFilters()
  }, [])

  function getFilters() {
    const timeframeOptions = filterData.timeframes.map(tf => ({ ...tf, label: tf.name }))
    const gradeOptions = filterData.grades.map(grade => ({ ...grade, label: grade.name }))
    const schoolOptions = filterData.schools.map(school => ({ ...school, label: school.name, value: school.id }))

    const defaultTimeFrame = timeframeOptions.find(timeframe => timeframe.default)

    setAllGrades(gradeOptions)
    setAllTimeframes(timeframeOptions)
    setAllSchools(schoolOptions)
    setSelectedGrades(gradeOptions)
    setSelectedSchools(schoolOptions)
    setSelectedTimeframe(defaultTimeFrame.value)
    setLoadingFilters(false)
  }

  if (loadingFilters) {
    return <Spinner />
  }

  function handleClickDownloadReport() { window.print() }

  function onChangeTimeframe(timeframe) { setSelectedTimeframe(timeframe.value) }

  function handleRemoveSchool(school) {
    const newSchools = selectedSchools.filter(s => s.id !== school.id)
    setSelectedSchools(newSchools)
  }

  function handleRemoveGrade(grade) {
    const newGrades = selectedGrades.filter(g => g.value !== grade.value)
    setSelectedGrades(newGrades)
  }

  const selectedTimeFrameOption = allTimeframes.find(tf => tf.value === selectedTimeframe)

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
    />
  ))

  return (
    <div className="usage-snapshots-container white-background-accommodate-footer">
      <section className="filter-container">
        <div className="filters">
          <label className="filter-label" htmlFor="timeframe-filter">Timeframe</label>
          <DropdownInput
            handleChange={onChangeTimeframe}
            id="timeframe-filter"
            isSearchable={false}
            label=""
            options={allTimeframes}
            value={selectedTimeFrameOption}
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
          {schoolSearchTokens}
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
          {gradeSearchTokens}
        </div>
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
