import React from 'react';
import _ from 'underscore';
import _l from 'lodash';
import $ from 'jquery';

import ActivitySearchAndFilters from './activity_search_filters/activity_search_filters';
import ActivitySearchFilterConfig from './activity_search_filters/activity_search_filter_config';
import ActivitySearchSortConfig from './activity_search_sort/activity_search_sort_config';
import ActivitySearchSorts from './activity_search_sort/activity_search_sorts';
import ActivitySearchResults from './activity_search_results/activity_search_results';
import Pagination from './pagination/pagination';
import SelectedActivities from './selected_activities/selected_activities';
import LoadingIndicator from '../../../shared/loading_indicator.jsx';
import getParameterByName from '../../../modules/get_parameter_by_name';

const resultsPerPage = 25;
const showAllId = 'showAllId';

export default React.createClass({
  propTypes: {
    selectedActivities: React.PropTypes.array.isRequired,
    toggleActivitySelection: React.PropTypes.func.isRequired,
    clickContinue: React.PropTypes.func,
    errorMessage: React.PropTypes.string,
  },

  defaultState() {
    return {
      loading: true,
      filters: ActivitySearchFilterConfig(),
      sorts: ActivitySearchSortConfig,
      maxPageNumber: 1,
      activeFilterOn: !!getParameterByName('tool'),
      error: null,
    };
  },

  getInitialState() {
    return this.defaultState();
  },

  componentDidMount() {
    this.searchRequest();
  },

  searchRequest() {
    this.setState({ loading: true, });
    $.ajax({
      url: '/activities/search',
      context: this,
      success: this.searchRequestSuccess,
      error: this.errorState,
    });
  },

  selectedFiltersAndFields() {
    return this.state.filters.reduce((selected, filter) => {
      if (filter.selected && filter.selected !== showAllId) {
        selected.push({ field: filter.field, selected: filter.selected, });
      }
      return selected;
    }, []);
  },

  errorState(data) {
    this.setState({ error: data.errorText, });
  },

  clearFilters() {
    this.setState({
      filters: ActivitySearchFilterConfig(),
      activeFilterOn: false,
      searchQuery: '',
    }, this.changeViewableActivities);
  },

  searchRequestSuccess(data) {
    const hash = {
      activitySearchResults: data.activities,
      viewableActivities: data.activities,
      numberOfPages: Math.ceil(data.activities.length / resultsPerPage),
      maxPageNumber: Math.ceil(data.activities.length / resultsPerPage),
      currentPage: 1,
      loading: false,
    };
    this.setState(hash, this.updateFilterOptionsAfterChange);
  },

  updateFilterOptionsAfterChange() {
    // Go through all the filters, and only display the options that are available based on the viewableActivity array
    const availableOptions = this._findFilterOptionsBasedOnActivities();
    const newFilters = [...this.state.filters];
    newFilters.forEach((filter) => {
      filter.options = availableOptions[filter.field];
    });
    this.setState({ filters: newFilters, });
  },

  _findFilterOptionsBasedOnActivities() {
    const filterFields = this.state.filters.map(filter => filter.field);
    const availableOptions = {};
    // get all filter keys and then map them onto availableOptions as empty arrs
    filterFields.forEach((field) => {
      availableOptions[field] = [];
    });
    this.state.viewableActivities.forEach((activity) => {
      filterFields.forEach((field) => {
        if (activity[field].name || activity[field].alias) {
          availableOptions[field].push(activity[field]);
        }
      });
    });
    filterFields.forEach((field) => {
      if (field === 'activity_category') {
        availableOptions[field].unshift({ name: 'All Categories', id: showAllId, });
      } else if (field === 'section') {
        availableOptions[field].unshift({ name: 'All Sections', id: showAllId, });
      }
    });
    return availableOptions;
  },

  updateSearchQuery(newQuery) {
    this.setState({ searchQuery: newQuery, }, this.changeViewableActivities);
  },

  selectFilterOption(field, optionId) {
    let activeFilterOn = true;
    const filters = _.map(this.state.filters, (filter) => {
      if (filter.field == field) {
        // Is this an already selected activity_classification field? Deselect it!
        if (field === 'activity_classification' && filter.selected == optionId) {
          filter.selected = null;
          activeFilterOn = false;
        } else {
          filter.selected = optionId;
        }
      }
      return filter;
    }, this);
    this.setState({ filters, activeFilterOn, }, this.changeViewableActivities);
  },

  activityContainsSearchTerm(activity) {
    const stringActivity = Object.values(activity).join(' ').toLowerCase();
    return stringActivity.includes(this.state.searchQuery.toLowerCase());
  },

  changeViewableActivities() {
    const selectedFiltersAndFields = this.selectedFiltersAndFields();
    const sFFLength = selectedFiltersAndFields.length;
    const viewableActivities = this.state.activitySearchResults.filter((activity) => {
      let matchingFieldCount = 0;
      selectedFiltersAndFields.forEach((filter) => {
        if ((activity[filter.field].id || activity[filter.field]) === filter.selected) {
          matchingFieldCount += 1;
        }
      });
      let matchesSearchQuery = true;
      if (this.state.searchQuery) {
        matchesSearchQuery = this.activityContainsSearchTerm(activity);
      }
      return (matchingFieldCount === sFFLength) && matchesSearchQuery;
    });
    this.setState({ viewableActivities,
      currentPage: 1,
      maxPageNumber: Math.ceil(viewableActivities.length / resultsPerPage),
      numberOfPages: Math.ceil(viewableActivities.length / resultsPerPage),
    }, this.updateFilterOptionsAfterChange);
  },

  updateSort(field, asc_or_desc) {
    const sorts = _.map(this.state.sorts, (sort) => {
      if (sort.field == field) {
        sort.selected = true;
        sort.asc_or_desc = asc_or_desc;
      } else {
        sort.selected = false;
        sort.asc_or_desc = 'asc';
      }
      return sort;
    }, this);
    this.setState({ sorts, }, this.sort);
  },

  sort() {
    let visActs = [...this.state.viewableActivities];
    this.state.sorts.forEach((sortObj) => {
      // iterate through each sorter, and activate it;
      if (sortObj.selected) {
        visActs = _.sortBy(visActs, obj => _l.get(obj, sortObj.sortPath));
        if (sortObj.asc_or_desc === 'desc') {
          // reverse sorter if necessary
          visActs = visActs.reverse();
        }
      }
    });
    this.setState({ viewableActivities: visActs, });
  },

  selectPageNumber(number) {
    this.setState({ currentPage: number, });
  },

  currentPageResults() {
    const lowerBound = (this.state.currentPage - 1) * resultsPerPage;
    const upperBound = (this.state.currentPage) * resultsPerPage;
    return this.state.viewableActivities.slice(lowerBound, upperBound);
  },

  render() {
    let table,
      loading,
      pagination;
    if (this.state.loading) {
      loading = <LoadingIndicator />;
    } else if (this.state.error) {
      table = <span>We're experiencing the following error: {this.state.error}</span>;
    } else {
      pagination = <Pagination maxPageNumber={this.state.maxPageNumber} selectPageNumber={this.selectPageNumber} currentPage={this.state.currentPage} numberOfPages={this.state.numberOfPages} />;
      table = <ActivitySearchResults selectedActivities={this.props.selectedActivities} currentPageSearchResults={this.currentPageResults()} toggleActivitySelection={this.props.toggleActivitySelection} />;
    }
    return (
      <section>
        <div className="flex-row space-between vertically-centered header-and-link">
          <h1 className="explore-activities-header">Explore Activities & Create Activity Pack</h1>
          <a className="how-we-grade" href="https://support.quill.org/activities-implementation/how-does-grading-work">Common Core Standards vs. Students’ Levels<i className="fa fa-long-arrow-right" /></a>
        </div>
        <ActivitySearchAndFilters
          showAllId={showAllId}
          updateSearchQuery={this.updateSearchQuery}
          searchQuery={this.state.searchQuery}
          selectFilterOption={this.selectFilterOption}
          data={this.state.filters}
          clearFilters={this.clearFilters}
          activeFilterOn={this.state.activeFilterOn}
        />
        <table className="table activity-table search-and-select green-rows-on-hover">
          <thead>
            <ActivitySearchSorts updateSort={this.updateSort} sorts={this.state.sorts} />
          </thead>
          {table}
        </table>
        {loading}
        {pagination}
        <SelectedActivities
          clickContinue={this.props.clickContinue}
          errorMessage={this.props.errorMessage || ''}
          selectedActivities={this.props.selectedActivities}
          toggleActivitySelection={this.props.toggleActivitySelection}
          unitName={this.props.unitName}
          sortable={this.props.sortable}
          sortCallback={this.props.sortCallback}
        />
      </section>
    );
  },
});
