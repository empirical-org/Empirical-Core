import React from 'react';
import _ from 'underscore';
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
      activitySearchResults: [],
      currentPageSearchResults: [],
      viewableActivities: [],
      currentPage: 1,
      searchQuery: '',
      numberOfPages: 1,
      resultsPerPage: 12,
      maxPageNumber: 4,
      allFilterOptions: {
        section: [],
        activity_category: [],
        activity_classification: [],
      },
      filters: ActivitySearchFilterConfig,
      sorts: ActivitySearchSortConfig,
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
      if (filter.selected) {
        selected.push({ field: filter.field, selected: filter.selected, });
      }
      return selected;
    }, []);
  },

  errorState(data) {
    this.setState({ error: data.errorText, });
  },

  clearFilters() {
    const clearedFilters = this.state.filters.map((filter) => {
      filter.selected = null;
      return filter;
    });
    this.setState({
      filters: clearedFilters,
      activeFilterOn: false,
    });
    this.updateSearchQuery('');
  },

  searchRequestSuccess(data) {
    const hash = {
      activitySearchResults: data.activities,
      viewableActivities: data.activities,
      numberOfPages: data.number_of_pages,
      currentPage: 1,
      loading: false,
    };
    this.setState(hash, this.updateFilterOptionsAfterChange);
  },

  updateFilterOptionsAfterChange() {
    // Go through all the filters, and only display the options that are available based on the currently viewable activity set
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
    filterFields.forEach((field) => { availableOptions[field] = new Set(); });
    this.state.viewableActivities.forEach((activity) => {
      filterFields.forEach((field) => {
        availableOptions[field].add(activity[field]);
      });
    });
    filterFields.forEach((field) => {
      availableOptions[field] = Array.from(availableOptions[field]);
    });
    return availableOptions;
  },

  // Super bad pluralize function.
  pluralize(str) {
    if (str === 'activity_category') {
      return 'activity_categories';
    }
    return `${str}s`;
  },

  determineCurrentPageSearchResults() {
    let start,
      end,
      currentPageSearchResults;
    start = (this.state.currentPage - 1) * this.state.resultsPerPage;
    end = this.state.currentPage * this.state.resultsPerPage;
    currentPageSearchResults = this.state.activitySearchResults.slice(start, end);
    return currentPageSearchResults;
  },

  updateSearchQuery(newQuery) {
    this.setState({ searchQuery: newQuery, }, this.changeViewableActivities);
  },

  selectFilterOption(field, optionId) {
    const filters = _.map(this.state.filters, (filter) => {
      if (filter.field == field) {
        filter.selected = optionId;
      }
      return filter;
    }, this);
    this.setState({ filters, activeFilterOn: true, }, this.changeViewableActivities);
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
    this.setState({ viewableActivities, }, this.updateFilterOptionsAfterChange);
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
    this.setState({ sorts, });
    // this.searchRequest();
  },

  selectPageNumber(number) {
    this.setState({ currentPage: number, });
  },

  currentPageResults() {
    const resultsPerPage = 50;
    const lowerBound = (this.state.currentPage - 1) * resultsPerPage;
    const upperBound = (this.state.currentPage) * resultsPerPage;
    return this.state.viewableActivities.slice(lowerBound, upperBound);
  },

  render() {
    const currentPageSearchResults = this.determineCurrentPageSearchResults();
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
        <h1 className="explore-activities-header">Explore Activities & Create Activity Pack</h1>

        <ActivitySearchAndFilters
          updateSearchQuery={this.updateSearchQuery}
          searchQuery={this.state.searchQuery}
          selectFilterOption={this.selectFilterOption}
          data={this.state.filters}
          clearFilters={this.clearFilters}
          activeFilterOn={this.state.activeFilterOn}
        />

        <table className="table activity-table search-and-select">
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
          sortable={this.props.sortable}
          sortCallback={this.props.sortCallback}
        />
      </section>
    );
  },
});
