import * as React from 'react'

import { DropdownInput, DropdownInputWithSearchTokens, Tooltip, helpIcon, } from '../../../Shared/index'
import useWindowSize from '../../../Shared/hooks/useWindowSize';

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`

const MAXIMUM_CLASSROOM_LENGTH_FOR_FILTERS = 1500

const Filters = ({ allTimeframes, allSchools, allGrades, allTeachers, allClassrooms, applyFilters, clearFilters, selectedGrades, setSelectedGrades, hasAdjustedFiltersFromDefault, handleSetSelectedTimeframe, selectedTimeframe, selectedSchools, setSelectedSchools, selectedTeachers, setSelectedTeachers, selectedClassrooms, setSelectedClassrooms, closeMobileFilterMenu, showMobileFilterMenu, hasAdjustedFiltersSinceLastSubmission, customStartDate, customEndDate, }) => {
  const size = useWindowSize();

  function effectiveSelectedSchools() {
    return selectedSchools.filter(s => allSchools.find(as => as.id === s.id))
  }

  function effectiveSelectedTeachers() {
    return selectedTeachers.filter(t => allTeachers.find(at => at.id === t.id))
  }

  function effectiveSelectedClassrooms() {
    return selectedClassrooms.filter(c => allClassrooms.find(ac => ac.id === c.id))
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
        options={[allClassrooms[0]]}
        optionType="classroom"
        value={[selectedClassrooms[0]]}
      />
    </div>
  )

  if (allClassrooms.length < MAXIMUM_CLASSROOM_LENGTH_FOR_FILTERS) {
    classroomsFilter = (
      <DropdownInputWithSearchTokens
        id="classroom-filter"
        identifier="id"
        label="Classroom"
        onChange={setSelectedClassrooms}
        options={allClassrooms}
        optionType="classroom"
        value={selectedClassrooms}
        valueToDisplay={effectiveSelectedClassrooms()}
      />
    )
  }

  return (
    <section className={`filter-container ${showMobileFilterMenu ? 'mobile-open' : 'mobile-hidden'} ${hasAdjustedFiltersFromDefault ? 'space-for-buttons' : ''}`}>
      <div className="top-section">
        <button className="interactive-wrapper focus-on-light" onClick={closeMobileFilterMenu} type="button">
          <img alt="" src={closeIconSrc} />
          Close
        </button>
      </div>
      <div className="filters">
        <label className="filter-label" htmlFor="timeframe-filter">
          <span>Timeframe</span>
          <Tooltip
            tooltipText="This report is updated nightly."
            tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
          />
        </label>
        <DropdownInput
          handleChange={handleSetSelectedTimeframe}
          helperText={timeframeHelperText}
          id="timeframe-filter"
          isSearchable={false}
          label=""
          options={allTimeframes}
          value={selectedTimeframe}
        />
        <DropdownInputWithSearchTokens
          id="school-filter"
          identifier="id"
          label="School"
          onChange={setSelectedSchools}
          options={allSchools}
          optionType="school"
          value={selectedSchools}
          valueToDisplay={effectiveSelectedSchools()}
        />
        <DropdownInputWithSearchTokens
          id="grade-filter"
          identifier="value"
          label="Grade"
          onChange={setSelectedGrades}
          options={allGrades}
          optionType="grade"
          value={selectedGrades}
          valueToDisplay={selectedGrades}
        />
        <DropdownInputWithSearchTokens
          id="teacher-filter"
          identifier="id"
          label="Teacher"
          onChange={setSelectedTeachers}
          options={allTeachers}
          optionType="teacher"
          value={selectedTeachers}
          valueToDisplay={effectiveSelectedTeachers()}
        />
        {classroomsFilter}
      </div>
      {renderFilterButtons()}
    </section>
  )
}

export default Filters
