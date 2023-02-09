import * as React from 'react';

import ItemDropdown from '../../components/general_components/dropdown_selectors/item_dropdown';

const ALL_DIAGNOSTICS = 'All Diagnostics'

const ARCHIVED_FLAG = 'Archived'
const SEARCH_BY_ACTIVITY = 'search by activity';
const SEARCH_BY_ACTIVITY_PACK = 'search by activity pack';

export const UnitTemplateFilterInputs = ({
  handleRadioChange,
  searchByActivityPack,
  searchInput,
  handleSearch,
  switchFlag,
  flag,
  options,
  diagnostics,
  diagnostic,
  switchDiagnostic
}) => {

  function diagnosticsDropdown() {
    let diagnosticNames = diagnostics.filter(d => d.data && d.data["flag"] !== ARCHIVED_FLAG.toLowerCase()).map((d) => d.name)
    diagnosticNames.push(ALL_DIAGNOSTICS)
    return (
      <ItemDropdown
        callback={switchDiagnostic}
        items={diagnosticNames}
        selectedItem={diagnostic}
      />
    )
  }

  return(
    <div className="upper-section">
      <div className="activity-or-pack-search-container">
        <div className="radio-options">
          <div className="radio">
            <label htmlFor={SEARCH_BY_ACTIVITY}>
              <input checked={!searchByActivityPack} id={SEARCH_BY_ACTIVITY} onChange={handleRadioChange} type="radio" value={SEARCH_BY_ACTIVITY} />
              {SEARCH_BY_ACTIVITY}
            </label>
          </div>
          <div className="radio">
            <label htmlFor={SEARCH_BY_ACTIVITY_PACK}>
              <input checked={searchByActivityPack} id={SEARCH_BY_ACTIVITY_PACK} onChange={handleRadioChange} type="radio" value={SEARCH_BY_ACTIVITY_PACK} />
              {SEARCH_BY_ACTIVITY_PACK}
            </label>
          </div>
        </div>
      </div>
      {searchByActivityPack && <input
        aria-label="Search by activity pack"
        className="search-box"
        name="searchInput"
        onChange={handleSearch}
        placeholder="Search by activity pack"
        value={searchInput}
      />}
      {!searchByActivityPack && <input
        aria-label="Search by activity"
        className="search-box"
        name="searchInput"
        onChange={handleSearch}
        placeholder="Search by activity"
        value={searchInput}
      />}
      <ItemDropdown
        callback={switchFlag}
        items={options}
        selectedItem={flag}
      />
      {diagnosticsDropdown()}
      <a className='new-unit-template-button quill-button primary contained small focus-on-light' href={`${import.meta.env.VITE_DEFAULT_URL}/cms/unit_templates/new`} rel="noopener noreferrer" target="_blank">New</a>
    </div>
  )
}

export default UnitTemplateFilterInputs;
