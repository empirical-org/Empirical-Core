import * as React from 'react'

import { DropdownInput, DropdownInputWithSearchTokens, Tooltip, helpIcon, } from '../../../Shared/index'
import FilterScope from '../filterScope'
import { FETCH_ACTION, RESET_ACTION } from '../../shared'

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`
const DIAGNOSTIC_GROWTH_REPORT_PATH = 'diagnostic_growth_report'

const Filters = ({
  availableTimeframes,
  availableSchools,
  availableGrades,
  availableTeachers,
  availableClassrooms,
  originalAllClassrooms,
  applyFilters,
  clearFilters,
  selectedGrades,
  setSelectedGrades,
  hasAdjustedFiltersFromDefault,
  handleSetSelectedTimeframe,
  selectedTimeframe,
  selectedSchools,
  setSelectedSchools,
  selectedTeachers,
  setSelectedTeachers,
  selectedClassrooms,
  setSelectedClassrooms,
  closeMobileFilterMenu,
  showMobileFilterMenu,
  hasAdjustedFiltersSinceLastSubmission,
  customStartDate,
  customEndDate,
  showFilterMenuButton,
  reportType,
  diagnosticIdForStudentCount,
  pusherChannel
}) => {

  const isGrowthDiagnosticReport = reportType === DIAGNOSTIC_GROWTH_REPORT_PATH

  /* this is a piece of state needed for a UI specification requested by PS and Jack where the filter buttons
     container will expand in height only for the Student section of the Growth Reports
  */
  const [applyFilterButtonClicked, setApplyFilterButtonClicked] = React.useState<boolean>(false)
  const [filterScopeAction, setFilterScopeAction] = React.useState<string>('')

  function effectiveSelectedSchools() {
    return selectedSchools.filter(s => availableSchools.find(as => as.id === s.id))
  }

  function effectiveSelectedTeachers() {
    return selectedTeachers.filter(t => availableTeachers.find(at => at.id === t.id))
  }

  function effectiveSelectedClassrooms() {
    // this accounts for a weird edge case documented in this card: https://www.notion.so/quill/Address-issue-in-the-admin-report-filters-causing-the-Classroom-filter-to-sometimes-end-up-in-an-u-b10b51c217114e67ae937120be73ecfd
    if(selectedTeachers.length === availableTeachers.length) {
      setSelectedClassrooms(originalAllClassrooms)
    }
    return selectedClassrooms.filter(c => availableClassrooms.find(ac => ac.id === c.id))
  }

  function handleSetFilterScopeAction(value: string) {
    setFilterScopeAction(value)
  }

  function handleSetApplyFilterButtonClicked(value: boolean) {
    setApplyFilterButtonClicked(value)
  }

  function handleApplyFilters() {
    if(isGrowthDiagnosticReport && diagnosticIdForStudentCount) {
      setFilterScopeAction(FETCH_ACTION)
    }
    applyFilters()
  }

  function handleClearFilters() {
    if (isGrowthDiagnosticReport) {
      setApplyFilterButtonClicked(false)
      setFilterScopeAction(RESET_ACTION)
    }
    clearFilters()
  }

  function renderFilterScope() {
    if(!isGrowthDiagnosticReport) { return }
    return(
      <FilterScope
        diagnosticIdForStudentCount={diagnosticIdForStudentCount}
        filterScopeAction={filterScopeAction}
        handleSetApplyFilterButtonClicked={handleSetApplyFilterButtonClicked}
        handleSetFilterScopeAction={handleSetFilterScopeAction}
        hasAdjustedFiltersFromDefault={hasAdjustedFiltersFromDefault}
        pusherChannel={pusherChannel}
        selectedClassrooms={selectedClassrooms}
        selectedGrades={selectedGrades}
        selectedSchools={selectedSchools}
        selectedTeachers={selectedTeachers}
        selectedTimeframe={selectedTimeframe}
      />
    )
  }

  function renderFilterButtons() {
    if (!hasAdjustedFiltersFromDefault && !hasAdjustedFiltersSinceLastSubmission) { return null }

    let applyClassName = "quill-button-archived small contained primary focus-on-light"

    applyClassName += hasAdjustedFiltersSinceLastSubmission ? '' : ' disabled'

    return (
      <div className={`filter-buttons-container fixed ${applyFilterButtonClicked ? 'with-count ' : ''}`}>
        {renderFilterScope()}
        <div className="filter-buttons">
          <button className="quill-button-archived small outlined secondary focus-on-light" onClick={handleClearFilters} type="button">Clear filters</button>
          <button className={applyClassName} onClick={handleApplyFilters} type="button">Apply filters</button>
        </div>
      </div>
    )
  }

  const timeframeHelperText = customStartDate && customEndDate ? `${customStartDate.format('MM/DD/YYYY')} - ${customEndDate.format('MM/DD/YYYY')}` : null

  let classroomsFilter = (
    <div className="disabled-classroom-filter">
      <label className="filter-label" htmlFor="classroom-filter">
        <span>Classroom</span>
        <Tooltip
          tooltipText="To filter by classroom, first apply broader filters above."
          tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
        />
      </label>
      <DropdownInput
        disabled={true}
        id="classroom-filter"
        isMulti={true}
        isSearchable={true}
        label=""
        options={[availableClassrooms[0]]}
        optionType="classroom"
        value={[selectedClassrooms[0]]}
      />
    </div>
  )

  if (availableClassrooms.length) {
    classroomsFilter = (
      <DropdownInputWithSearchTokens
        id="classroom-filter"
        identifier="id"
        label="Classroom"
        onChange={setSelectedClassrooms}
        options={availableClassrooms}
        optionType="classroom"
        value={selectedClassrooms}
        valueToDisplay={effectiveSelectedClassrooms()}
      />
    )
  }

  return (
    <section className={`filter-container ${showMobileFilterMenu ? 'mobile-open' : 'mobile-hidden'} ${hasAdjustedFiltersFromDefault ? 'space-for-buttons' : ''}`} data-testid="filter-menu" >
      <div className="top-section">
        <button className="interactive-wrapper focus-on-light" onClick={closeMobileFilterMenu} type="button">
          <img alt="" src={closeIconSrc} />
          Close
        </button>
      </div>
      <div className="filters">
        <div className="dropdowns">
          <div className="show-filter-menu-button-wrapper">
            {showFilterMenuButton}
          </div>
          <label className="filter-label" htmlFor="timeframe-filter">
            <span>Timeframe</span>
            <Tooltip
              tooltipText={isGrowthDiagnosticReport ? "To ensure meaningful results, this report must be viewed for an entire school year, defined as July 1 through June 30. This report is updated nightly." : "This report is updated nightly."}
              tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
            />
          </label>
          <DropdownInput
            className=""
            handleChange={handleSetSelectedTimeframe}
            helperText={timeframeHelperText}
            id="timeframe-filter"
            isSearchable={false}
            label=""
            options={availableTimeframes}
            value={selectedTimeframe}
          />
          <DropdownInputWithSearchTokens
            id="school-filter"
            identifier="id"
            label="School"
            onChange={setSelectedSchools}
            options={availableSchools}
            optionType="school"
            value={selectedSchools}
            valueToDisplay={effectiveSelectedSchools()}
          />
          <DropdownInputWithSearchTokens
            id="grade-filter"
            identifier="value"
            label="Grade"
            onChange={setSelectedGrades}
            options={availableGrades}
            optionType="grade"
            value={selectedGrades}
            valueToDisplay={selectedGrades}
          />
          <DropdownInputWithSearchTokens
            id="teacher-filter"
            identifier="id"
            label="Teacher"
            onChange={setSelectedTeachers}
            options={availableTeachers}
            optionType="teacher"
            value={selectedTeachers}
            valueToDisplay={effectiveSelectedTeachers()}
          />
          {classroomsFilter}
        </div>
      </div>
      {renderFilterButtons()}
    </section>
  )
}

export default Filters
