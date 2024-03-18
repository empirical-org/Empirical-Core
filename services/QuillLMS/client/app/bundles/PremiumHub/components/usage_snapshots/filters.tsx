import * as React from 'react'

import { DropdownInput, DropdownInputWithSearchTokens, Tooltip, helpIcon, } from '../../../Shared/index'
import { requestPost } from '../../../../modules/request'
import { hashPayload } from '../../shared'

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`
const DIAGNOSTIC_GROWTH_REPORT_PATH = 'diagnostic_growth_report'
const PUSHER_EVENT_KEY = "admin-diagnostic-students-cached";
const FILTER_SCOPE_QUERY_KEY = 'filter-scope'

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
  reportType,
  diagnosticIdForStudentCount,
  pusherChannel
}) => {

  const isGrowthDiagnosticReport = reportType === DIAGNOSTIC_GROWTH_REPORT_PATH

  const [pusherMessage, setPusherMessage] = React.useState<string>(null)
  const [applyFilterButtonClicked, setApplyFilterButtonClicked] = React.useState<boolean>(false)
  const [loadingStudentCount, setLoadingStudentCount] = React.useState<boolean>(true)
  const [totalStudentCountForFilters, setTotalStudentCountForFilters] = React.useState<Number>(null)
  const [totalStudentMatchesForFilters, setTotalStudentMatchesForFilters] = React.useState<Number>(null)

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    if (!pusherMessage) return

    if (pusherMessage === getFilterHash({ key: FILTER_SCOPE_QUERY_KEY, id: diagnosticIdForStudentCount, withFilters: false })) {
      getStudentCountData()
    }
    if (pusherMessage === getFilterHash({ key: FILTER_SCOPE_QUERY_KEY, id: diagnosticIdForStudentCount, withFilters: true })) {
      getStudentCountData()
    }
  }, [pusherMessage])

  React.useEffect(() => {
    if (isGrowthDiagnosticReport && diagnosticIdForStudentCount && hasAdjustedFiltersFromDefault && !totalStudentCountForFilters && !totalStudentMatchesForFilters) {
      getStudentCountData()
    }
  }, [diagnosticIdForStudentCount])

  React.useEffect(() => {
    if (totalStudentCountForFilters && totalStudentMatchesForFilters) {
      setLoadingStudentCount(false)
      setApplyFilterButtonClicked(true)
    }
  }, [totalStudentCountForFilters, totalStudentMatchesForFilters])

  React.useEffect(() => {
    setApplyFilterButtonClicked(false)
    resetCounts()
  }, [diagnosticIdForStudentCount])

  function initializePusher() {
    pusherChannel?.bind(PUSHER_EVENT_KEY, (body) => {
      const { message, } = body

      setPusherMessage(message)
    });
  };

  function getFilterHash({ key, id, withFilters }) {
    const filterTarget = [].concat(
      key,
      id,
      selectedTimeframe.value,
      withFilters ? selectedSchools.map(s => s.id) : null,
      withFilters ? selectedGrades.map(g => g.value) : null,
      withFilters ? selectedTeachers.map(t => t.id) : null,
      withFilters ? selectedClassrooms.map(c => c.id) : null,
    )
    return hashPayload(filterTarget)
  }

  function resetCounts() {
    setTotalStudentMatchesForFilters(null)
    setTotalStudentCountForFilters(null)
  }

  function getStudentCountData() {
    resetCounts()
    setLoadingStudentCount(true)
    getStudentCountDataForFilters(false)
    getStudentCountDataForFilters(true)
  }

  function getStudentCountDataForFilters(withFilters) {
    const searchParams = {
      query: FILTER_SCOPE_QUERY_KEY,
      timeframe: selectedTimeframe.value,
      school_ids: withFilters ? selectedSchools.map(s => s.id) : null,
      teacher_ids: withFilters ? selectedTeachers.map(t => t.id) : null,
      classroom_ids: withFilters ? selectedClassrooms.map(c => c.id) : null,
      grades: withFilters ? selectedGrades.map(g => g.value) : null,
      diagnostic_id: diagnosticIdForStudentCount
    }

    requestPost('/admin_diagnostic_students/report', searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        return
      } else {
        const { results } = body
        const { count } = results
        if (withFilters) {
          setTotalStudentMatchesForFilters(count)
        } else {
          setTotalStudentCountForFilters(count)
        }
      }
    })
  }

  function effectiveSelectedSchools() {
    return selectedSchools.filter(s => availableSchools.find(as => as.id === s.id))
  }

  function effectiveSelectedTeachers() {
    return selectedTeachers.filter(t => availableTeachers.find(at => at.id === t.id))
  }

  function effectiveSelectedClassrooms() {
    return selectedClassrooms.filter(c => availableClassrooms.find(ac => ac.id === c.id))
  }

  function renderStudentCount() {
    const matchText = totalStudentMatchesForFilters === 1 ? 'match' : 'matches'
    const totalText = totalStudentCountForFilters === 1 ? 'student' : 'students'
    return <p className="filters-student-count"><strong>{totalStudentMatchesForFilters}</strong> {matchText} from <strong>{totalStudentCountForFilters}</strong> {totalText}</p>
  }

  function handleApplyFilters() {
    if(isGrowthDiagnosticReport && diagnosticIdForStudentCount) {
      getStudentCountData()
    }
    applyFilters()
  }

  function handleClearFilters() {
    if (isGrowthDiagnosticReport) {
      resetCounts()
      setApplyFilterButtonClicked(false)
    }
    clearFilters()
  }

  function renderFilterButtons() {
    if (!hasAdjustedFiltersFromDefault && !hasAdjustedFiltersSinceLastSubmission) { return null }

    const shouldDisplayStudentCount = isGrowthDiagnosticReport && !loadingStudentCount && totalStudentCountForFilters && totalStudentMatchesForFilters
    let applyClassName = "quill-button small contained primary focus-on-light"

    applyClassName += hasAdjustedFiltersSinceLastSubmission ? '' : ' disabled'

    return (
      <div className={`filter-buttons-container fixed ${applyFilterButtonClicked ? 'with-count ' : ''}`}>
        {shouldDisplayStudentCount && renderStudentCount()}
        <div className="filter-buttons">
          <button className="quill-button small outlined secondary focus-on-light" onClick={handleClearFilters} type="button">Clear filters</button>
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
