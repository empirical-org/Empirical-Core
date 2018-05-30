import React from 'react';
import ActivitySearchFilter from './activity_search_filter';
import _ from 'underscore';
import SearchActivitiesInput from '../search_activities_input';

export default React.createClass({

  render() {
    const dropDowns = [];
    let appFilter;
    this.props.data.forEach((filter, index) => {
      if (index < 2) {
        dropDowns.push(<ActivitySearchFilter showAllId={this.props.showAllId} key={filter.alias} selectFilterOption={this.props.selectFilterOption} data={filter} activeFilterOn={this.props.activeFilterOn} />);
      } else {
        appFilter = <ActivitySearchFilter showAllId={this.props.showAllId} key={filter.alias} selectFilterOption={this.props.selectFilterOption} data={filter} activeFilterOn={this.props.activeFilterOn} />;
      }
    });
    const clearAll = <button key="clear-all" type="button" className="clear-button select-mixin button-select button-select-wrapper" onClick={this.props.clearFilters}>Clear<img src="/images/x.svg" /></button>;
    const dropDownFilters = (<span className="activity-filter-drop-downs" key="activity-filter-drop-downs">
      {[dropDowns, clearAll]}
    </span>);

    const dropDownFiltersAndSearch = [<SearchActivitiesInput key="activity-search" searchQuery={this.props.searchQuery} updateSearchQuery={this.props.updateSearchQuery} />].concat(dropDownFilters);
    return (
      <div className="row activity-page-dropdown-wrapper">
        <div className="drop-down-filters-and-search ">
          {dropDownFiltersAndSearch}
        </div>
        {appFilter}
      </div>
    );
  },
});
