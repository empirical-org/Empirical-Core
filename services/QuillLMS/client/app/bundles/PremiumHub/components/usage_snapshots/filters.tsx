import * as React from 'react'

import { DropdownInput } from '../../../Shared/index'
import useWindowSize from '../../../Shared/hooks/useWindowSize';
import { unorderedArraysAreEqual, } from '../../../../modules/unorderedArraysAreEqual'

const removeSearchTokenSrc = `${process.env.CDN_URL}/images/pages/administrator/remove_search_token.svg`
const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`

const SearchToken = ({ searchItem, onRemoveSearchItem, }) => {
  function handleRemoveSearchItem() { onRemoveSearchItem(searchItem)}

  return (
    <div className="search-token">
      <span>{searchItem.label}</span>
      <button aria-label={`Remove ${searchItem.label} from filtered list`} className="interactive-wrapper focus-on-light" onClick={handleRemoveSearchItem} type="button"><img alt="" src={removeSearchTokenSrc} /></button>
    </div>
  )
}

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

  function handleRemoveSchool(school) {
    const newSchools = selectedSchools.filter(s => s.id !== school.id)
    setSelectedSchools(newSchools)
  }

  function handleRemoveTeacher(teacher) {
    const newTeachers = selectedTeachers.filter(s => s.id !== teacher.id)
    setSelectedTeachers(newTeachers)
  }

  function handleRemoveClassroom(classroom) {
    const newClassrooms = selectedClassrooms.filter(s => s.id !== classroom.id)
    setSelectedClassrooms(newClassrooms)
  }

  function handleRemoveGrade(grade) {
    const newGrades = selectedGrades.filter(g => g.value !== grade.value)
    setSelectedGrades(newGrades)
  }

  const schoolSearchTokens = !unorderedArraysAreEqual(effectiveSelectedSchools(), allSchools) && effectiveSelectedSchools().map(s => (
    <SearchToken
      key={s.id}
      onRemoveSearchItem={handleRemoveSchool}
      searchItem={s}
    />
  ))

  const teacherSearchTokens = !unorderedArraysAreEqual(effectiveSelectedTeachers(), allTeachers) && effectiveSelectedTeachers().map(t => (
    <SearchToken
      key={t.id}
      onRemoveSearchItem={handleRemoveTeacher}
      searchItem={t}
    />
  ))

  const classroomSearchTokens = !unorderedArraysAreEqual(effectiveSelectedClassrooms(), allClassrooms) && effectiveSelectedClassrooms().map(c => (
    <SearchToken
      key={c.id}
      onRemoveSearchItem={handleRemoveClassroom}
      searchItem={c}
    />
  ))

  const gradeSearchTokens = !unorderedArraysAreEqual(selectedGrades, allGrades) && selectedGrades.map(grade => (
    <SearchToken
      key={grade.value}
      onRemoveSearchItem={handleRemoveGrade}
      searchItem={grade}
    />
  ))

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

  return (
    <section className={`filter-container ${showMobileFilterMenu ? 'mobile-open' : 'mobile-hidden'} ${hasAdjustedFiltersFromDefault ? 'space-for-buttons' : ''}`}>
      <div className="top-section">
        <button className="interactive-wrapper focus-on-light" onClick={closeMobileFilterMenu} type="button">
          <img alt="" src={closeIconSrc} />
          Close
        </button>
      </div>
      <div className="filters">
        <label className="filter-label" htmlFor="timeframe-filter">Timeframe</label>
        <DropdownInput
          handleChange={handleSetSelectedTimeframe}
          helperText={timeframeHelperText}
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
          value={effectiveSelectedSchools()}
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
        <label className="filter-label" htmlFor="teacher-filter">Teacher</label>
        <DropdownInput
          handleChange={setSelectedTeachers}
          id="teacher-filter"
          isMulti={true}
          isSearchable={true}
          label=""
          options={allTeachers}
          optionType='teacher'
          value={effectiveSelectedTeachers()}
        />
        <div className="search-tokens">{teacherSearchTokens}</div>
        <label className="filter-label" htmlFor="classroom-filter">Classroom</label>
        <DropdownInput
          handleChange={setSelectedClassrooms}
          id="classroom-filter"
          isMulti={true}
          isSearchable={true}
          label=""
          options={allClassrooms}
          optionType='classroom'
          value={effectiveSelectedClassrooms()}
        />
        <div className="search-tokens">{classroomSearchTokens}</div>
      </div>
      {renderFilterButtons()}
    </section>
  )
}

export default Filters
