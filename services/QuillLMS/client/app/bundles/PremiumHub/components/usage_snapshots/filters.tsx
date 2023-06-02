import * as React from 'react'

import { DropdownInput } from '../../../Shared/index'
import useWindowSize from '../../../Shared/hooks/useWindowSize';
const MAX_VIEW_WIDTH_FOR_MOBILE = 1134

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

const Filters = ({ allTimeframes, allSchools, allGrades, applyFilters, clearFilters, selectedGrades, setSelectedGrades, hasAdjustedFilters, handleSetSelectedTimeframe, selectedTimeframe, selectedSchools, setSelectedSchools, closeMobileFilterMenu, showMobileFilterMenu, }) => {
  const [filterButtonsAreFixed, setFilterButtonsAreFixed] = React.useState(true)
  const size = useWindowSize();

  React.useEffect(() => {
    const el = document.getElementsByClassName('home-footer')[0]
    const observer = new IntersectionObserver(([entry]) => { entry.isIntersecting ? setFilterButtonsAreFixed(false) : setFilterButtonsAreFixed(true); });

    el && observer.observe(el);
  }, []);

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

  function renderFilterButtons(alwaysShow) {
    if (!hasAdjustedFilters) { return null }

    if (!alwaysShow && !filterButtonsAreFixed) { return null }

    const showAsFixed = (filterButtonsAreFixed && !alwaysShow) || size.width <= MAX_VIEW_WIDTH_FOR_MOBILE

    return (
      <div className={`filter-buttons ${showAsFixed ? 'fixed' : ''}`}>
        <button className="quill-button small outlined secondary focus-on-light" onClick={clearFilters} type="button">Clear filters</button>
        <button className="quill-button small contained primary focus-on-light" onClick={applyFilters} type="button">Apply filters</button>
      </div>
    )
  }

  return (
    <section className={`filter-container ${showMobileFilterMenu ? 'mobile-open' : 'mobile-hidden'} ${hasAdjustedFilters ? 'space-for-buttons' : ''}`}>
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
  )
}

export default Filters
