import * as React from 'react'

import { DropdownInput, DropdownInputWithSearchTokens, Tooltip, helpIcon, } from '../../../Shared/index'
import useWindowSize from '../../../Shared/hooks/useWindowSize';

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`
const DIAGNOSTIC_GROWTH_REPORT_PATH = 'diagnostic_growth_report'

const Filters = ({
  availableTimeframes,
  availableSchools,
  availableGrades,
  availableTeachers,
  availableClassrooms,
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
  reportType
}) => {
  const size = useWindowSize();

  function effectiveSelectedSchools() {
    return selectedSchools.filter(s => availableSchools.find(as => as.id === s.id))
  }

  function effectiveSelectedTeachers() {
    return selectedTeachers.filter(t => availableTeachers.find(at => at.id === t.id))
  }

  function effectiveSelectedClassrooms() {
    return selectedClassrooms.filter(c => availableClassrooms.find(ac => ac.id === c.id))
  }

  function renderFilterButtons() {
    if (!hasAdjustedFiltersFromDefault && !hasAdjustedFiltersSinceLastSubmission) { return null }

    let applyClassName = "quill-button small contained primary focus-on-light"

    applyClassName += hasAdjustedFiltersSinceLastSubmission ? '' : ' disabled'

    return (
      <div className="filter-buttons fixed">
        <button className="quill-button small outlined secondary focus-on-light" onClick={clearFilters} type="button">Clear filters</button>
        <button className={applyClassName} onClick={applyFilters} type="button">Apply filters</button>
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

  const isGrowthDiagnosticReport = reportType === DIAGNOSTIC_GROWTH_REPORT_PATH

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
              tooltipText={isGrowthDiagnosticReport ? "The diagnostic growth report only shows results for the current school year. This report is updated nightly." : "This report is updated nightly."}
              tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
            />
          </label>
          <DropdownInput
            className={isGrowthDiagnosticReport ? 'timeframe-filter disabled' : ''}
            disabled={isGrowthDiagnosticReport}
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
