import React from 'react';
import _ from 'underscore';

import ActivitySearchFilter from './activity_search_filter';

import SearchActivitiesInput from '../search_activities_input';

const ActivitySearchFilters = (props) => {
  const {
    data,
    showAllId,
    selectFilterOption,
    activeFilterOn,
    clearFilters,
    updateSearchQuery,
  } = props
  const dropDowns = [];
  let appFilter;
  data.forEach((filter, index) => {
    if (index < 2) {
      dropDowns.push(<ActivitySearchFilter
        activeFilterOn={activeFilterOn}
        data={filter}
        key={filter.alias}
        selectFilterOption={selectFilterOption}
        showAllId={showAllId}
      />)
    } else {
      appFilter = (<ActivitySearchFilter
        activeFilterOn={activeFilterOn}
        data={filter}
        key={filter.alias}
        selectFilterOption={selectFilterOption}
        showAllId={showAllId}
      />)
    }
  });

  const dropDownFilters = (<span className="activity-filter-drop-downs" key="activity-filter-drop-downs">
    {[dropDowns]}
  </span>);

  const clearAllFilters = activeFilterOn ? <p className="clear-all-filters" onClick={clearFilters}>Clear all filters</p> : null

  const dropDownFiltersAndSearch = [<SearchActivitiesInput key="activity-search" searchQuery={props.searchQuery} updateSearchQuery={updateSearchQuery} />].concat(dropDownFilters);
  return (
    <div className="activity-page-dropdown-wrapper">
      <div className="drop-down-filters-and-search ">
        {dropDownFiltersAndSearch}
      </div>
      {appFilter}
      {clearAllFilters}
    </div>
  );
}

export default ActivitySearchFilters
