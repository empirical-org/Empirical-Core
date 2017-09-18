import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import ActivitySearchAndFilters from './activity_search_filters/activity_search_filters';
import ActivitySearchFilterConfig from './activity_search_filters/activity_search_filter_config';
import ActivitySearchSort from './activity_search_sort/activity_search_sort';
import ActivitySearchSortConfig from './activity_search_sort/activity_search_sort_config';
import ActivitySearchSorts from './activity_search_sort/activity_search_sorts';
import ActivitySearchResults from './activity_search_results/activity_search_results';
import Pagination from './pagination/pagination';
import SelectedActivities from './selected_activities/selected_activities';
import LoadingIndicator from '../../../shared/loading_indicator.jsx';
import getParameterByName from '../../../modules/get_parameter_by_name'

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
      currentPage: 1,
      searchQuery: '',
      numberOfPages: 1,
      resultsPerPage: 12,
      maxPageNumber: 4,
      allFilterOptions: {
        section: [],
        topic_category: [],
        activity_classification: [],
      },
      filters: ActivitySearchFilterConfig,
      sorts: ActivitySearchSortConfig,
      activeFilterOn: getParameterByName('tool') ? true : false,
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
      data: this.searchRequestData(),
      success: this.searchRequestSuccess,
      error: this.errorState,
    });
  },

  searchRequestData() {
    const filters = this.state.filters.map(filter => ({
      field: filter.field,
      selected: filter.selected,
    }));

    let currentSort;
    _.each(this.state.sorts, (sort) => {
      if (sort.selected) {
        currentSort = {
          field: sort.field,
          asc_or_desc: sort.asc_or_desc,
        };
      }
    });

    return {
      search: {
        search_query: this.state.searchQuery,
        filters,
        sort: currentSort,
      },
    };
  },

  errorState(data) {
    this.setState({ error: data.errorText, });
  },

  clearFilters() {
    const clearedFilters = this.state.filters.map((filter) => {
      filter.selected = null;
      return filter;
    });
    const that = this;
    this.setState({
      filters: clearedFilters,
      activeFilterOn: false,
    },
    () => { that.searchRequest(); });
    this.updateSearchQuery('');
  },

  searchRequestSuccess(data) {
    const hash = {
      activitySearchResults: data.activities,
      numberOfPages: data.number_of_pages,
      currentPage: 1,
      loading: false,
    };
    this.setInitialFilterOptions(data);
    this.setState(hash, this.updateFilterOptionsAfterRequest);
  },

  setInitialFilterOptions(data) {
    // If the filter options have set already, do not override them.

    const allEmpty = _.all(this.state.allFilterOptions, (options, field) => options.length === 0);
    if (!allEmpty) {
      return;
    }
    const newOptions = {};

    _.each(this.state.allFilterOptions, function (options, field) {
      const key = this.pluralize(field);
      newOptions[field] = data[key];
    }, this);
    this.setState({ allFilterOptions: newOptions, });
  },

  updateFilterOptionsAfterRequest() {
    // Go through all the filters,
    // For each filter that is not currently selected,
    // only display the options that are available based on the set
    // of activity results that have been returned from the server.
    // Otherwise, selected filters will display all available options.
    const availableOptions = this._findFilterOptionsBasedOnActivities();

    const newFilters = this.state.filters;
    newFilters.forEach(function (filter) {
      if (filter.selected) {
        filter.options = this.state.allFilterOptions[filter.field];
      } else {
        filter.options = availableOptions[filter.field];
      }
    }, this);
    this.setState({ filters: newFilters, });
  },

  // Return a hash of the filter options that are available based on the activities
  // that were returned in the search results.
  _findFilterOptionsBasedOnActivities() {
    // This function works like so:
    // Gather all the IDs for properties of the activity that can be filtered.
    // Create a unique set of those IDs (optimization).
    // Go through the sets of filter options returned from the server and remove
    // them from the list of available options if their IDs are not referenced
    // by any of the activities.
    // Return the remaining list.

    let activityClassificationIds = [],
      topicCategoryIds = [],
      sectionIds = [];
    _.each(this.state.activitySearchResults, (activity) => {
      activityClassificationIds.push(activity.classification.id);
      topicCategoryIds.push(activity.topic.topic_category.id);
      if (activity.topic.section) {
        sectionIds.push(activity.topic.section.id);
      }
    });
    activityClassificationIds = _.uniq(activityClassificationIds);
    topicCategoryIds = _.uniq(topicCategoryIds);
    sectionIds = _.uniq(sectionIds);

    const availableOptions = {};
    availableOptions.topic_category = _.reject(this.state.allFilterOptions.topic_category,
      option => !_.contains(topicCategoryIds, option.id));
    availableOptions.section = _.reject(this.state.allFilterOptions.section,
      option => !_.contains(sectionIds, option.id));
    availableOptions.activity_classification = _.reject(this.state.allFilterOptions.activity_classification,
      option => !_.contains(activityClassificationIds, option.id));

    return availableOptions;
  },

  // Super bad pluralize function.
  pluralize(str) {
    if (str === 'topic_category') {
      return 'topic_categories';
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
    this.setState({ searchQuery: newQuery, }, this.searchRequest);
  },

  selectFilterOption(field, optionId) {
    const filters = _.map(this.state.filters, (filter) => {
      if (filter.field == field) {
        filter.selected = optionId;
      }
      return filter;
    }, this);
    this.setState({ filters, activeFilterOn: true, });
    this.searchRequest();
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
    this.searchRequest();
  },

  selectPageNumber(number) {
    this.setState({ currentPage: number, });
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
      table = <ActivitySearchResults selectedActivities={this.props.selectedActivities} currentPageSearchResults={currentPageSearchResults} toggleActivitySelection={this.props.toggleActivitySelection} />;
    }
    return (
      <section>
        <h3 className="section-header">Explore Activities & Create Activity Pack</h3>

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
